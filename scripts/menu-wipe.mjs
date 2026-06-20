#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MENU_TABLE = "MenuItem";
const ORDER_ITEM_TABLE = "OrderItem";

dotenv.config({ path: resolve(ROOT, ".env.local") });

const args = new Set(process.argv.slice(2));
const hasConfirm = args.has("--confirm");
const allowOrderRefs = args.has("--allow-order-refs");

function requireEnv(name) {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function isPostgrestTableError(error) {
  const message = `${error?.message ?? ""} ${error?.details ?? ""} ${error?.hint ?? ""}`.toLowerCase();
  const code = error?.code ?? "";
  return (
    code === "PGRST205" ||
    code === "42P01" ||
    (message.includes("could not find the table") ||
      (message.includes("relation") && message.includes("does not exist")) ||
      message.includes("schema cache"))
  );
}

function createSupabaseAdminClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

async function countOrderItemRefsViaSupabase(supabase) {
  const { count, error } = await supabase
    .from(ORDER_ITEM_TABLE)
    .select("*", { count: "exact", head: true })
    .not("menuItemId", "is", null);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function countOrderItemRefsViaPrisma() {
  const prisma = await getPrisma();
  try {
    const rows = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count
      FROM "OrderItem"
      WHERE "menuItemId" IS NOT NULL
    `;
    return Number(rows[0]?.count ?? 0);
  } finally {
    await prisma.$disconnect();
  }
}

async function countOrderItemRefs(supabase) {
  try {
    const count = await countOrderItemRefsViaSupabase(supabase);
    return { count, path: "supabase-postgrest" };
  } catch (error) {
    if (!isPostgrestTableError(error)) {
      throw error;
    }
    const count = await countOrderItemRefsViaPrisma();
    return { count, path: "prisma-sql (OrderItem pre-flight fallback)" };
  }
}

async function fetchAllMenuItemsViaSupabase(supabase) {
  const pageSize = 1000;
  const all = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from(MENU_TABLE)
      .select("*")
      .range(from, from + pageSize - 1);

    if (error) {
      throw error;
    }

    if (!data?.length) {
      break;
    }

    all.push(...data);

    if (data.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return all;
}

async function fetchAllMenuItemsViaPrisma() {
  requireEnv("DATABASE_URL");
  const prisma = await getPrisma();
  try {
    return await prisma.$queryRaw`SELECT * FROM "MenuItem"`;
  } finally {
    await prisma.$disconnect();
  }
}

async function fetchAllMenuItems(supabase) {
  try {
    const rows = await fetchAllMenuItemsViaSupabase(supabase);
    return { rows, path: "supabase-postgrest" };
  } catch (error) {
    if (!isPostgrestTableError(error)) {
      throw error;
    }
    const rows = await fetchAllMenuItemsViaPrisma();
    return { rows, path: "prisma-sql (MenuItem fallback)" };
  }
}

async function deleteAllMenuItemsViaSupabase(supabase) {
  const { error, count } = await supabase
    .from(MENU_TABLE)
    .delete({ count: "exact" })
    .not("id", "is", null);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function deleteAllMenuItemsViaPrisma() {
  requireEnv("DATABASE_URL");
  const prisma = await getPrisma();
  try {
    const deleted = await prisma.$executeRaw`DELETE FROM "MenuItem"`;
    return Number(deleted);
  } finally {
    await prisma.$disconnect();
  }
}

async function finalMenuCountViaSupabase(supabase) {
  const { count, error } = await supabase
    .from(MENU_TABLE)
    .select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function finalMenuCountViaPrisma() {
  const prisma = await getPrisma();
  try {
    const rows = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count FROM "MenuItem"
    `;
    return Number(rows[0]?.count ?? 0);
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteAllMenuItems(supabase, apiPath) {
  if (apiPath === "supabase-postgrest") {
    const deleted = await deleteAllMenuItemsViaSupabase(supabase);
    const remaining = await finalMenuCountViaSupabase(supabase);
    return { deleted, remaining };
  }

  const deleted = await deleteAllMenuItemsViaPrisma();
  const remaining = await finalMenuCountViaPrisma();
  return { deleted, remaining };
}

function timestampForFilename(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, "-");
}

async function writeBackup(rows) {
  const backupsDir = resolve(ROOT, "backups");
  await mkdir(backupsDir, { recursive: true });

  const backupPath = resolve(
    backupsDir,
    `menu-backup-${timestampForFilename()}.json`,
  );

  const payload = {
    table: MENU_TABLE,
    exportedAt: new Date().toISOString(),
    rowCount: rows.length,
    rows,
  };

  await writeFile(backupPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return backupPath;
}

async function main() {
  console.log("menu-wipe: loading env from .env.local");
  console.log("menu-wipe: table target = MenuItem (menu-images bucket untouched)");

  const supabase = createSupabaseAdminClient();

  const preflight = await countOrderItemRefs(supabase);
  console.log(
    `Pre-flight: OrderItem rows with menuItemId IS NOT NULL = ${preflight.count}`,
  );
  console.log(`Pre-flight path: ${preflight.path}`);

  if (preflight.count > 0 && !allowOrderRefs) {
    console.error(
      "\nAborting: live order history references menu items.",
    );
    console.error(
      "Re-run with --allow-order-refs if you accept orphaned menuItemId values on historical orders.",
    );
    process.exit(1);
  }

  if (preflight.count > 0 && allowOrderRefs) {
    console.log(
      "Proceeding with --allow-order-refs: historical OrderItem.menuItemId values may become orphaned.",
    );
  }

  if (!hasConfirm) {
    console.log(
      "\nDry run complete. No backup written and no rows deleted.",
    );
    console.log(
      "To wipe menu items, run: node scripts/menu-wipe.mjs --confirm",
    );
    if (preflight.count > 0) {
      console.log(
        "Because order references exist, also pass: --allow-order-refs",
      );
    }
    return;
  }

  console.log("\n--confirm received. Exporting backup before delete...");

  const { rows, path: apiPath } = await fetchAllMenuItems(supabase);

  let backupPath;
  try {
    backupPath = await writeBackup(rows);
  } catch (error) {
    console.error("\nBackup write failed. Aborting before delete.");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log(`Backup written: ${backupPath}`);
  console.log(`Backup row count: ${rows.length}`);
  console.log(`Delete path: ${apiPath}`);

  const { deleted, remaining } = await deleteAllMenuItems(supabase, apiPath);

  console.log(`Rows deleted: ${deleted}`);
  console.log(`Final MenuItem count: ${remaining}`);

  if (remaining !== 0) {
    console.error(
      "\nWarning: final MenuItem count is not 0. Review the database manually.",
    );
    process.exit(1);
  }

  console.log("\nMenu wipe completed successfully.");
}

main().catch((error) => {
  console.error("\nmenu-wipe failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

import { randomUUID } from "crypto";

import { embedTexts, vectorToSql } from "@/lib/ai/embeddings";
import { chunkMenuItem, loadMdxChunks } from "@/lib/knowledge/chunker";
import type {
  KnowledgeChunkInput,
  KnowledgeChunkRecord,
  KnowledgeSource,
} from "@/lib/knowledge/types";
import { prisma } from "@/lib/db/client";
import { getMenuItemForAdmin } from "@/lib/db/menu";
import { toMenuItem } from "@/lib/db/mappers";

type ChunkRow = {
  id: string;
  source: string;
  sourceRef: string | null;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

function mapRow(row: ChunkRow): KnowledgeChunkRecord {
  return {
    id: row.id,
    source: row.source as KnowledgeSource,
    sourceRef: row.sourceRef,
    title: row.title,
    content: row.content,
    metadata: row.metadata,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function upsertChunk(
  input: KnowledgeChunkInput,
  embedding: number[],
): Promise<void> {
  const id = randomUUID();
  const vector = vectorToSql(embedding);
  const metadata = JSON.stringify(input.metadata);

  await prisma.$executeRawUnsafe(
    `INSERT INTO "KnowledgeChunk" (id, source, "sourceRef", title, content, metadata, embedding, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::vector, NOW(), NOW())
     ON CONFLICT (source, "sourceRef")
     DO UPDATE SET
       title = EXCLUDED.title,
       content = EXCLUDED.content,
       metadata = EXCLUDED.metadata,
       embedding = EXCLUDED.embedding,
       "updatedAt" = NOW()`,
    id,
    input.source,
    input.sourceRef,
    input.title,
    input.content,
    metadata,
    vector,
  );
}

async function upsertChunks(inputs: KnowledgeChunkInput[]): Promise<number> {
  if (inputs.length === 0) {
    return 0;
  }

  const embeddings = await embedTexts(inputs.map((item) => item.content));

  for (let i = 0; i < inputs.length; i += 1) {
    const input = inputs[i];
    const embedding = embeddings[i];
    if (!input || !embedding) {
      continue;
    }
    await upsertChunk(input, embedding);
  }

  return inputs.length;
}

export async function removeMenuItemFromIndex(slug: string): Promise<void> {
  await prisma.$executeRaw`
    DELETE FROM "KnowledgeChunk"
    WHERE source = 'menu' AND "sourceRef" = ${slug}
  `;
}

export async function indexMenuItem(slug: string): Promise<void> {
  const item = await getMenuItemForAdmin(slug);
  if (!item) {
    await removeMenuItemFromIndex(slug);
    return;
  }

  const chunk = chunkMenuItem(item);
  const [embedding] = await embedTexts([chunk.content]);
  if (!embedding) {
    throw new Error(`Failed to embed menu item: ${slug}`);
  }

  await upsertChunk(chunk, embedding);
}

export async function indexAllMenuItems(): Promise<number> {
  const rows = await prisma.menuItem.findMany({ orderBy: { name: "asc" } });
  const inputs = rows.map((row) => chunkMenuItem(toMenuItem(row)));
  return upsertChunks(inputs);
}

export async function indexFaqContent(): Promise<number> {
  const chunks = await loadMdxChunks("faq.mdx", "faq", "faq");
  return upsertChunks(chunks);
}

export async function indexAboutContent(): Promise<number> {
  const chunks = await loadMdxChunks("about.mdx", "about", "about");
  return upsertChunks(chunks);
}

export async function indexPolicyContent(): Promise<number> {
  const chunks = await loadMdxChunks("policies.mdx", "policy", "policy");
  return upsertChunks(chunks);
}

export async function indexAllKnowledge(): Promise<{
  menu: number;
  faq: number;
  about: number;
  policy: number;
  total: number;
}> {
  const [menu, faq, about, policy] = await Promise.all([
    indexAllMenuItems(),
    indexFaqContent(),
    indexAboutContent(),
    indexPolicyContent(),
  ]);

  return {
    menu,
    faq,
    about,
    policy,
    total: menu + faq + about + policy,
  };
}

export async function getKnowledgeChunks(
  source?: KnowledgeSource,
): Promise<KnowledgeChunkRecord[]> {
  const rows = source
    ? await prisma.$queryRaw<ChunkRow[]>`
        SELECT id, source, "sourceRef", title, content, metadata, "createdAt", "updatedAt"
        FROM "KnowledgeChunk"
        WHERE source = ${source}
        ORDER BY title ASC
      `
    : await prisma.$queryRaw<ChunkRow[]>`
        SELECT id, source, "sourceRef", title, content, metadata, "createdAt", "updatedAt"
        FROM "KnowledgeChunk"
        ORDER BY source ASC, title ASC
      `;

  return rows.map(mapRow);
}

export async function getKnowledgeStats(): Promise<{
  totalChunks: number;
  lastIndexedAt: Date | null;
  bySource: Record<string, number>;
}> {
  const counts = await prisma.$queryRaw<
    Array<{ source: string; count: bigint }>
  >`
    SELECT source, COUNT(*)::bigint AS count
    FROM "KnowledgeChunk"
    GROUP BY source
  `;

  const lastIndexed = await prisma.$queryRaw<
    Array<{ max: Date | null }>
  >`
    SELECT MAX("updatedAt") AS max FROM "KnowledgeChunk"
  `;

  const bySource: Record<string, number> = {};
  let totalChunks = 0;

  for (const row of counts) {
    const count = Number(row.count);
    bySource[row.source] = count;
    totalChunks += count;
  }

  return {
    totalChunks,
    lastIndexedAt: lastIndexed[0]?.max ?? null,
    bySource,
  };
}

export async function safeIndexMenuItem(slug: string): Promise<void> {
  try {
    await indexMenuItem(slug);
  } catch (error) {
    console.error(`[knowledge] Failed to index menu item ${slug}:`, error);
  }
}

export async function safeRemoveMenuItem(slug: string): Promise<void> {
  try {
    await removeMenuItemFromIndex(slug);
  } catch (error) {
    console.error(`[knowledge] Failed to remove menu item ${slug}:`, error);
  }
}

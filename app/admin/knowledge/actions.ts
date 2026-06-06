"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin/auth";
import { captureHandledError, withAdminAction } from "@/lib/sentry/admin";
import type { ActionResult } from "@/lib/admin/types";
import { indexAllKnowledge } from "@/lib/knowledge/indexer";

export async function reindexAllKnowledgeAction(): Promise<
  ActionResult<{
    menu: number;
    faq: number;
    about: number;
    policy: number;
    total: number;
  }>
> {
  return withAdminAction("reindexAllKnowledge", async () => {
  try {
    await requireAdminSession();

    const result = await indexAllKnowledge();
    revalidatePath("/admin/knowledge");

    return { success: true, data: result };
  } catch (error) {
    captureHandledError(error, { action: "reindexAllKnowledge" });
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to re-index knowledge",
    };
  }
  });
}

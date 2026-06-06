"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { reindexAllKnowledgeAction } from "@/app/admin/knowledge/actions";
import { Button } from "@/components/ui/button";

export function KnowledgeReindexButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleReindex() {
    startTransition(async () => {
      const result = await reindexAllKnowledgeAction();
      if (result.success) {
        toast.success(
          `Re-indexed ${result.data?.total ?? 0} chunks successfully`,
        );
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button type="button" onClick={handleReindex} disabled={isPending}>
      {isPending ? "Re-indexing…" : "Re-index All"}
    </Button>
  );
}

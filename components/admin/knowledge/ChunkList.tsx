import { ChunkCard } from "@/components/admin/knowledge/ChunkCard";
import type { KnowledgeChunkRecord } from "@/lib/knowledge/types";

export interface ChunkListProps {
  chunks: KnowledgeChunkRecord[];
}

export function ChunkList({ chunks }: ChunkListProps) {
  if (chunks.length === 0) {
    return (
      <p className="rounded-2xl border border-green-soft/20 bg-bg px-6 py-12 text-center text-text/60">
        No chunks indexed for this source yet. Run &quot;Re-index All&quot; to
        populate the knowledge base.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {chunks.map((chunk) => (
        <ChunkCard key={chunk.id} chunk={chunk} />
      ))}
    </div>
  );
}

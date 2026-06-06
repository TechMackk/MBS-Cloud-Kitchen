import { format } from "date-fns";

import type { KnowledgeChunkRecord } from "@/lib/knowledge/types";

export interface ChunkCardProps {
  chunk: KnowledgeChunkRecord;
}

export function ChunkCard({ chunk }: ChunkCardProps) {
  const preview =
    chunk.content.length > 200
      ? `${chunk.content.slice(0, 200)}…`
      : chunk.content;

  return (
    <article className="rounded-xl border border-green-soft/20 bg-bg p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium text-green-deep">{chunk.title}</h3>
        <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text/60">
          {chunk.source}
        </span>
      </div>
      <p className="text-sm text-text/70">{preview}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-text/50">
        {chunk.sourceRef && <span>Ref: {chunk.sourceRef}</span>}
        <span>Updated {format(chunk.updatedAt, "dd MMM yyyy, h:mm a")}</span>
      </div>
    </article>
  );
}

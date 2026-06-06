import { embedQuery, vectorToSql } from "@/lib/ai/embeddings";
import type { RetrievedChunk } from "@/lib/knowledge/types";
import { prisma } from "@/lib/db/client";

type RetrievedRow = {
  id: string;
  source: string;
  sourceRef: string | null;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  distance: number;
};

export async function retrieveContext(
  query: string,
  topK = 5,
): Promise<RetrievedChunk[]> {
  const embedding = await embedQuery(query);
  const vector = vectorToSql(embedding);

  const rows = await prisma.$queryRawUnsafe<RetrievedRow[]>(
    `SELECT
      id,
      source,
      "sourceRef",
      title,
      content,
      metadata,
      "createdAt",
      "updatedAt",
      embedding <=> $1::vector AS distance
    FROM "KnowledgeChunk"
    WHERE embedding IS NOT NULL
      AND NOT (
        source = 'menu'
        AND COALESCE((metadata->>'isAvailable')::boolean, true) = false
      )
    ORDER BY distance
    LIMIT $2`,
    vector,
    topK,
  );

  return rows.map((row) => ({
    id: row.id,
    source: row.source as RetrievedChunk["source"],
    sourceRef: row.sourceRef,
    title: row.title,
    content: row.content,
    metadata: row.metadata,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    distance: Number(row.distance),
  }));
}

export function formatContextForPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return "No specific context retrieved for this query.";
  }

  return chunks
    .map(
      (chunk, index) =>
        `[${index + 1}] (${chunk.source}) ${chunk.title}\n${chunk.content}`,
    )
    .join("\n\n");
}

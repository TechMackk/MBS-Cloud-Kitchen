export type KnowledgeSource = "menu" | "faq" | "about" | "policy";

export type KnowledgeChunkRecord = {
  id: string;
  source: KnowledgeSource;
  sourceRef: string | null;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

export type KnowledgeChunkInput = {
  source: KnowledgeSource;
  sourceRef: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
};

export type RetrievedChunk = KnowledgeChunkRecord & {
  distance: number;
};

export type ChatMessageRecord = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

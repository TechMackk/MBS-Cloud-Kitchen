import { createOpenAI } from "@ai-sdk/openai";

export function getChatModelId(): string {
  return process.env.AI_CHAT_MODEL ?? "gpt-4o-mini";
}

export function getEmbeddingModelId(): string {
  return process.env.AI_EMBEDDING_MODEL ?? "text-embedding-3-small";
}

export function getMaxTokensPerResponse(): number {
  const value = Number(process.env.AI_MAX_TOKENS_PER_RESPONSE ?? "500");
  return Number.isFinite(value) && value > 0 ? value : 500;
}

export function getOpenAIProvider() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return createOpenAI({ apiKey });
}

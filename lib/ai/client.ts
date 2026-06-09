import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export const EMBEDDING_DIMENSIONS = 1536;

export type AIProviderName = "gemini" | "openai";

export function getGeminiApiKey(): string | undefined {
  const key =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  return key || undefined;
}

export function getActiveAIProvider(): AIProviderName | null {
  if (getGeminiApiKey()) {
    return "gemini";
  }
  if (process.env.OPENAI_API_KEY?.trim()) {
    return "openai";
  }
  return null;
}

export function isChatConfigured(): boolean {
  return getActiveAIProvider() !== null;
}

export function getChatModelId(): string {
  if (process.env.AI_CHAT_MODEL?.trim()) {
    return process.env.AI_CHAT_MODEL.trim();
  }

  return getActiveAIProvider() === "gemini"
    ? "gemini-2.0-flash"
    : "gpt-4o-mini";
}

export function getEmbeddingModelId(): string {
  if (process.env.AI_EMBEDDING_MODEL?.trim()) {
    return process.env.AI_EMBEDDING_MODEL.trim();
  }

  return getActiveAIProvider() === "gemini"
    ? "text-embedding-004"
    : "text-embedding-3-small";
}

export function getMaxTokensPerResponse(): number {
  const value = Number(process.env.AI_MAX_TOKENS_PER_RESPONSE ?? "500");
  return Number.isFinite(value) && value > 0 ? value : 500;
}

export function getOpenAIProvider() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return createOpenAI({ apiKey });
}

export function getGoogleProvider() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return createGoogleGenerativeAI({ apiKey });
}

export function getChatModel(): LanguageModel {
  const provider = getActiveAIProvider();

  if (provider === "gemini") {
    return getGoogleProvider()(getChatModelId());
  }

  if (provider === "openai") {
    return getOpenAIProvider()(getChatModelId());
  }

  throw new Error("No AI provider configured");
}

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export const EMBEDDING_DIMENSIONS = 1536;

export type AIProviderName = "gemini" | "openai";

const GEMINI_CHAT_DEFAULT = "gemini-1.5-flash";
const OPENAI_CHAT_DEFAULT = "gpt-4o-mini";
const GEMINI_EMBEDDING_DEFAULT = "text-embedding-004";
const OPENAI_EMBEDDING_DEFAULT = "text-embedding-3-small";

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

function isGeminiModelId(modelId: string): boolean {
  return modelId.startsWith("gemini");
}

function isOpenAIModelId(modelId: string): boolean {
  return (
    modelId.startsWith("gpt") ||
    modelId.startsWith("o1") ||
    modelId.startsWith("o3") ||
    modelId.startsWith("o4")
  );
}

function isGeminiEmbeddingModelId(modelId: string): boolean {
  return modelId.includes("embedding-004") || modelId.startsWith("gemini-embedding");
}

function isOpenAIEmbeddingModelId(modelId: string): boolean {
  return modelId.startsWith("text-embedding");
}

export function getChatModelId(): string {
  const provider = getActiveAIProvider();
  const configured = process.env.AI_CHAT_MODEL?.trim();

  if (provider === "gemini") {
    if (configured && isGeminiModelId(configured)) {
      return configured;
    }
    if (configured && !isGeminiModelId(configured)) {
      console.warn(
        `[ai] Ignoring AI_CHAT_MODEL="${configured}" for Gemini — using ${GEMINI_CHAT_DEFAULT}`,
      );
    }
    return GEMINI_CHAT_DEFAULT;
  }

  if (provider === "openai") {
    if (configured && (isOpenAIModelId(configured) || !isGeminiModelId(configured))) {
      return configured;
    }
    if (configured && isGeminiModelId(configured)) {
      console.warn(
        `[ai] Ignoring AI_CHAT_MODEL="${configured}" for OpenAI — using ${OPENAI_CHAT_DEFAULT}`,
      );
    }
    return OPENAI_CHAT_DEFAULT;
  }

  return OPENAI_CHAT_DEFAULT;
}

export function getEmbeddingModelId(): string {
  const provider = getActiveAIProvider();
  const configured = process.env.AI_EMBEDDING_MODEL?.trim();

  if (provider === "gemini") {
    if (configured && isGeminiEmbeddingModelId(configured)) {
      return configured;
    }
    if (configured && isOpenAIEmbeddingModelId(configured)) {
      console.warn(
        `[ai] Ignoring AI_EMBEDDING_MODEL="${configured}" for Gemini — using ${GEMINI_EMBEDDING_DEFAULT}`,
      );
    }
    return GEMINI_EMBEDDING_DEFAULT;
  }

  if (provider === "openai") {
    if (configured && isOpenAIEmbeddingModelId(configured)) {
      return configured;
    }
    if (configured && isGeminiEmbeddingModelId(configured)) {
      console.warn(
        `[ai] Ignoring AI_EMBEDDING_MODEL="${configured}" for OpenAI — using ${OPENAI_EMBEDDING_DEFAULT}`,
      );
    }
    return OPENAI_EMBEDDING_DEFAULT;
  }

  return OPENAI_EMBEDDING_DEFAULT;
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

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import OpenAI from "openai";

import {
  EMBEDDING_DIMENSIONS,
  getActiveAIProvider,
  getEmbeddingModelId,
  getGeminiApiKey,
} from "@/lib/ai/client";

const MAX_BATCH_SIZE = 100;
const MAX_RETRIES = 3;

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return new OpenAI({ apiKey });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedWithGemini(texts: string[]): Promise<number[][]> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const model = google.textEmbeddingModel(getEmbeddingModelId(), {
    outputDimensionality: EMBEDDING_DIMENSIONS,
  });

  if (texts.length === 1) {
    const { embedding } = await embed({ model, value: texts[0]! });
    return [embedding];
  }

  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    const batch = texts.slice(i, i + MAX_BATCH_SIZE);
    const { embeddings } = await embedMany({ model, values: batch });
    results.push(...embeddings);
  }

  return results;
}

async function embedWithOpenAI(texts: string[]): Promise<number[][]> {
  const client = getOpenAIClient();
  const model = getEmbeddingModelId();
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    const batch = texts.slice(i, i + MAX_BATCH_SIZE);

    for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
      try {
        const response = await client.embeddings.create({
          model,
          input: batch,
          dimensions: EMBEDDING_DIMENSIONS,
        });

        const sorted = [...response.data].sort((a, b) => a.index - b.index);
        results.push(...sorted.map((item) => item.embedding));
        break;
      } catch (error) {
        const isRateLimit =
          error instanceof OpenAI.APIError && error.status === 429;

        if (!isRateLimit || attempt === MAX_RETRIES - 1) {
          throw error;
        }

        const delay = 2 ** attempt * 1000;
        console.warn(
          `[embeddings] Rate limited, retrying in ${delay}ms...`,
        );
        await sleep(delay);
      }
    }
  }

  return results;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const provider = getActiveAIProvider();
  if (provider === "gemini") {
    return embedWithGemini(texts);
  }

  return embedWithOpenAI(texts);
}

export async function embedQuery(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  if (!embedding) {
    throw new Error("Failed to generate query embedding");
  }
  return embedding;
}

export function vectorToSql(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

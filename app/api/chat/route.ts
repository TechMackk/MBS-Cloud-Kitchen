import * as Sentry from "@sentry/nextjs";
import { APICallError, streamText, type CoreMessage } from "ai";

import {
  getActiveAIProvider,
  getChatModel,
  getChatModelId,
  getMaxTokensPerResponse,
  isChatConfigured,
} from "@/lib/ai/client";
import { buildSystemPrompt } from "@/lib/chat/prompt";
import {
  isSessionOverLimit,
  persistChatSession,
} from "@/lib/chat/session";
import { retrieveContext } from "@/lib/knowledge/retrieve";
import { checkChatRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const MAX_USER_MESSAGE_LENGTH = 500;

type ChatRequestBody = {
  messages?: Array<{ role: string; content: string }>;
  sessionId?: string;
};

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function formatChatError(error: unknown): string {
  if (APICallError.isInstance(error)) {
    const status = error.statusCode ? ` (${error.statusCode})` : "";
    const body =
      typeof error.responseBody === "string" && error.responseBody.trim()
        ? `: ${error.responseBody.slice(0, 200)}`
        : "";
    return `${error.message}${status}${body}`;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Unknown chat error";
}

/** Lightweight health check — confirms provider + model resolution (no secrets). */
export async function GET() {
  if (!isChatConfigured()) {
    return jsonError("Chat AI provider is not configured", 503);
  }

  return Response.json({
    ok: true,
    provider: getActiveAIProvider(),
    model: getChatModelId(),
  });
}

export async function POST(request: Request) {
  try {
    if (!isChatConfigured()) {
      return jsonError(
        "Chat is temporarily unavailable. Please WhatsApp us at +91 81796 56696.",
        503,
      );
    }

    const body = (await request.json()) as ChatRequestBody;
    const messages = body.messages ?? [];
    const sessionId = body.sessionId?.trim();

    if (!sessionId) {
      return jsonError("Invalid session", 400);
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");

    if (!lastUserMessage?.content?.trim()) {
      return jsonError("Message is required", 400);
    }

    if (lastUserMessage.content.length > MAX_USER_MESSAGE_LENGTH) {
      return jsonError(
        `Message too long (max ${MAX_USER_MESSAGE_LENGTH} characters)`,
        400,
      );
    }

    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;

    const rateLimit = await checkChatRateLimit(ip);
    if (!rateLimit.success) {
      return jsonError(
        "You've reached the hourly message limit. Please try again later or WhatsApp us at +91 81796 56696.",
        429,
      );
    }

    try {
      if (await isSessionOverLimit(sessionId)) {
        return jsonError(
          "This chat session has reached its message limit. Please start a new session or contact us on WhatsApp.",
          429,
        );
      }
    } catch (sessionError) {
      console.error("[chat] session limit check failed:", sessionError);
      Sentry.captureException(sessionError);
      // Continue without session limit if DB is temporarily unavailable.
    }

    let chunks: Awaited<ReturnType<typeof retrieveContext>> = [];
    try {
      chunks = await retrieveContext(lastUserMessage.content, 5);
    } catch (ragError) {
      console.error("[chat] knowledge retrieval failed:", ragError);
      Sentry.captureException(ragError);
      // Continue with empty context so chat still works without RAG.
    }

    const system = buildSystemPrompt(chunks);

    const coreMessages: CoreMessage[] = messages
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    const result = streamText({
      model: getChatModel(),
      system,
      messages: coreMessages,
      maxTokens: getMaxTokensPerResponse(),
      temperature: 0.7,
      onFinish: async ({ text }: { text: string }) => {
        try {
          const fullMessages = [
            ...messages,
            { role: "assistant", content: text },
          ];

          await persistChatSession({
            sessionId,
            messages: fullMessages,
            ipAddress: ip,
            userAgent,
          });
        } catch (persistError) {
          console.error("[chat] session persist failed:", persistError);
          Sentry.captureException(persistError);
        }
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: formatChatError,
    });
  } catch (error) {
    Sentry.setTag("route", "/api/chat");
    Sentry.setTag("user_role", "anonymous");
    Sentry.captureException(error);
    const detail = formatChatError(error);
    console.error("[chat]", detail, error);
    return jsonError(
      `Chat error: ${detail}. Please try again or WhatsApp us at +91 81796 56696.`,
      500,
    );
  }
}

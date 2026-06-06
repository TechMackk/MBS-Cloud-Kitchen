import type { ChatMessageRecord } from "@/lib/knowledge/types";
import { prisma } from "@/lib/db/client";
import { getSessionMessageLimitValue } from "@/lib/rate-limit";

export type PersistChatInput = {
  sessionId: string;
  messages: Array<{ role: string; content: string }>;
  ipAddress?: string;
  userAgent?: string;
};

export async function getSessionMessageCount(
  sessionId: string,
): Promise<number> {
  const session = await prisma.chatSession.findUnique({
    where: { sessionId },
    select: { messageCount: true },
  });

  return session?.messageCount ?? 0;
}

export async function isSessionOverLimit(sessionId: string): Promise<boolean> {
  const count = await getSessionMessageCount(sessionId);
  return count >= getSessionMessageLimitValue();
}

export async function persistChatSession(
  input: PersistChatInput,
): Promise<void> {
  const now = new Date().toISOString();
  const storedMessages: ChatMessageRecord[] = input.messages
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
      createdAt: now,
    }));

  const userMessageCount = storedMessages.filter(
    (msg) => msg.role === "user",
  ).length;

  await prisma.chatSession.upsert({
    where: { sessionId: input.sessionId },
    create: {
      sessionId: input.sessionId,
      messages: storedMessages,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      messageCount: userMessageCount,
    },
    update: {
      messages: storedMessages,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      messageCount: userMessageCount,
    },
  });
}

export async function getChatSessions(options?: {
  limit?: number;
  offset?: number;
}) {
  return prisma.chatSession.findMany({
    orderBy: { updatedAt: "desc" },
    take: options?.limit,
    skip: options?.offset,
  });
}

export async function countChatSessions(): Promise<number> {
  return prisma.chatSession.count();
}

export async function getChatSessionById(id: string) {
  return prisma.chatSession.findUnique({ where: { id } });
}

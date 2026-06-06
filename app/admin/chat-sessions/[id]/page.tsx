import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/auth";
import { getChatSessionById } from "@/lib/chat/session";
import type { ChatMessageRecord } from "@/lib/knowledge/types";

export const dynamic = "force-dynamic";

type ChatSessionDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ showIp?: string }>;
};

export default async function ChatSessionDetailPage({
  params,
  searchParams,
}: ChatSessionDetailPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const query = await searchParams;
  const showIp = query.showIp === "1";

  const chatSession = await getChatSessionById(id);
  if (!chatSession) {
    redirect("/admin/chat-sessions");
  }

  const messages = chatSession.messages as ChatMessageRecord[];

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <div className="mb-6">
        <Link
          href="/admin/chat-sessions"
          className="text-sm text-text/60 hover:text-green-deep"
        >
          ← Back to Chat Sessions
        </Link>
      </div>

      <h1 className="mb-2 font-heading text-2xl font-bold text-green-deep">
        Chat Session
      </h1>
      <p className="mb-6 font-mono text-xs text-text/50">
        {chatSession.sessionId}
      </p>

      <dl className="mb-8 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-text/60">Messages</dt>
          <dd className="font-medium">{chatSession.messageCount}</dd>
        </div>
        <div>
          <dt className="text-text/60">Last active</dt>
          <dd>
            {format(chatSession.updatedAt, "dd MMM yyyy, h:mm a")}
          </dd>
        </div>
        {showIp && chatSession.ipAddress && (
          <div>
            <dt className="text-text/60">IP address</dt>
            <dd>{chatSession.ipAddress}</dd>
          </div>
        )}
      </dl>

      {!showIp && (
        <Link
          href={`/admin/chat-sessions/${id}?showIp=1`}
          className="mb-6 inline-block text-xs text-text/50 hover:text-green-deep"
        >
          Show IP address
        </Link>
      )}

      <div className="space-y-4 rounded-2xl border border-green-soft/20 bg-bg p-6">
        {messages.map((message, index) => (
          <div
            key={`${message.createdAt}-${index}`}
            className={
              message.role === "user" ? "text-right" : "text-left"
            }
          >
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-text/40">
              {message.role}
            </span>
            <p
              className={`inline-block max-w-[90%] rounded-xl px-4 py-2 text-sm ${
                message.role === "user"
                  ? "bg-green-soft/20 text-green-deep"
                  : "bg-cream text-text"
              }`}
            >
              {message.content}
            </p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/auth";
import { countChatSessions, getChatSessions } from "@/lib/chat/session";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type AdminChatSessionsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminChatSessionsPage({
  searchParams,
}: AdminChatSessionsPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [sessions, total] = await Promise.all([
    getChatSessions({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    countChatSessions(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <h1 className="mb-2 font-heading text-2xl font-bold text-green-deep">
        Chat Sessions
      </h1>
      <p className="mb-8 text-sm text-text/60">
        Recent AI assistant conversations for review.
      </p>

      {sessions.length === 0 ? (
        <p className="rounded-2xl border border-green-soft/20 bg-bg px-6 py-12 text-center text-text/60">
          No chat sessions yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-green-soft/20 bg-bg">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-green-soft/20 bg-cream/30">
              <tr>
                <th className="px-4 py-3 font-medium text-green-deep">
                  Session
                </th>
                <th className="px-4 py-3 font-medium text-green-deep">
                  Messages
                </th>
                <th className="px-4 py-3 font-medium text-green-deep">
                  Last Active
                </th>
                <th className="px-4 py-3 font-medium text-green-deep">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-soft/10">
              {sessions.map((chatSession) => (
                <tr key={chatSession.id}>
                  <td className="px-4 py-3 font-mono text-xs text-text/70">
                    {chatSession.sessionId.slice(0, 12)}…
                  </td>
                  <td className="px-4 py-3">{chatSession.messageCount}</td>
                  <td className="px-4 py-3 text-text/60">
                    {format(chatSession.updatedAt, "dd MMM yyyy, h:mm a")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/chat-sessions/${chatSession.id}`}
                      className="text-sm font-medium text-orange hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            return (
              <Link
                key={pageNum}
                href={`/admin/chat-sessions?page=${pageNum}`}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  pageNum === page
                    ? "bg-green-deep text-cream"
                    : "border border-green-soft/30 hover:bg-cream"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

import { format } from "date-fns";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { KnowledgeReindexButton } from "@/components/admin/knowledge/KnowledgeReindexButton";
import { ChunkList } from "@/components/admin/knowledge/ChunkList";
import { StatsCard } from "@/components/admin/StatsCard";
import { auth } from "@/auth";
import {
  getKnowledgeChunks,
  getKnowledgeStats,
} from "@/lib/knowledge/indexer";
import type { KnowledgeSource } from "@/lib/knowledge/types";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TABS: Array<{ key: KnowledgeSource | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "menu", label: "Menu" },
  { key: "faq", label: "FAQ" },
  { key: "about", label: "About" },
  { key: "policy", label: "Policies" },
];

type AdminKnowledgePageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function AdminKnowledgePage({
  searchParams,
}: AdminKnowledgePageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const activeTab = (params.tab ?? "all") as KnowledgeSource | "all";

  const [stats, allChunks] = await Promise.all([
    getKnowledgeStats(),
    getKnowledgeChunks(),
  ]);

  const filteredChunks =
    activeTab === "all"
      ? allChunks
      : allChunks.filter((chunk) => chunk.source === activeTab);

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-green-deep">
            Knowledge Base
          </h1>
          <p className="text-sm text-text/60">
            Read-only view of indexed content powering MBS Assistant.
          </p>
        </div>
        <KnowledgeReindexButton />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatsCard
          title="Total Chunks"
          value={stats.totalChunks}
          description="Across all sources"
        />
        <StatsCard
          title="Last Indexed"
          value={
            stats.lastIndexedAt
              ? format(stats.lastIndexedAt, "dd MMM yyyy, h:mm a")
              : "Never"
          }
          description="Most recent chunk update"
        />
      </div>

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Knowledge tabs">
        {TABS.map((tab) => (
          <a
            key={tab.key}
            href={
              tab.key === "all"
                ? "/admin/knowledge"
                : `/admin/knowledge?tab=${tab.key}`
            }
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              activeTab === tab.key
                ? "bg-green-deep text-cream"
                : "border border-green-soft/30 text-text/70 hover:bg-cream",
            )}
          >
            {tab.label}
            {tab.key !== "all" && stats.bySource[tab.key]
              ? ` (${stats.bySource[tab.key]})`
              : ""}
          </a>
        ))}
      </nav>

      <ChunkList chunks={filteredChunks} />
    </AdminShell>
  );
}

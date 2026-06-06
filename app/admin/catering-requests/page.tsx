import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { CateringRequestsTable } from "@/components/admin/catering-requests/CateringRequestsTable";
import { StatsCard } from "@/components/admin/StatsCard";
import { Input } from "@/components/ui/input";
import { auth } from "@/auth";
import type { CateringRequestStatus } from "@/lib/data/catering-requests";
import {
  countCateringRequests,
  getCateringRequests,
  getCateringRequestStats,
} from "@/lib/db/catering-requests";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type AdminCateringRequestsPageProps = {
  searchParams: Promise<{
    status?: string;
    q?: string;
    page?: string;
  }>;
};

export default async function AdminCateringRequestsPage({
  searchParams,
}: AdminCateringRequestsPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = params.status as CateringRequestStatus | undefined;
  const q = params.q?.trim() || undefined;

  const filters = {
    status,
    q,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const [requests, total, stats] = await Promise.all([
    getCateringRequests(filters),
    countCateringRequests({ status, q }),
    getCateringRequestStats(),
  ]);

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <h1 className="mb-6 font-heading text-2xl font-bold text-green-deep">
        Catering Requests
      </h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Pending"
          value={stats.pendingCount}
          description="Awaiting response"
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingCount}
          description="Next 30 days"
        />
        <StatsCard
          title="This Month"
          value={`₹${stats.monthEstimatedRevenue.toLocaleString("en-IN")}`}
          description="Estimated revenue"
        />
      </div>

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <Input
          name="q"
          placeholder="Search request #, name, phone..."
          defaultValue={q}
          className="max-w-xs"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-xl border border-green-soft/30 bg-bg px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="NEW">New</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-green-deep px-4 py-2 text-sm font-medium text-cream"
        >
          Filter
        </button>
      </form>

      <CateringRequestsTable requests={requests} />

      {total > PAGE_SIZE && (
        <p className="mt-4 text-center text-sm text-text/60">
          Page {page} of {Math.ceil(total / PAGE_SIZE)}
        </p>
      )}
    </AdminShell>
  );
}

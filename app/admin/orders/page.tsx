import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { StatsCard } from "@/components/admin/StatsCard";
import { Input } from "@/components/ui/input";
import { auth } from "@/auth";
import type { OrderStatus } from "@/lib/data/orders";
import { countOrders, getOrders, getOrderStats } from "@/lib/db/orders";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type AdminOrdersPageProps = {
  searchParams: Promise<{
    status?: string;
    q?: string;
    page?: string;
  }>;
};

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All" },
  { value: "NEW", label: "New" },
  { value: "ACKNOWLEDGED", label: "Acknowledged" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = params.status as OrderStatus | undefined;
  const q = params.q?.trim() || undefined;

  const filters = {
    status: status && STATUS_OPTIONS.some((s) => s.value === status)
      ? status
      : undefined,
    q,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const [orders, total, stats] = await Promise.all([
    getOrders(filters),
    countOrders({ status: filters.status, q }),
    getOrderStats(),
  ]);

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <h1 className="mb-6 font-heading text-2xl font-bold text-green-deep">
        Orders
      </h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Today's Orders"
          value={stats.todayCount}
          description="Orders placed today"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingCount}
          description="Awaiting fulfillment"
        />
        <StatsCard
          title="This Week"
          value={`₹${stats.weekRevenue.toLocaleString("en-IN")}`}
          description="Revenue (excl. cancelled)"
        />
      </div>

      <Suspense fallback={<div className="mb-6 h-10 animate-pulse rounded-xl bg-cream/50" />}>
        <form className="mb-6 flex flex-wrap gap-3" method="get">
          <Input
            name="q"
            placeholder="Search order #, name, phone..."
            defaultValue={q}
            className="max-w-xs"
          />
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-xl border border-green-soft/30 bg-bg px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-green-deep px-4 py-2 text-sm font-medium text-cream"
          >
            Filter
          </button>
        </form>
      </Suspense>

      <OrdersTable orders={orders} />

      {total > PAGE_SIZE && (
        <p className="mt-4 text-center text-sm text-text/60">
          Page {page} of {Math.ceil(total / PAGE_SIZE)}
        </p>
      )}
    </AdminShell>
  );
}

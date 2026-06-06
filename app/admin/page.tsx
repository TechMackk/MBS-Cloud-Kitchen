import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatsCard } from "@/components/admin/StatsCard";
import { auth } from "@/auth";
import { getCateringStats } from "@/lib/db/catering";
import { getMenuStats } from "@/lib/db/menu";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const [menuStats, cateringStats] = await Promise.all([
    getMenuStats(),
    getCateringStats(),
  ]);

  const availableTotal = menuStats.available + cateringStats.available;

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <h1 className="font-heading text-2xl font-bold text-green-deep sm:text-3xl">
        Welcome, {session.user.name}
      </h1>
      <p className="mt-2 text-text/60">
        Overview of your kitchen menu and catering catalogue.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Menu Items"
          value={menuStats.total}
          description="All dishes in database"
        />
        <StatsCard
          title="Total Catering Items"
          value={cateringStats.total}
          description="Catering catalogue entries"
        />
        <StatsCard
          title="Available Items"
          value={availableTotal}
          description="Menu + catering currently available"
        />
      </div>
    </AdminShell>
  );
}

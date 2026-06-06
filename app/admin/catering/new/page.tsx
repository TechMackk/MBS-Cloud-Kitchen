import { redirect } from "next/navigation";

import { CateringItemForm } from "@/components/admin/forms/CateringItemForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function NewCateringItemPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <h1 className="mb-8 font-heading text-2xl font-bold text-green-deep">
        Add Catering Item
      </h1>
      <CateringItemForm mode="create" />
    </AdminShell>
  );
}

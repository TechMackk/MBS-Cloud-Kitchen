import { redirect } from "next/navigation";

import { MenuItemForm } from "@/components/admin/forms/MenuItemForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function NewMenuItemPage() {
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
        Add Menu Item
      </h1>
      <MenuItemForm mode="create" />
    </AdminShell>
  );
}

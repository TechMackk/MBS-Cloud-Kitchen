import { redirect } from "next/navigation";

import { MenuItemForm } from "@/components/admin/forms/MenuItemForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/auth";
import { getMenuItemForAdmin } from "@/lib/db/menu";

export const dynamic = "force-dynamic";

type EditMenuPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditMenuItemPage({ params }: EditMenuPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const { slug } = await params;
  const item = await getMenuItemForAdmin(slug);

  if (!item) {
    redirect("/admin/menu");
  }

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <h1 className="mb-8 font-heading text-2xl font-bold text-green-deep">
        Edit: {item.name}
      </h1>
      <MenuItemForm mode="edit" initialData={item} />
    </AdminShell>
  );
}

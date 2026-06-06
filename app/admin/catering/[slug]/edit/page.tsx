import { redirect } from "next/navigation";

import { CateringItemForm } from "@/components/admin/forms/CateringItemForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/auth";
import { getCateringItemForAdmin } from "@/lib/db/catering";

export const dynamic = "force-dynamic";

type EditCateringPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditCateringItemPage({
  params,
}: EditCateringPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const { slug } = await params;
  const item = await getCateringItemForAdmin(slug);

  if (!item) {
    redirect("/admin/catering");
  }

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <h1 className="mb-8 font-heading text-2xl font-bold text-green-deep">
        Edit: {item.name}
      </h1>
      <CateringItemForm mode="edit" initialData={item} />
    </AdminShell>
  );
}

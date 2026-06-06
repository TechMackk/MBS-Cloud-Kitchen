import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export interface AdminShellProps {
  userName: string;
  userRole: "ADMIN" | "STAFF";
  children: React.ReactNode;
}

export function AdminShell({
  userName,
  userRole,
  children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-cream/30">
      <AdminHeader userName={userName} userRole={userRole} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

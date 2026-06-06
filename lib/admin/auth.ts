import { auth } from "@/auth";

export type AdminSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
  };
};

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "STAFF") {
    throw new Error("Unauthorized");
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name ?? "Staff",
      email: session.user.email ?? "",
      role,
    },
  };
}

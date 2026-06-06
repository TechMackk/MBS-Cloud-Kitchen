import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db/client";

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  } catch {
    return null;
  }
}

export async function verifyPassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, passwordHash);
  } catch {
    return false;
  }
}

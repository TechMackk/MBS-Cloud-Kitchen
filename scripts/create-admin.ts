import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "MBS Admin";

  if (!email || !password) {
    console.error(
      "Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment.",
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase().trim() },
    update: {
      name,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email: email.toLowerCase().trim(),
      name,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin user ready: ${user.email} (${user.role})`);
}

main()
  .catch((error: unknown) => {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

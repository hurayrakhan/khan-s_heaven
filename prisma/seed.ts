import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Create an admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // In production, hash this!
    },
  });

  // 2️⃣ Create a team
  const team = await prisma.team.create({
    data: {
      name: "Development Team",
      createdBy: admin.id,
    },
  });

  // 3️⃣ Add the admin as a team member
  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: admin.id,
    },
  });

  // 4️⃣ Create a few tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Setup Next.js project",
        description: "Initialize Next.js with TypeScript and Tailwind",
        teamId: team.id,
        assignedTo: admin.id,
        status: "in_progress",
      },
      {
        title: "Design database schema",
        description: "Create Prisma models for User, Team, and Task",
        teamId: team.id,
        assignedTo: admin.id,
        status: "todo",
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

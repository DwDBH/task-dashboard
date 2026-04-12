// Prisma client singleton — ready for Supabase connection
// Configure DATABASE_URL in prisma.config.ts before using
//
// Usage:
//   import { prisma } from "@/lib/prisma";
//   const tasks = await prisma.task.findMany();
//
// Uncomment when DATABASE_URL is configured:

// import { PrismaClient } from "@/generated/prisma/client";
//
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };
//
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({
//   datasourceUrl: process.env.DATABASE_URL,
// });
//
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export {};

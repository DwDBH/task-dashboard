import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    return NextResponse.json({
      status: "ok",
      db: "connected",
      env: process.env.DATABASE_URL ? "set" : "missing",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        status: "error",
        db: "failed",
        env: process.env.DATABASE_URL ? "set" : "missing",
        error: message,
      },
      { status: 500 }
    );
  }
}

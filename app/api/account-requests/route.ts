import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(users).where(eq(users.status, "PENDING") || eq(users.status, "REJECTED"));
  return NextResponse.json(data);
}

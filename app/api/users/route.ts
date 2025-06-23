import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

export async function GET() {
  const data = await db.select().from(users);
  return NextResponse.json(data);
}
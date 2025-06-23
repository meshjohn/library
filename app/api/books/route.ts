import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";

export async function GET() {
  const data = await db.select().from(books);
  console.log(data);
  return NextResponse.json(data);
}
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db
    .select({
      borrowId: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      status: borrowRecords.status,
      user: {
        id: users.id,
        name: users.fullName,
        email: users.email,
      },
      book: {
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
      },
    })
    .from(borrowRecords)
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .innerJoin(books, eq(borrowRecords.bookId, books.id));
  console.log("Borrow Records:", data);
  return NextResponse.json(data);
}

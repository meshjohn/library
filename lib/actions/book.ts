"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;
  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);
    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }
    const dueDate = dayjs().add(7, "day").toDate().toDateString();
    const record = await db
      .insert(borrowRecords)
      .values({ userId, bookId, dueDate, status: "BORROWED" })
      .returning();
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));
    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

export async function getBookRequestsPerDay() {
  const result = await db
    .select({
      date: sql`DATE(${borrowRecords.createdAt})`.as("date"),
      count: sql`COUNT(*)`.as("count"),
    })
    .from(borrowRecords)
    .groupBy(sql`DATE(${borrowRecords.createdAt})`)
    .orderBy(sql`DATE(${borrowRecords.createdAt}) ASC`);

  const formatted = result.map((row) => {
    const dateObj =
      typeof row.date === "string" ? new Date(row.date) : row.date;
    const formattedDate = (dateObj as Date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return {
      day: formattedDate,
      count: Number(row.count),
    };
  });

  return formatted;
}
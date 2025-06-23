"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { hash } from "bcryptjs";
import { desc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export const signInWithCredintials = async (
  params: Pick<AuthCredintials, "email" | "password">
) => {
  const { email, password } = params;
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { success: false, error: result.error };
    }
    return { success: true };
  } catch (error) {
    console.log(error, "Signin error");
    return { success: false, error: "Signin error" };
  }
};

export const signUp = async (params: AuthCredintials) => {
  const { email, password, fullName, universityCard, universityId } = params;
  const ip = (await headers()).get("x-forwards-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");
  const exisitingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (exisitingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }
  await workflowClient.trigger({
    url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
    body: {
      email,
      fullName,
    },
  });
  const hashedPassword = await hash(password, 10);
  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId: Number(universityId),
      password: hashedPassword,
      universityCard,
    });
    // await signInWithCredentials({ email, password });
    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};

export async function getUsersPerDay() {
  console.log("Running getUsersPerDay()");

  const result = await db
    .select({
      date: sql`DATE(${users.createdAt})`.as("date"),
      count: sql`COUNT(*)`.as("count"),
    })
    .from(users)
    .groupBy(sql`DATE(${users.createdAt})`)
    .orderBy(sql`DATE(${users.createdAt}) ASC`);

  const formatted = result.map((row) => {
    const dateObj = new Date(row.date as string | number | Date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
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

export async function getLatestUsersWithBorrowCount() {
  const result = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      borrowCount: sql`COUNT(${borrowRecords.id})`.as("borrowCount"),
    })
    .from(users)
    .leftJoin(borrowRecords, sql`${users.id} = ${borrowRecords.userId}`)
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))
    .limit(4);

  return result;
}

export async function getLatestBooks() {
  const result = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt)) // assuming you have createdAt column
    .limit(4);
  return result
}
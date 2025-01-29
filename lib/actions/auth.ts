"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export const signInWithCredentials = async (
  params: Pick<AuthCredintials, "email" | "password">
) => {
  const { email, password } = params;
  const ip = (await headers()).get("x-forwards-for") || "127.0.0.1";
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
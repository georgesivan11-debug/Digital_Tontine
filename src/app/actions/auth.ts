"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email is already in use" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerified: new Date(),
      },
    });

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24); // 24h

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      }
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const confirmLink = `${appUrl}/api/verify-email?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your Digital Tontine Account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; text-align: center; background-color: #f9fafb; border-radius: 10px;">
          <h1 style="color: #172554;">Welcome to Digital Tontine! 💰</h1>
          <p style="color: #4b5563; font-size: 16px;">We're excited to have you on board. Please verify your email address to activate your account and secure your tontine groups.</p>
          <a href="${confirmLink}" style="display: inline-block; padding: 14px 28px; background-color: #fbbf24; color: #172554; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            Verify My Account
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">If you did not request this email, please ignore it.</p>
        </div>
      `
    });
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") {
      throw err;
    }
    console.error("Registration Error:", err);
    return { error: "A server error occurred. Please check your connection." };
  }

  redirect("/login?registered=true");
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        case "AccessDenied":
          return { error: "Please verify your email address before logging in." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=MissingToken", request.url));
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/login?error=InvalidToken", request.url));
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.redirect(new URL("/login?error=ExpiredToken", request.url));
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: {
        emailVerified: new Date(),
      }
    });

    // Delete the token
    await prisma.verificationToken.delete({
      where: { token }
    });

    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/login?error=VerificationFailed", request.url));
  }
}

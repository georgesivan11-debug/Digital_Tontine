"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfileName(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  if (!name || name.trim().length === 0) {
    throw new Error("Name is required");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() }
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

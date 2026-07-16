"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Internal function to create a notification
 */
export async function createNotification(userId: string, type: string, message: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        message,
      }
    });
    // In a real app with WebSockets, we'd emit an event here.
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

/**
 * Server Action: Mark a single notification as read
 */
export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.update({
    where: { 
      id: notificationId,
      userId: session.user.id // Ensure user owns the notification
    },
    data: { read: true }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/notifications");
}

/**
 * Server Action: Mark all notifications as read for current user
 */
export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { 
      userId: session.user.id,
      read: false
    },
    data: { read: true }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/notifications");
}

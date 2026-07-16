"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export async function declarePayment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const roundId = formData.get("roundId") as string;
  const groupId = formData.get("groupId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as string;

  if (!roundId || !amount || !method || isNaN(amount)) {
    return { error: "Invalid payment data" };
  }

  const membership = await prisma.membership.findFirst({
    where: {
      groupId,
      userId: session.user.id,
    }
  });

  if (!membership) {
    return { error: "You are not a member of this group" };
  }

  await prisma.payment.create({
    data: {
      roundId,
      membershipId: membership.id,
      amount,
      method,
      status: "PENDING",
    }
  });

  const group = await prisma.tontineGroup.findUnique({ where: { id: groupId } });
  const user = session.user;
  if (group) {
    await createNotification(
      group.organizerId,
      "PAYMENT_DECLARED",
      `${user.name || user.email} has declared a payment of ${amount} ${group.currency}. Please validate it.`
    );
  }

  revalidatePath(`/dashboard/groups/${groupId}`);
  return { success: true };
}

export async function validatePayment(paymentId: string, groupId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // In a real app we check if user is Organizer or Treasurer here
  const payment = await prisma.payment.findUnique({ 
    where: { id: paymentId },
    include: { membership: true, round: { include: { group: true } } }
  });

  await prisma.payment.update({
    where: { id: paymentId },
    data: { 
      status: "CONFIRMED",
      validatedById: session.user.id 
    }
  });

  if (payment) {
    await createNotification(
      payment.membership.userId,
      "PAYMENT_VALIDATED",
      `Your payment of ${payment.amount} ${payment.round.group.currency} has been validated!`
    );
  }

  revalidatePath(`/dashboard/groups/${groupId}`);
  return { success: true };
}

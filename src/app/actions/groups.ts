"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createNotification } from "./notifications";

export async function createTontineGroup(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const contributionAmount = parseFloat(formData.get("contributionAmount") as string);
  const frequency = formData.get("frequency") as string;
  const currency = formData.get("currency") as string;
  const startDateStr = formData.get("startDate") as string;

  if (!name || isNaN(contributionAmount) || !frequency || !currency || !startDateStr) {
    return { error: "Missing required fields" };
  }

  const startDate = new Date(startDateStr);

  const group = await prisma.tontineGroup.create({
    data: {
      name,
      contributionAmount,
      frequency,
      currency,
      startDate,
      organizerId: session.user.id,
      memberships: {
        create: {
          userId: session.user.id,
          role: "ORGANIZER",
          turnOrder: 1,
        }
      }
    },
  });

  redirect(`/dashboard/groups/${group.id}`);
}

export async function joinGroup(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const groupId = formData.get("groupId") as string;
  if (!groupId) return { error: "Missing groupId" };

  const group = await prisma.tontineGroup.findUnique({
    where: { id: groupId },
    include: { memberships: true }
  });

  if (!group) return { error: "Group not found" };

  const existing = group.memberships.find(m => m.userId === session.user.id);
  if (existing) {
    redirect(`/dashboard/groups/${groupId}`);
  }

  const newTurnOrder = group.memberships.length + 1;

  await prisma.membership.create({
    data: {
      userId: session.user.id,
      groupId,
      role: "MEMBER",
      turnOrder: newTurnOrder,
    }
  });

  const userJoining = session.user;
  await createNotification(
    group.organizerId,
    "MEMBER_JOINED",
    `${userJoining.name || userJoining.email} has joined your group "${group.name}".`
  );

  redirect(`/dashboard/groups/${groupId}`);
}

export async function generateRounds(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const groupId = formData.get("groupId") as string;
  if (!groupId) return { error: "Missing groupId" };

  const group = await prisma.tontineGroup.findUnique({
    where: { id: groupId },
    include: { memberships: { orderBy: { turnOrder: 'asc' } }, rounds: true }
  });

  if (!group) return { error: "Group not found" };
  if (group.organizerId !== session.user.id) return { error: "Only the organizer can generate rounds" };
  if (group.rounds.length > 0) return { error: "Rounds already generated" };
  if (group.memberships.length < 2) return { error: "Need at least 2 members to start the Tontine" };

  let currentStartDate = new Date(group.startDate);
  
  for (const membership of group.memberships) {
    let currentEndDate = new Date(currentStartDate);
    
    if (group.frequency === "WEEKLY") {
      currentEndDate.setDate(currentEndDate.getDate() + 7);
    } else if (group.frequency === "BIWEEKLY") {
      currentEndDate.setDate(currentEndDate.getDate() + 14);
    } else if (group.frequency === "MONTHLY") {
      currentEndDate.setMonth(currentEndDate.getMonth() + 1);
    }

    await prisma.round.create({
      data: {
        groupId: group.id,
        beneficiaryId: membership.userId,
        startDate: currentStartDate,
        endDate: currentEndDate,
        status: "PENDING",
      }
    });

    currentStartDate = new Date(currentEndDate);
  }

  redirect(`/dashboard/groups/${groupId}`);
}

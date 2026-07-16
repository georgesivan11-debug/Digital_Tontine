"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createNotification } from "./notifications";

export async function createTontineGroup(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const contributionAmount = parseFloat(formData.get("contributionAmount") as string);
  const frequency = formData.get("frequency") as string;
  const currency = formData.get("currency") as string;
  const startDateStr = formData.get("startDate") as string;

  if (!name || isNaN(contributionAmount) || !frequency || !currency || !startDateStr) {
    throw new Error("Missing required fields");
  }

  const startDate = new Date(startDateStr);

  const group = await prisma.tontineGroup.create({
    data: {
      name,
      contributionAmount,
      frequency,
      currency,
      startDate,
      organizerId: userId,
      memberships: {
        create: {
          userId: userId,
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
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const groupId = formData.get("groupId") as string;
  if (!groupId) throw new Error("Missing groupId");

  const group = await prisma.tontineGroup.findUnique({
    where: { id: groupId },
    include: { memberships: true }
  });

  if (!group) throw new Error("Group not found");

  const existing = group.memberships.find(m => m.userId === userId);
  if (existing) {
    redirect(`/dashboard/groups/${groupId}`);
  }

  const newTurnOrder = group.memberships.length + 1;

  await prisma.membership.create({
    data: {
      userId: userId,
      groupId,
      role: "MEMBER",
      turnOrder: newTurnOrder,
    }
  });

  const userJoining = session.user;
  const userNameOrEmail = userJoining?.name || userJoining?.email || "A new member";
  await createNotification(
    group.organizerId,
    "MEMBER_JOINED",
    `${userNameOrEmail} has joined your group "${group.name}".`
  );

  redirect(`/dashboard/groups/${groupId}`);
}

export async function generateRounds(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const groupId = formData.get("groupId") as string;
  if (!groupId) throw new Error("Missing groupId");

  const group = await prisma.tontineGroup.findUnique({
    where: { id: groupId },
    include: { memberships: { orderBy: { turnOrder: 'asc' } }, rounds: true }
  });

  if (!group) throw new Error("Group not found");
  if (group.organizerId !== userId) throw new Error("Only the organizer can generate rounds");
  if (group.rounds.length > 0) throw new Error("Rounds already generated");
  if (group.memberships.length < 2) throw new Error("Need at least 2 members to start the Tontine");

  let currentDueDate = new Date(group.startDate);
  let roundNumber = 1;
  
  for (const membership of group.memberships) {
    if (group.frequency === "WEEKLY") {
      currentDueDate.setDate(currentDueDate.getDate() + 7);
    } else if (group.frequency === "BIWEEKLY") {
      currentDueDate.setDate(currentDueDate.getDate() + 14);
    } else if (group.frequency === "MONTHLY") {
      currentDueDate.setMonth(currentDueDate.getMonth() + 1);
    }

    await prisma.round.create({
      data: {
        groupId: group.id,
        roundNumber: roundNumber,
        beneficiaryMembershipId: membership.id,
        dueDate: currentDueDate,
        status: "UPCOMING",
      }
    });

    roundNumber++;
  }

  redirect(`/dashboard/groups/${groupId}`);
}

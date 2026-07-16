"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export async function createMeeting(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const groupId = formData.get("groupId") as string;
  const dateStr = formData.get("date") as string;
  const location = formData.get("location") as string;
  const secretaryId = formData.get("secretaryId") as string;

  if (!groupId || !dateStr) {
    throw new Error("Group ID and Date are required");
  }

  // Verify the user is an organizer
  const group = await prisma.tontineGroup.findUnique({
    where: { id: groupId }
  });

  if (!group || group.organizerId !== session.user.id) {
    throw new Error("Only the organizer can schedule meetings.");
  }

  await prisma.meeting.create({
    data: {
      groupId,
      date: new Date(dateStr),
      locationOrLink: location,
      secretaryId: secretaryId || null,
      createdById: session.user.id,
    }
  });

  if (secretaryId) {
    await createNotification(
      secretaryId,
      "SECRETARY_DESIGNATED",
      `You have been designated as Secretary for the meeting on ${new Date(dateStr).toLocaleDateString()}.`
    );
  }

  revalidatePath(`/dashboard/groups/${groupId}`);
  return;
}

export async function updateMeetingReport(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const meetingId = formData.get("meetingId") as string;
  const report = formData.get("report") as string;
  const groupId = formData.get("groupId") as string;

  if (!meetingId || !report) throw new Error("Missing fields");

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { group: true }
  });

  if (!meeting) throw new Error("Meeting not found");

  // Only Secretary or Organizer can edit
  if (meeting.secretaryId !== session.user.id && meeting.group.organizerId !== session.user.id) {
    throw new Error("Not authorized to edit this report.");
  }

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { minutesText: report }
  });

  revalidatePath(`/dashboard/groups/${groupId}`);
  return;
}

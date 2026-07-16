import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/app/actions/notifications";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // Security check: in production, verify an Authorization header matching a CRON_SECRET
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneDayFromNow = new Date(today);
    oneDayFromNow.setDate(today.getDate() + 1);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // 1. Process Rounds (Payments Due)
    const upcomingRounds = await prisma.round.findMany({
      where: {
        status: { not: "COMPLETED" },
        OR: [
          { dueDate: { gte: oneDayFromNow, lt: new Date(oneDayFromNow.getTime() + 86400000) } },
          { dueDate: { gte: sevenDaysFromNow, lt: new Date(sevenDaysFromNow.getTime() + 86400000) } }
        ]
      },
      include: {
        group: { include: { memberships: { include: { user: true } } } }
      }
    });

    for (const round of upcomingRounds) {
      const daysLeft = new Date(round.dueDate).getDate() === oneDayFromNow.getDate() ? 1 : 7;
      for (const membership of round.group.memberships) {
        if (membership.user.email) {
          // Send Notification
          await createNotification(
            membership.userId,
            "PAYMENT_REMINDER",
            `Reminder: Round #${round.roundNumber} for ${round.group.name} is due in ${daysLeft} day(s)!`
          );

          // Send Email
          await resend.emails.send({
            from: 'Digital Tontine <onboarding@resend.dev>',
            to: membership.user.email,
            subject: `Reminder: Tontine Payment Due in ${daysLeft} day(s)`,
            html: `<p>Hello ${membership.user.name || 'Member'},</p>
                   <p>This is an automated reminder that Round #${round.roundNumber} for the group <strong>${round.group.name}</strong> is due in ${daysLeft} day(s).</p>
                   <p>Please log in to declare your payment.</p>`
          });
        }
      }
    }

    // 2. Process Meetings
    const upcomingMeetings = await prisma.meeting.findMany({
      where: {
        OR: [
          { date: { gte: oneDayFromNow, lt: new Date(oneDayFromNow.getTime() + 86400000) } },
          { date: { gte: sevenDaysFromNow, lt: new Date(sevenDaysFromNow.getTime() + 86400000) } }
        ]
      },
      include: {
        group: { include: { memberships: { include: { user: true } } } }
      }
    });

    for (const meeting of upcomingMeetings) {
      const daysLeft = new Date(meeting.date).getDate() === oneDayFromNow.getDate() ? 1 : 7;
      for (const membership of meeting.group.memberships) {
        if (membership.user.email) {
          // Send Notification
          await createNotification(
            membership.userId,
            "MEETING_REMINDER",
            `Reminder: Meeting for ${meeting.group.name} is in ${daysLeft} day(s) at ${meeting.locationOrLink}.`
          );

          // Send Email
          await resend.emails.send({
            from: 'Digital Tontine <onboarding@resend.dev>',
            to: membership.user.email,
            subject: `Reminder: Tontine Meeting in ${daysLeft} day(s)`,
            html: `<p>Hello ${membership.user.name || 'Member'},</p>
                   <p>Your group <strong>${meeting.group.name}</strong> has a meeting scheduled in ${daysLeft} day(s).</p>
                   <p><strong>Location:</strong> ${meeting.locationOrLink}</p>`
          });
        }
      }
    }

    return NextResponse.json({ success: true, processedRounds: upcomingRounds.length, processedMeetings: upcomingMeetings.length });
  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

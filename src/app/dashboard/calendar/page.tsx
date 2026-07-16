import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function GlobalCalendarPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  // Find all groups the user belongs to
  const memberships = await prisma.membership.findMany({
    where: { userId: userId },
    include: {
      group: {
        include: {
          rounds: {
            include: {
              beneficiaryMembership: {
                include: { user: true }
              }
            },
            orderBy: { dueDate: 'asc' }
          },
          meetings: {
            orderBy: { date: 'asc' }
          }
        }
      }
    }
  });

  // Flatten and sort both rounds and meetings into a unified event list
  const events: any[] = [];

  memberships.forEach(m => {
    // Add Rounds
    m.group.rounds.forEach(r => {
      if (r.status !== "COMPLETED") {
        events.push({
          id: `round-${r.id}`,
          type: 'ROUND',
          title: `Round #${r.roundNumber}`,
          group: m.group,
          date: new Date(r.dueDate),
          status: r.status,
          beneficiary: r.beneficiaryMembership?.user?.name || "Pending..."
        });
      }
    });

    // Add Meetings
    m.group.meetings.forEach(meeting => {
      if (new Date(meeting.date) >= new Date(new Date().setHours(0,0,0,0))) {
        events.push({
          id: `meeting-${meeting.id}`,
          type: 'MEETING',
          title: `Meeting`,
          group: m.group,
          date: new Date(meeting.date),
          location: meeting.locationOrLink
        });
      }
    });
  });

  events.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Global Rotation Calendar</h1>
        <p className="text-foreground/60 text-sm mt-1">Track all upcoming payments across all your groups.</p>
      </div>

      <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No upcoming events</h3>
            <p className="text-gray-500">You don't have any pending rounds or meetings.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors bg-gray-50/50 dark:bg-blue-900/10 ${event.type === 'ROUND' ? 'hover:border-gold-400' : 'hover:border-coral-400'}`}>
                <div className="flex items-start md:items-center space-x-4 mb-4 md:mb-0">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${event.type === 'ROUND' ? (event.status === 'ACTIVE' ? 'bg-gold-100 text-gold-600' : 'bg-blue-100 text-blue-600') : 'bg-coral-100 text-coral-600'}`}>
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
                      {event.group.name} - {event.title}
                      {event.status === 'ACTIVE' && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full animate-pulse">ACTIVE NOW</span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.type === 'ROUND' ? (
                        <>Beneficiary: <span className="font-semibold text-gray-700 dark:text-gray-300">{event.beneficiary}</span></>
                      ) : (
                        <>Location: <span className="font-semibold text-gray-700 dark:text-gray-300">{event.location}</span></>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-gray-200 dark:border-gray-800 pt-3 md:pt-0">
                  <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                    <Clock className="w-4 h-4 mr-1.5 text-coral-500" />
                    {event.date.toLocaleDateString()}
                  </div>
                  <Link href={`/dashboard/groups/${event.group.id}`} className="mt-0 md:mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center">
                    Go to Group &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

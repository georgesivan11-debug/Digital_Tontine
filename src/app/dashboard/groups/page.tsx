import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Users, Plus, ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";

export default async function MyGroupsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: {
      group: {
        include: {
          memberships: true,
        }
      }
    },
    orderBy: {
      joinedAt: 'desc'
    }
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tontine Groups</h1>
          <p className="text-foreground/60 text-sm mt-1">Manage all the groups you organize or participate in.</p>
        </div>
        <Link href="/dashboard/groups/create" className="flex items-center px-4 py-2.5 rounded-full bg-blue-950 dark:bg-white text-white dark:text-blue-950 text-sm font-semibold hover:bg-blue-900 dark:hover:bg-gray-100 transition-colors shadow-md w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Create New Group
        </Link>
      </div>

      {memberships.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-blue-950 rounded-2xl border border-dashed border-gray-200 dark:border-blue-900">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">You haven't joined any groups yet</h3>
          <p className="text-gray-500 mb-6">Create a new tontine or ask an organizer for an invitation link.</p>
          <Link href="/dashboard/groups/create" className="px-6 py-3 bg-gold-400 text-blue-950 font-bold rounded-full hover:bg-gold-300 transition-colors">
            Start a Tontine
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map((m) => {
            const isOrganizer = m.role === "ORGANIZER";
            
            return (
              <Link key={m.id} href={`/dashboard/groups/${m.groupId}`} className="block group">
                <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm hover:shadow-md transition-all hover:border-gold-400 dark:hover:border-gold-500 h-full flex flex-col relative overflow-hidden">
                  
                  {/* Decorative accent */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${isOrganizer ? 'bg-gold-400' : 'bg-blue-500'}`} />

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors">
                        {m.group.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {m.group.currency} {m.group.contributionAmount} • {m.group.frequency}
                      </p>
                    </div>
                    {isOrganizer ? (
                      <span className="flex items-center text-[10px] font-bold px-2 py-1 bg-gold-100 text-gold-700 rounded-full">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Organizer
                      </span>
                    ) : (
                      <span className="flex items-center text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        <Users className="w-3 h-3 mr-1" /> Member
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1.5" />
                      {m.group.memberships.length} Members
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold-500 transition-colors group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

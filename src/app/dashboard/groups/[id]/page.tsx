import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArrowLeft, Calendar, Users, DollarSign, PlusCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import InviteButton from "./InviteButton";
import DeleteGroupButton from "./DeleteGroupButton";
import MeetingsSection from "./MeetingsSection";
import { generateRounds, changeMemberRole } from "@/app/actions/groups";
import { declarePayment, validatePayment } from "@/app/actions/payments";

export default async function GroupDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const group = await prisma.tontineGroup.findUnique({
    where: { id: params.id },
    include: {
      memberships: {
        include: { user: true }
      },
      rounds: {
        include: { beneficiaryMembership: { include: { user: true } }, payments: true },
        orderBy: { dueDate: 'asc' }
      },
      meetings: {
        include: { createdBy: true, secretary: true },
        orderBy: { date: "desc" }
      },
    }
  });

  if (!group) {
    return <div>Group not found</div>;
  }

  const isOrganizer = group.organizerId === session.user.id;
  const currentUserId = session.user.id;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-900/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              {group.name}
            </h1>
            <p className="text-foreground/60 text-sm mt-1">
              {group.frequency} • {group.currency} {group.contributionAmount}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isOrganizer && (
            <>
              <DeleteGroupButton groupId={group.id} />
              <InviteButton groupId={group.id} />
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Rotation Calendar View */}
          <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Rotation Calendar
              </h2>
            </div>
            
            {group.rounds.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 dark:bg-blue-900/20 rounded-xl border border-dashed border-gray-200 dark:border-blue-800">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-500 font-medium mb-1">No rounds scheduled yet</h3>
                {isOrganizer ? (
                  <form action={generateRounds} className="mt-4">
                    <input type="hidden" name="groupId" value={group.id} />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm">
                      Generate Rotation Schedule
                    </button>
                    {group.memberships.length < 2 && (
                      <p className="text-xs text-coral-500 mt-2">You need at least 2 members to generate the schedule.</p>
                    )}
                  </form>
                ) : (
                  <p className="text-xs text-gray-400 mt-2">Waiting for the organizer to generate the schedule.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {group.rounds.map((round, index) => {
                  const isActive = round.status === "ACTIVE" || round.status === "UPCOMING";
                  const isFuture = round.status === "UPCOMING";
                  
                  // Check if current user has paid for this round
                  const myPayment = round.payments.find(p => p.membershipId === group.memberships.find(m => m.userId === currentUserId)?.id);

                  return (
                    <div key={round.id} className={`p-4 rounded-xl border ${isActive ? 'border-gold-400 bg-gold-50 dark:bg-gold-500/10' : 'border-gray-100 dark:border-gray-800'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-gray-400">ROUND {index + 1}</span>
                          <h4 className="font-bold text-lg">{round.beneficiaryMembership?.user.name} is receiving</h4>
                          <p className="text-sm text-gray-500">
                            Due by {round.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          {isActive && !myPayment && round.beneficiaryMembership?.userId !== currentUserId && (
                            <form action={declarePayment}>
                              <input type="hidden" name="roundId" value={round.id} />
                              <input type="hidden" name="groupId" value={group.id} />
                              <input type="hidden" name="amount" value={group.contributionAmount} />
                              <input type="hidden" name="method" value="MOBILE_MONEY" />
                              <button type="submit" className="px-4 py-2 bg-gold-400 text-blue-950 rounded-full font-bold text-sm shadow-sm hover:bg-gold-300">
                                Declare Payment
                              </button>
                            </form>
                          )}
                          {myPayment && myPayment.status === "PENDING" && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending Auth</span>
                          )}
                          {myPayment && myPayment.status === "CONFIRMED" && (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Organizer Validation View */}
                      {isOrganizer && round.payments.filter(p => p.status === "PENDING").length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h5 className="text-xs font-bold text-gray-500 mb-2">PENDING VALIDATIONS</h5>
                          {round.payments.filter(p => p.status === "PENDING").map(p => {
                            const member = group.memberships.find(m => m.id === p.membershipId);
                            // We need to bind the paymentId to the server action
                            const validateWithIds = validatePayment.bind(null, p.id, group.id);
                            
                            return (
                              <div key={p.id} className="flex items-center justify-between bg-white dark:bg-blue-950 p-2 rounded-lg border border-gray-100 dark:border-gray-800 mb-2">
                                <span className="text-sm">{member?.user.name} sent {group.currency} {p.amount}</span>
                                <form action={validateWithIds}>
                                  <button type="submit" className="text-xs px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                                    Approve
                                  </button>
                                </form>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Members List */}
          <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center">
                <Users className="w-5 h-5 mr-2 text-emerald-500" />
                Members ({group.memberships.length})
              </h2>
            </div>
            <div className="space-y-4">
              {group.memberships.map((membership) => (
                <div key={membership.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 text-sm">
                      {membership.user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{membership.user.name}</p>
                      {isOrganizer && membership.userId !== currentUserId ? (
                        <form action={changeMemberRole.bind(null, group.id, membership.id)} className="flex items-center space-x-2 mt-1">
                          <select name="role" defaultValue={membership.role} className="text-xs border border-gray-200 dark:border-blue-800 rounded p-1 bg-gray-50 dark:bg-blue-900/50">
                            <option value="MEMBER">Member</option>
                            <option value="TREASURER">Treasurer</option>
                            <option value="SECRETARY">Secretary</option>
                          </select>
                          <button type="submit" className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 transition-colors">
                            Save
                          </button>
                        </form>
                      ) : (
                        <p className="text-xs text-gray-500">{membership.role}</p>
                      )}
                    </div>
                  </div>
                  {membership.turnOrder && (
                    <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                      Turn #{membership.turnOrder}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Meetings & Reports Section */}
          <MeetingsSection 
            groupId={group.id} 
            isOrganizer={isOrganizer} 
            meetings={group.meetings as any} 
            memberships={group.memberships}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}

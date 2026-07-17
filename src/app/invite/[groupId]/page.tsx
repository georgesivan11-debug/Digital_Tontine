import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { joinGroup } from "@/app/actions/groups";

export default async function InvitePage(props: { params: Promise<{ groupId: string }> }) {
  const params = await props.params;
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!userId) {
    // Redirect to login but save the callback url so they return here after registering/logging in
    redirect(`/login?callbackUrl=/invite/${params.groupId}`);
  }

  const group = await prisma.tontineGroup.findUnique({
    where: { id: params.groupId },
    include: {
      organizer: true,
      memberships: true,
    }
  });

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Group Not Found</h1>
          <p className="text-gray-500">This invitation link is invalid or the group was deleted.</p>
          <Link href="/dashboard" className="mt-6 inline-block text-blue-600 hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const existingMembership = group.memberships.find(m => m.userId === userId);

  if (existingMembership) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-blue-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-blue-900 p-8 rounded-3xl shadow-xl text-center border border-gray-100 dark:border-blue-800">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're already a member!</h1>
          <p className="text-gray-500 dark:text-gray-300 mb-6">You are already a member of {group.name}.</p>
          <Link href={`/dashboard/groups/${group.id}`} className="block w-full py-3 px-4 bg-blue-950 dark:bg-blue-800 text-white rounded-full font-bold hover:bg-blue-900 dark:hover:bg-blue-700 transition-colors shadow-md">
            Go to Group
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-blue-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-blue-900 p-8 rounded-3xl shadow-xl text-center border border-gray-100 dark:border-blue-800">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're Invited!</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          <strong className="text-gray-900 dark:text-white">{group.organizer?.name || "The Organizer"}</strong> has invited you to join the tontine group <strong className="text-gray-900 dark:text-white">{group.name}</strong>.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-950/50 rounded-2xl p-4 border border-blue-100 dark:border-blue-800 text-left">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Contribution</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {group.contributionAmount} <span className="text-base font-bold text-gray-500">{group.currency}</span>
            </p>
          </div>
          <div className="bg-gold-50 dark:bg-gold-500/10 rounded-2xl p-4 border border-gold-200 dark:border-gold-500/30 text-left">
            <p className="text-sm text-gold-600 dark:text-gold-400 font-medium mb-1">Frequency</p>
            <p className="text-xl font-black text-gray-900 dark:text-white capitalize">
              {group.frequency.toLowerCase()}
            </p>
          </div>
        </div>

        <form action={joinGroup}>
          <input type="hidden" name="groupId" value={group.id} />
          <button type="submit" className="w-full py-3 px-4 bg-gold-400 text-blue-950 rounded-full font-bold hover:bg-gold-300 transition-colors shadow-md">
            Accept Invitation
          </button>
        </form>
      </div>
    </div>
  );
}

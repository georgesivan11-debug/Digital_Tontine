import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { joinGroup } from "@/app/actions/groups";

export default async function InvitePage({ params }: { params: { groupId: string } }) {
  const session = await auth();
  
  if (!session?.user?.id) {
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

  const existingMembership = group.memberships.find(m => m.userId === session.user.id);

  if (existingMembership) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're already a member!</h1>
          <p className="text-gray-500 mb-6">You are already a member of {group.name}.</p>
          <Link href={`/dashboard/groups/${group.id}`} className="block w-full py-3 px-4 bg-blue-950 text-white rounded-full font-bold hover:bg-blue-900 transition-colors">
            Go to Group
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Invited!</h1>
        <p className="text-gray-500 mb-6">
          <strong>{group.organizer?.name || "The Organizer"}</strong> has invited you to join the tontine group <strong>{group.name}</strong>.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Contribution</span>
            <span className="font-bold">{group.currency} {group.contributionAmount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Frequency</span>
            <span className="font-bold">{group.frequency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Members</span>
            <span className="font-bold">{group.memberships.length}</span>
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

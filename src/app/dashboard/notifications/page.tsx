import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Bell, CheckCircle2, Circle } from "lucide-react";
import { markAsRead, markAllAsRead } from "@/app/actions/notifications";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-blue-950 p-6 rounded-2xl border border-gray-100 dark:border-blue-900 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <form action={markAllAsRead}>
            <button type="submit" className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-medium text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark all as read
            </button>
          </form>
        )}
      </div>

      <div className="bg-white dark:bg-blue-950 rounded-2xl border border-gray-100 dark:border-blue-900 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm">When there's activity in your tontine, it will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-blue-900">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 flex items-start space-x-4 transition-colors ${notif.read ? 'bg-white dark:bg-blue-950' : 'bg-blue-50/50 dark:bg-blue-900/20'}`}>
                <div className="mt-1 flex-shrink-0">
                  {notif.read ? (
                    <CheckCircle2 className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-blue-500 fill-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100 font-medium'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notif.read && (
                  <form action={async () => {
                    "use server";
                    await markAsRead(notif.id);
                  }}>
                    <button type="submit" className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                      Mark as read
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Users, LayoutDashboard, CalendarDays, Receipt, Settings, LogOut, ArrowLeft, Bell } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationBell } from "@/components/NotificationBell";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!userId) {
    redirect("/login");
  }

  const unreadCount = await prisma.notification.count({
    where: { userId: userId, read: false }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-blue-950/20 flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-blue-950 border-r border-gray-200 dark:border-blue-900 flex-shrink-0 flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200 dark:border-blue-900">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Digital Tontine Logo" width={32} height={32} className="rounded-full shadow-sm" />
            <span className="font-bold text-xl tracking-tight text-foreground">Digital Tontine</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Overview
          </Link>
          <Link href="/dashboard/groups" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white transition-colors">
            <Users className="w-5 h-5 mr-3 text-gray-400" />
            My Groups
          </Link>
          <Link href="/dashboard/calendar" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white transition-colors">
            <CalendarDays className="w-5 h-5 mr-3 text-gray-400" />
            Rotation
          </Link>
          <Link href="/dashboard/notifications" className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white transition-colors">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 text-gray-400" />
              Notifications
            </div>
            {unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-blue-900 space-y-1">
          <Link href="/dashboard/settings" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white transition-colors">
            <Settings className="w-5 h-5 mr-3 text-gray-400" />
            Settings
          </Link>
          <Link href="/" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-900/20 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-blue-950 p-4 border-b border-gray-200 dark:border-blue-900 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Digital Tontine Logo" width={32} height={32} className="rounded-full shadow-sm" />
            <span className="font-bold text-lg tracking-tight text-foreground">Digital Tontine</span>
          </div>
          <div className="flex items-center space-x-3">
            <NotificationBell initialCount={unreadCount} />
            <Link href="/" className="text-coral-500 p-2"><LogOut className="w-5 h-5" /></Link>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-blue-950 border-t border-gray-200 dark:border-blue-900 flex items-center justify-around p-3 z-50 safe-area-pb">
        <Link href="/dashboard" className="flex flex-col items-center text-blue-600 dark:text-blue-400">
          <LayoutDashboard className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/dashboard/groups" className="flex flex-col items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <Users className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Groups</span>
        </Link>
        <Link href="/dashboard/calendar" className="flex flex-col items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <CalendarDays className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Rotation</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}

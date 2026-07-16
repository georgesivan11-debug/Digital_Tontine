import Link from "next/link";
import Image from "next/image";
import { Users, LayoutDashboard, CalendarDays, Receipt, Settings, LogOut, ArrowLeft, Bell } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationBell } from "@/components/NotificationBell";
import { DesktopNavigation, MobileBottomNav } from "@/components/DashboardNavigation";
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

        <DesktopNavigation unreadCount={unreadCount} />
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
      <MobileBottomNav />
    </div>
  );
}

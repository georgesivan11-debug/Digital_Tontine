"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, CalendarDays, Settings, Bell, LogOut } from "lucide-react";

export function DesktopNavigation({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/groups", label: "My Groups", icon: Users, exact: false },
    { href: "/dashboard/calendar", label: "Rotation", icon: CalendarDays, exact: false },
  ];

  return (
    <>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white border border-transparent'}`}>
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400'}`} />
              {link.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
            </Link>
          );
        })}
        
        <Link href="/dashboard/notifications" className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${pathname.startsWith('/dashboard/notifications') ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white border border-transparent'}`}>
          <div className="flex items-center">
            <Bell className={`w-5 h-5 mr-3 ${pathname.startsWith('/dashboard/notifications') ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400'}`} />
            Notifications
          </div>
          {unreadCount > 0 ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : (
            pathname.startsWith('/dashboard/notifications') && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
          )}
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-blue-900 space-y-2">
        <Link href="/dashboard/settings" className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${pathname.startsWith('/dashboard/settings') ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white border border-transparent'}`}>
          <Settings className={`w-5 h-5 mr-3 ${pathname.startsWith('/dashboard/settings') ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400'}`} />
          Settings
          {pathname.startsWith('/dashboard/settings') && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
        </Link>
        <Link href="/" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-900/20 transition-colors border border-transparent">
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Link>
      </div>
    </>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  
  const links = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/groups", label: "Groups", icon: Users, exact: false },
    { href: "/dashboard/calendar", label: "Rotation", icon: CalendarDays, exact: false },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-blue-950 border-t border-gray-200 dark:border-blue-900 flex items-center justify-around p-2 z-50 safe-area-pb">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} />
            <span className="text-[10px] font-medium">{link.label}</span>
            {isActive && <span className="absolute -top-2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>}
          </Link>
        );
      })}
    </nav>
  );
}

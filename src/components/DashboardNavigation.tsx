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
            <Link key={link.href} href={link.href} className={`relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all overflow-hidden ${isActive ? 'bg-blue-50/80 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 shadow-sm font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white border border-transparent'}`}>
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 dark:bg-gold-400 rounded-r-md" />}
              <Icon className={`w-5 h-5 mr-3 transition-transform ${isActive ? 'text-blue-700 dark:text-gold-400 scale-110' : 'text-gray-400 group-hover:scale-110'}`} />
              {link.label}
            </Link>
          );
        })}
        
        <Link href="/dashboard/notifications" className={`relative flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all overflow-hidden ${pathname.startsWith('/dashboard/notifications') ? 'bg-blue-50/80 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 shadow-sm font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white border border-transparent'}`}>
          {pathname.startsWith('/dashboard/notifications') && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 dark:bg-gold-400 rounded-r-md" />}
          <div className="flex items-center">
            <Bell className={`w-5 h-5 mr-3 transition-transform ${pathname.startsWith('/dashboard/notifications') ? 'text-blue-700 dark:text-gold-400 scale-110' : 'text-gray-400'}`} />
            Notifications
          </div>
          {unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-blue-900 space-y-2">
        <Link href="/dashboard/settings" className={`relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all overflow-hidden ${pathname.startsWith('/dashboard/settings') ? 'bg-blue-50/80 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 shadow-sm font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-white border border-transparent'}`}>
          {pathname.startsWith('/dashboard/settings') && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 dark:bg-gold-400 rounded-r-md" />}
          <Settings className={`w-5 h-5 mr-3 transition-transform ${pathname.startsWith('/dashboard/settings') ? 'text-blue-700 dark:text-gold-400 scale-110' : 'text-gray-400'}`} />
          Settings
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
          <Link key={link.href} href={link.href} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive ? 'text-blue-600 dark:text-gold-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} />
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{link.label}</span>
            {isActive && <span className="absolute top-0 w-8 h-1 rounded-b-full bg-blue-600 dark:bg-gold-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>}
          </Link>
        );
      })}
    </nav>
  );
}

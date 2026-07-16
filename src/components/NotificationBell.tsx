"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function NotificationBell({ initialCount = 0 }: { initialCount?: number }) {
  const [unreadCount, setUnreadCount] = useState(initialCount);

  // In a real app, you might use SWR or React Query to poll for new notifications
  // For this MVP, we rely on the initial count passed from a server component
  useEffect(() => {
    setUnreadCount(initialCount);
  }, [initialCount]);

  return (
    <Link href="/dashboard/notifications" className="relative p-2 text-gray-500 hover:text-coral-600 transition-colors">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-blue-950">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

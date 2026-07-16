import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Plus, Bell, TrendingUp, AlertCircle, ArrowUpRight, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardChart from "./DashboardChart";

export default async function DashboardOverview() {
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!userId) redirect("/login");

  // Fetch groups where the user is an organizer or member
  const userMemberships = await prisma.membership.findMany({
    where: { userId: userId },
    include: {
      group: {
        include: {
          rounds: {
            include: { payments: true }
          },
          memberships: true,
        }
      }
    }
  });

  const activeGroupsCount = userMemberships.length;
  
  // Calculate total collected and format it properly using Intl.NumberFormat
  // Since a user might be in multiple groups with different currencies, we'll just sum them or pick the primary currency.
  // For the sake of the dashboard MVP, let's group by currency and show the total for their primary group.
  const primaryGroup = userMemberships[0]?.group;
  const currency = primaryGroup?.currency || "XAF";

  let totalCollected = 0;
  let pendingValidations = 0;
  let olderPaymentsSum = 0;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData: any[] = [];
  const now = new Date();
  const oldestDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    chartData.push({
      name: monthNames[d.getMonth()],
      monthIdx: d.getMonth(),
      year: d.getFullYear(),
      monthlyAmount: 0,
      total: 0
    });
  }

  userMemberships.forEach(m => {
    if (m.group.currency === currency) {
      m.group.rounds.forEach(round => {
        round.payments.forEach(p => {
          if (p.status === "PENDING" && m.group.organizerId === userId) {
            pendingValidations++;
          }
          if (p.status === "CONFIRMED") {
            totalCollected += p.amount;
            
            const pDate = new Date(p.createdAt);
            if (pDate < oldestDate) {
              olderPaymentsSum += p.amount;
            } else {
              const pMonth = pDate.getMonth();
              const pYear = pDate.getFullYear();
              const chartPoint = chartData.find(c => c.monthIdx === pMonth && c.year === pYear);
              if (chartPoint) {
                chartPoint.monthlyAmount += p.amount;
              }
            }
          }
        });
      });
    }
  });

  // Convert monthly amounts to a cumulative running total
  let runningTotal = olderPaymentsSum;
  chartData.forEach(point => {
    runningTotal += point.monthlyAmount;
    point.total = runningTotal;
  });

  const formattedTotal = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(totalCollected);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {session?.user?.name || 'Organizer'}!</h1>
          <p className="text-foreground/60 text-sm mt-1">Here is what's happening with your tontines today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2.5 rounded-full bg-white dark:bg-blue-950 border border-gray-200 dark:border-blue-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-blue-900/50 transition-colors relative">
            <Bell className="w-5 h-5" />
            {pendingValidations > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-coral-500"></span>
            )}
          </button>
          <Link href="/dashboard/groups/create" className="flex items-center px-4 py-2.5 rounded-full bg-blue-950 dark:bg-white text-white dark:text-blue-950 text-sm font-semibold hover:bg-blue-900 dark:hover:bg-gray-100 transition-colors shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            New Group
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Groups", value: activeGroupsCount.toString(), change: "Currently participating", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Total Collected", value: formattedTotal, change: "Confirmed payments", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Pending Validations", value: pendingValidations.toString(), change: "Requires your review", icon: CheckCircle2, color: "text-gold-500", bg: "bg-gold-50 dark:bg-gold-500/10" },
          { label: "Members in Delay", value: "0", change: "Everyone is on time", icon: AlertCircle, color: "text-coral-500", bg: "bg-coral-50 dark:bg-coral-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 mb-1 truncate">{stat.value}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">{stat.change}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Contribution Evolution ({currency})</h2>
              <p className="text-sm text-gray-500">Total volume collected across groups matching primary currency</p>
            </div>
          </div>
          <DashboardChart data={chartData} />
        </div>

        {/* Priority Alerts */}
        <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Priority Alerts</h2>
            {pendingValidations > 0 && (
              <span className="bg-coral-100 text-coral-600 dark:bg-coral-900/30 dark:text-coral-400 text-xs font-bold px-2.5 py-1 rounded-full">
                {pendingValidations} New
              </span>
            )}
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {pendingValidations > 0 ? (
              <div className="flex p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-blue-900/10">
                <div className="mt-0.5 shrink-0 w-2 h-2 rounded-full bg-gold-500" />
                <div className="ml-3">
                  <h4 className="text-sm font-semibold">Payments pending validation</h4>
                  <p className="text-xs text-gray-500 mt-1">You have {pendingValidations} payment(s) to validate.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                No alerts at the moment!
              </div>
            )}
          </div>
          
          <button className="w-full mt-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            View all alerts →
          </button>
        </div>
      </div>
    </div>
  );
}

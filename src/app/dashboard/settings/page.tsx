import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, User, Bell, Shield, Wallet, Save, Lock } from "lucide-react";
import { updateProfileName, updateNotificationPreferences, changePassword } from "@/app/actions/settings";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, emailReminders: true }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Settings className="w-8 h-8 mr-3 text-gold-500" />
          Settings
        </h1>
        <p className="text-foreground/60 text-sm mt-2">Manage your account preferences and configurations.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-blue-950 p-6 rounded-3xl border border-gray-100 dark:border-blue-900 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Profile</h2>
              <p className="text-sm text-foreground/60">Update your personal information</p>
            </div>
          </div>
          <form action={updateProfileName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={dbUser?.name || session.user.name || ""} 
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-blue-900/20 rounded-lg border border-gray-100 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors">
                  <Save className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Click the save icon to update your name.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="px-4 py-2 bg-gray-100 text-gray-400 dark:bg-blue-950/50 rounded-lg border border-gray-100 dark:border-blue-900 cursor-not-allowed">
                {session.user.email} (Cannot be changed)
              </div>
            </div>
          </form>
        </div>

        {/* Notifications Card */}

        {/* Notifications Card */}
        <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gold-50 dark:bg-gold-500/10 rounded-xl mr-4">
              <Bell className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Notifications</h2>
              <p className="text-sm text-foreground/60">Manage how you receive alerts</p>
            </div>
          </div>
          <form action={updateNotificationPreferences} className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-blue-800 bg-gray-50 dark:bg-blue-900/20">
              <div>
                <h4 className="font-medium text-sm">Email Reminders</h4>
                <p className="text-xs text-gray-500">Receive an email before a payment is due</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="emailReminders" defaultChecked={dbUser?.emailReminders} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm">
              Save Notification Preferences
            </button>
          </form>
        </div>

        {/* Security Card */}
        <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl mr-4">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Security</h2>
              <p className="text-sm text-foreground/60">Keep your account safe</p>
            </div>
          </div>
          
          <form action={changePassword} className="space-y-4 p-4 rounded-xl border border-gray-100 dark:border-blue-800 bg-gray-50 dark:bg-blue-900/20">
            <h4 className="font-medium text-sm mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-2" /> Change Password
            </h4>
            
            <div>
              <input type="password" name="currentPassword" placeholder="Current Password" required
                className="w-full px-4 py-2 bg-white dark:bg-blue-950 rounded-lg border border-gray-200 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <input type="password" name="newPassword" placeholder="New Password" required
                className="w-full px-4 py-2 bg-white dark:bg-blue-950 rounded-lg border border-gray-200 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <input type="password" name="confirmPassword" placeholder="Confirm New Password" required
                className="w-full px-4 py-2 bg-white dark:bg-blue-950 rounded-lg border border-gray-200 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            
            <button type="submit" className="w-full py-2.5 bg-gray-800 hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

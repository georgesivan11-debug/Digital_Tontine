import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, User, Bell, Shield, Wallet, Save } from "lucide-react";
import { updateProfileName } from "@/app/actions/settings";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

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
                  defaultValue={session.user.name || ""} 
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
        <div className="bg-white dark:bg-blue-950 p-6 rounded-3xl border border-gray-100 dark:border-blue-900 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-coral-100 dark:bg-coral-900/30 flex items-center justify-center mr-4">
              <Bell className="w-6 h-6 text-coral-600 dark:text-coral-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Notifications</h2>
              <p className="text-sm text-foreground/60">Manage your alerts</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Reminders</div>
                <div className="text-xs text-gray-500">Receive an email before payment deadlines</div>
              </div>
              <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-medium">New Messages</div>
                <div className="text-xs text-gray-500">When someone comments on a round</div>
              </div>
              <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white dark:bg-blue-950 p-6 rounded-3xl border border-gray-100 dark:border-blue-900 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-4">
              <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Payment Methods</h2>
              <p className="text-sm text-foreground/60">Manage default payouts</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-gray-100 dark:border-blue-900 rounded-xl bg-gray-50 dark:bg-blue-900/20 text-sm text-center text-gray-500">
              No default payment method added yet.<br/> (Stripe/FedaPay coming soon in Pro Option)
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white dark:bg-blue-950 p-6 rounded-3xl border border-gray-100 dark:border-blue-900 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Security</h2>
              <p className="text-sm text-foreground/60">Protect your account</p>
            </div>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-blue-800 hover:bg-gray-50 dark:hover:bg-blue-900/40 transition-colors font-medium text-sm">
              Change Password
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-blue-800 hover:bg-gray-50 dark:hover:bg-blue-900/40 transition-colors font-medium text-sm">
              Two-Factor Authentication (2FA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

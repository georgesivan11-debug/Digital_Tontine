"use client";

import { useState } from "react";
import { createTontineGroup } from "@/app/actions/groups";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export default function CreateGroupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await createTontineGroup(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8 flex items-center space-x-4">
        <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-900/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Users className="w-6 h-6 mr-3 text-gold-500" />
            Create a New Tontine Group
          </h1>
          <p className="text-foreground/60 text-sm mt-1">Set the rules and start inviting members.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-blue-950 rounded-3xl p-8 border border-gray-100 dark:border-blue-900 shadow-sm">
        <form action={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Group Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-blue-900 bg-gray-50 dark:bg-blue-900/20 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all"
                placeholder="e.g. Family Savings 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contribution Amount</label>
              <input
                name="contributionAmount"
                type="number"
                min="1"
                step="0.01"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-blue-900 bg-gray-50 dark:bg-blue-900/20 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Currency</label>
              <select
                name="currency"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-blue-900 bg-gray-50 dark:bg-blue-900/20 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all appearance-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="XAF">CFA Franc (FCFA)</option>
                <option value="NGN">Naira (₦)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rotation Frequency</label>
              <select
                name="frequency"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-blue-900 bg-gray-50 dark:bg-blue-900/20 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all appearance-none"
              >
                <option value="WEEKLY">Weekly</option>
                <option value="BIWEEKLY">Bi-weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <input
                name="startDate"
                type="date"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-blue-900 bg-gray-50 dark:bg-blue-900/20 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-blue-900 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full bg-blue-950 dark:bg-white text-white dark:text-blue-950 font-bold hover:bg-blue-900 dark:hover:bg-gray-100 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

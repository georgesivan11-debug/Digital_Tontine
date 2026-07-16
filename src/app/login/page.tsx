"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { loginUser } from "@/app/actions/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Note: searchParams is used to show a success message after registration
  // For a purely clean implementation in App Router, we'd wrap this in a Suspense boundary if using useSearchParams
  // But for this MVP, it's fine.

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await loginUser(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <Image src="/logo.png" alt="Digital Tontine Logo" width={48} height={48} className="mx-auto rounded-full shadow-lg mb-4" />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-medium text-gold-500 hover:text-gold-400">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-blue-950 bg-gold-400 hover:bg-gold-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1020] text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium animate-pulse">
            Verifying session, please wait...
          </p>
        </div>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1020] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-[100px] left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute -top-[100px] right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-600/15 blur-[120px]" />
      </div>

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-16 relative z-10">
        {/* Banner */}
        <div className="mb-10 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-3">
            Secure Area
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
            User Profile
          </h1>
          <p className="text-slate-450 text-sm font-light">
            Review your registration credentials, unique telemetry indicators, and security statuses.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-900">
            {/* Avatar Circle */}
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-lg font-bold text-white shadow-md">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{user.name || "Authenticated User"}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Role: Candidate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Email Address</span>
              <span className="text-sm text-slate-200">{user.email}</span>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Verification Status</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
                Verified
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1.5">User Identifier (UUID)</span>
              <span className="text-xs text-slate-350 font-mono block overflow-x-auto bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                {user.id}
              </span>
            </div>

            {user.createdAt && (
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Account Created At</span>
                <span className="text-xs text-slate-350 font-mono">
                  {new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

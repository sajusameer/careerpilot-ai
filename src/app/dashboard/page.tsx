"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface ResourceItem {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [recentResources, setRecentResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Load user created items to show real recent activity
  useEffect(() => {
    if (session) {
      const fetchRecent = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/resources", {
            credentials: "include",
          });
          const data = await response.json();
          if (response.ok && data.success) {
            const list: ResourceItem[] = data.data;
            setRecentResources(list.slice(0, 3));
          }
        } catch (err) {
          console.error("Failed to load recent resources:", err);
        }
      };
      fetchRecent();
    }
  }, [session]);

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

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 relative z-10 w-full">
        {/* Welcome Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
            Welcome to your Dashboard, {user.name || "User"}
          </h1>
          <p className="text-slate-400 text-sm font-light">
            Access your AI career copilots, explore matching pathways, and organize your resource catalog.
          </p>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* AI Resume Analyzer */}
          <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">AI Resume Analyzer</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                Paste your resume text to get parsed recommendations, missing skill indicators, and ATS compatibility scores.
              </p>
            </div>
            <Link
              href="/dashboard/resume-analyzer"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/link"
            >
              Launch Analyzer
              <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* AI Career Recommendation Engine */}
          <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Career Recommendations</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                Provide your skills, goals, and interests to generate customized portfolio suggestions and milestones.
              </p>
            </div>
            <Link
              href="/dashboard/career-recommendations"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/link"
            >
              Launch Copilot
              <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Explore Careers */}
          <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Explore Career Paths</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                Search through our catalog of highly-demanded tech roles, average salary data, and developmental requirements.
              </p>
            </div>
            <Link
              href="/careers"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/link"
            >
              Search Listings
              <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Manage Career Resources */}
          <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Manage Resources</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                Organize and catalog your local guides, project bookmarks, and learning telemetry guides.
              </p>
            </div>
            <Link
              href="/items/manage"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/link"
            >
              Manage Workspace
              <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Real Activity Logs Section */}
        <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Recent Activity</h3>
          {recentResources.length > 0 ? (
            <div className="space-y-3">
              {recentResources.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-2 border-b border-slate-900 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-200">{item.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-[9px] text-indigo-400">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-light italic">
              No recent activities recorded. Create resources or run AI copilots to display history metrics.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

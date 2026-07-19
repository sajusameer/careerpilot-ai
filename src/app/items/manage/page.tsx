"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { API_BASE_URL } from "@/lib/config";

interface ResourceItem {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  experienceLevel: string;
  requiredSkills: string[];
  imageUrl?: string;
  createdBy?: string;
  createdAt: string;
}

export default function ManageItemsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Load items from backend REST API
  const fetchResources = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/api/resources`, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load resources.");
      }
      setItems(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchResources();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resource?");
    if (!confirmDelete) return;

    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/api/resources/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401) {
        alert("Unauthorized: Please sign in to delete resources.");
        router.push("/login");
        return;
      }
      if (response.status === 403) {
        alert("Forbidden: You can only delete resources that you created.");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete the resource.");
      }

      // Refresh list
      fetchResources();
    } catch (err: any) {
      alert(err.message || "Failed to delete the resource. Please try again.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  // Filter listed resources to only display ones owned by this user
  const userResources = items.filter(
    (item) => !item.createdBy || item.createdBy === session?.user?.id
  );

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

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1020] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-[100px] left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute -top-[100px] right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-600/15 blur-[120px]" />
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-3">
              Resources Hub
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Manage Resources
            </h1>
            <p className="text-slate-400 text-sm font-light">
              Add, inspect, edit, and delete your customized learning portfolios and tech career guides.
            </p>
          </div>
          <Link
            href="/items/add"
            className="text-xs font-semibold text-white bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            + Add New Resource
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* List Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-24 rounded-xl bg-slate-900/20 border border-slate-850 animate-pulse" />
            ))}
          </div>
        ) : userResources.length > 0 ? (
          <div className="space-y-4">
            {userResources.map((item) => {
              const isExpanded = expandedItemId === item._id;
              const isOwner = !item.createdBy || item.createdBy === session?.user?.id;

              return (
                <div
                  key={item._id}
                  className="bg-slate-900/30 border border-slate-855 hover:border-slate-800 rounded-xl overflow-hidden transition-all shadow-md"
                >
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                          {item.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                          {item.experienceLevel}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-400 font-light">{item.shortDescription}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => toggleExpand(item._id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
                      >
                        {isExpanded ? "Hide Details" : "View Details"}
                      </button>

                      {isOwner && (
                        <>
                          <Link
                            href={`/items/edit/${item._id}`}
                            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-indigo-650 hover:bg-indigo-700 text-xs font-semibold text-white transition-all text-center cursor-pointer"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="px-3 py-1.5 rounded-lg border border-rose-950/20 bg-rose-950/10 text-xs font-semibold text-rose-450 hover:bg-rose-950/25 transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-slate-900 bg-slate-950/40 p-5 space-y-4 animate-fadeIn">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Detailed Content</h4>
                        <p className="text-xs text-slate-350 leading-relaxed font-light whitespace-pre-wrap">
                          {item.fullDescription}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Target Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {item.requiredSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {item.imageUrl && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Associated Reference Image</h4>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="max-h-48 rounded-lg border border-slate-850 object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="py-20 text-center border border-dashed border-slate-850 rounded-xl bg-slate-900/5">
            <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center mb-4 text-slate-550 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-350 mb-1">No resources found</h3>
            <p className="text-xs text-slate-500 font-light max-w-xs mx-auto mb-6">
              You haven't added any custom career portfolios or technology roadmaps to your secure workspace yet.
            </p>
            <Link
              href="/items/add"
              className="inline-flex h-9 px-4 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white font-semibold text-xs justify-center items-center cursor-pointer"
            >
              + Create First Resource
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

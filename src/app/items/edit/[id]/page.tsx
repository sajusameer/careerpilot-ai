"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { data: session, isPending } = authClient.useSession();

  // Form Fields State
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [difficulty, setDifficulty] = useState("Mid");
  const [skills, setSkills] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isOwner, setIsOwner] = useState(true);

  // Authenticate session on load
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Fetch target resource and pre-fill form
  useEffect(() => {
    const fetchResource = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
          credentials: "include",
        });
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load resource details.");
        }
        
        const resource = data.data;
        
        // Ownership Check
        if (resource.createdBy && session?.user?.id && resource.createdBy !== session.user.id) {
          setIsOwner(false);
          setError("Forbidden: You do not own this resource. Only the creator can modify it.");
          return;
        }

        setTitle(resource.title || "");
        setShortDesc(resource.shortDescription || "");
        setFullDesc(resource.fullDescription || "");
        setCategory(resource.category || "Engineering");
        setDifficulty(resource.experienceLevel || "Mid");
        setSkills(resource.requiredSkills ? resource.requiredSkills.join(", ") : "");
        setImageUrl(resource.imageUrl || "");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session && id) {
      fetchResource();
    }
  }, [session, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOwner) return;

    if (!title.trim() || !shortDesc.trim() || !fullDesc.trim() || !skills.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        title: title.trim(),
        shortDescription: shortDesc.trim(),
        fullDescription: fullDesc.trim(),
        category,
        experienceLevel: difficulty,
        requiredSkills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        imageUrl: imageUrl.trim() || undefined,
      };

      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 403) {
        throw new Error("Forbidden: You do not own this resource.");
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update career resource.");
      }

      setSuccess(true);
      
      // Redirect after brief timeout
      setTimeout(() => {
        router.push("/items/manage");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to update career resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1020] text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium animate-pulse">
            {isPending ? "Verifying session, please wait..." : "Loading resource details..."}
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

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 relative z-10 w-full">
        {/* Banner */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-3">
              Resources Workspace
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Edit Career Resource
            </h1>
            <p className="text-slate-400 text-sm font-light">
              Modify the properties and details of your career roadmap.
            </p>
          </div>
          <Link
            href="/items/manage"
            className="text-xs font-semibold text-slate-450 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-800 bg-slate-900/30 px-3 py-2 rounded-xl"
          >
            Cancel
          </Link>
        </div>

        {/* Form panel */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 md:p-8 shadow-xl">
          {error && (
            <div className={`mb-6 p-4 rounded-lg border text-xs ${
              !isOwner 
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400" 
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Resource updated successfully! Saving modifications...</span>
            </div>
          )}

          {isOwner && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light"
                  placeholder="e.g. Next.js Architecture Guidelines"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light"
                  placeholder="Brief summary of this career resource..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Full Content / Detailed Roadmap *
                </label>
                <textarea
                  required
                  rows={6}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light leading-relaxed resize-none"
                  placeholder="Describe the full content, roadmap steps, or instructions..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm cursor-pointer font-light"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                    Difficulty / Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm cursor-pointer font-light"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Required Key Skills (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light"
                  placeholder="e.g. Next.js, Routing, SSR"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Optional Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light"
                  placeholder="e.g. https://example.com/image.png"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="flex h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  "Update Resource"
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

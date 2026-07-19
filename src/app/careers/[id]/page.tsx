"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

interface CareerResource {
  _id: string;
  title: string;
  category: string;
  experienceLevel: string;
  shortDescription: string;
  fullDescription: string;
  requiredSkills: string[];
  imageUrl?: string;
  createdAt: string;
}

export default function CareerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  const [career, setCareer] = useState<CareerResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        const response = await fetch(`${API_BASE_URL}/api/resources/${id}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load resource details.");
        }
        
        setCareer(data.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1020] text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium animate-pulse">Loading career roadmap details...</p>
        </div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1020] text-slate-100 px-6">
        <div className="max-w-md w-full bg-slate-900/40 border border-slate-850 p-8 rounded-2xl shadow-xl text-center space-y-5">
          <div className="h-12 w-12 rounded-full bg-slate-950 border border-slate-900 text-rose-500 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-2">Career Resource Not Found</h3>
            <p className="text-xs text-slate-450 leading-relaxed font-light">
              {error || "The requested career resource could not be found or has been deleted from MongoDB."}
            </p>
          </div>
          <Link
            href="/careers"
            className="inline-flex h-9 px-5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-semibold text-xs justify-center items-center transition-all cursor-pointer"
          >
            Back to Explore Careers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1020] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-[150px] left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute -top-[100px] right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-600/15 blur-[120px]" />
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 relative z-10">
        
        {/* Navigation Link back */}
        <div className="mb-8">
          <Link
            href="/careers"
            className="text-xs font-semibold text-slate-450 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Explore Careers
          </Link>
        </div>

        {/* Career Summary Header */}
        <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
              {career.category}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              {career.experienceLevel}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs font-light text-slate-400">
              Added: {new Date(career.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            {career.title}
          </h1>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            {career.shortDescription}
          </p>
        </div>

        {/* Detailed Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Left Column: Full Description and Visuals */}
          <div className="md:col-span-8 space-y-8">
            {/* Description */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Role Overview</h3>
              <p className="text-xs text-slate-350 leading-relaxed font-light whitespace-pre-wrap">
                {career.fullDescription}
              </p>
            </div>

            {/* Optional Banner Image Display */}
            {career.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-850 bg-slate-950/60 p-2 flex items-center justify-center max-h-80">
                <img
                  src={career.imageUrl}
                  alt={career.title}
                  className="max-h-72 object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Right Column: Required Skills */}
          <div className="md:col-span-4 space-y-8">
            {/* Required Skills */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Required Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {career.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-slate-950 border border-slate-850 text-xs font-light text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

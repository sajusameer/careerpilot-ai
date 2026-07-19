"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

interface CareerResource {
  _id: string;
  title: string;
  category: string;
  experienceLevel: string;
  shortDescription: string;
  requiredSkills: string[];
  imageUrl?: string;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CareersPage() {
  // Inputs & Filters State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Data State
  const [resources, setResources] = useState<CareerResource[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search term changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, levelFilter, sortBy]);

  // Fetch Resources from Backend API
  const fetchResources = async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (debouncedSearch.trim()) {
        params.append("search", debouncedSearch.trim());
      }
      if (categoryFilter !== "All") {
        params.append("category", categoryFilter);
      }
      if (levelFilter !== "All") {
        params.append("experienceLevel", levelFilter);
      }
      params.append("sort", sortBy);
      params.append("page", String(currentPage));
      params.append("limit", "12");

      const response = await fetch(`${API_BASE_URL}/api/resources?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load career resources.");
      }

      setResources(data.data || []);
      setPagination(data.pagination || null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch career resources. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [debouncedSearch, categoryFilter, levelFilter, sortBy, currentPage]);

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategoryFilter("All");
    setLevelFilter("All");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1020] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-[150px] left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute -top-[100px] right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-600/15 blur-[120px]" />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Banner Headers */}
        <div className="text-center sm:text-left mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-3">
            Career Paths
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Explore Careers
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl font-light">
            Search, filter, and discover highly demanded technology career pathways. Drill down to inspect required skillsets and milestones.
          </p>
        </div>

        {/* Filters and Inputs Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-8 bg-slate-900/30 border border-slate-900 p-4 rounded-xl backdrop-blur-sm">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-light"
              placeholder="Search by title, description, or skill..."
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs cursor-pointer font-light"
            >
              <option value="All">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
              <option value="Management">Management</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="md:col-span-3">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs cursor-pointer font-light"
            >
              <option value="All">All Levels</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          {/* Sort Selection */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs cursor-pointer font-light"
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
              <option value="title-asc">Sort by Title (A-Z)</option>
              <option value="title-desc">Sort by Title (Z-A)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Results Listings */}
        {isLoading ? (
          /* Skeletons Layout - 4-column responsive grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 4, 4].map((skeleton, idx) => (
              <div key={idx} className="h-64 rounded-xl border border-slate-850 bg-slate-900/20 p-6 flex flex-col justify-between animate-pulse">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-800 rounded w-4/5" />
                  </div>
                </div>
                <div className="h-8 bg-slate-800 rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : resources.length > 0 ? (
          /* Real Cards Grid - 4 columns on desktop, 2 on tablet, 1 on mobile */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {resources.map((career) => (
              <div
                key={career._id}
                className="bg-slate-900/30 border border-slate-855 hover:border-indigo-500/30 rounded-xl p-5 flex flex-col justify-between hover:bg-slate-900/50 transition-all duration-300 group shadow-lg"
              >
                <div>
                  {/* Category/Level Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      {career.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      {career.experienceLevel}
                    </span>
                  </div>

                  {/* Optional Image */}
                  {career.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-slate-850 h-24 bg-slate-950 flex items-center justify-center">
                      <img
                        src={career.imageUrl}
                        alt={career.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors truncate">
                    {career.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mb-4 line-clamp-3 min-h-[48px]">
                    {career.shortDescription}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-6">
                    {career.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 rounded bg-slate-950 text-[9px] text-slate-500 font-mono truncate max-w-[120px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/careers/${career._id}`}
                  className="w-full py-2 text-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center border border-dashed border-slate-850 rounded-xl bg-slate-900/5 mb-8">
            <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center mb-4 text-slate-500 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-350 mb-1">No career resources found</h3>
            <p className="text-xs text-slate-500 font-light max-w-xs mx-auto mb-4">
              We couldn't find any career paths matching your search filter terms.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && !isLoading && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs text-slate-550">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

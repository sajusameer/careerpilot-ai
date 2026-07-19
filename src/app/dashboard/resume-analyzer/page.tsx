"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface ResumeAnalysis {
  overallScore: number;
  professionalSummary: string;
  strengths: string[];
  weaknesses: string[];
  skillsDetected: string[];
  technicalSkills: string[];
  softSkills: string[];
  experienceAnalysis: string;
  educationAnalysis: string;
  missingSkills: string[];
  skillGapAnalysis: string;
  atsCompatibility: string;
  atsIssues: string[];
  improvementSuggestions: string[];
  recommendedCareerPaths: string[];
  suitableJobRoles: string[];
  personalizedActionPlan: string[];
}

interface HistoryItem {
  _id: string;
  inputType: "text" | "pdf" | "image" | "url";
  originalFileName?: string;
  sourceUrl?: string;
  createdAt: string;
  analysis: {
    overallScore: number;
  };
}

export default function ResumeAnalyzerPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Left column active sub-pane: "new" (tabs) vs "history"
  const [leftPane, setLeftPane] = useState<"new" | "history">("new");

  // Input tabs
  const [activeTab, setActiveTab] = useState<"text" | "pdf" | "image" | "url">("text");

  // Form inputs
  const [resumeText, setResumeText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState("");

  // Process / Error states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  
  // Results states
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);

  // History states
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Fetch History Index List
  const fetchHistory = async () => {
    if (!session) return;
    try {
      setIsLoadingHistory(true);
      setHistoryError("");
      const response = await fetch("http://localhost:5000/api/resume/analyses", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setHistoryList(data.data);
      } else {
        setHistoryError(data.error || "Failed to load history list.");
      }
    } catch (err) {
      console.error(err);
      setHistoryError("Failed to connect to the server.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchHistory();
    }
  }, [session]);

  // Open a specific previous analysis details
  const handleOpenHistoryItem = async (id: string) => {
    try {
      setIsAnalyzing(true);
      setError("");
      const res = await fetch(`http://localhost:5000/api/resume/analyses/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAnalysis(data.data.analysis);
        setActiveAnalysisId(data.data._id);
      } else {
        setError(data.error || "Failed to open previous analysis.");
      }
    } catch (err) {
      setError("Failed to fetch analysis details from the server.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Triggers the analysis
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError("");
    setAnalysis(null);
    setActiveAnalysisId(null);

    try {
      let response;
      if (activeTab === "text") {
        const textContent = resumeText.trim();
        if (textContent.length < 50) {
          throw new Error("Resume text is too short. Please provide at least 50 characters of content.");
        }
        response = await fetch("http://localhost:5000/api/resume/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resumeText: textContent }),
          credentials: "include",
        });
      } else if (activeTab === "pdf") {
        if (!pdfFile) {
          throw new Error("Please select a PDF resume to upload.");
        }
        if (pdfFile.size > 5 * 1024 * 1024) {
          throw new Error("File exceeds the maximum limit of 5 MB.");
        }
        if (pdfFile.type !== "application/pdf") {
          throw new Error("Only PDF files are allowed on this tab.");
        }
        const formData = new FormData();
        formData.append("file", pdfFile);
        response = await fetch("http://localhost:5000/api/resume/analyze", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      } else if (activeTab === "image") {
        if (!imageFile) {
          throw new Error("Please select a resume image to upload.");
        }
        if (imageFile.size > 5 * 1024 * 1024) {
          throw new Error("File exceeds the maximum limit of 5 MB.");
        }
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(imageFile.type)) {
          throw new Error("Unsupported image format. Allowed formats: JPG, JPEG, PNG, WEBP.");
        }
        const formData = new FormData();
        formData.append("file", imageFile);
        response = await fetch("http://localhost:5000/api/resume/analyze", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      } else {
        // url tab
        const urlStr = resumeUrl.trim();
        if (!urlStr) {
          throw new Error("Please enter a resume URL.");
        }
        try {
          new URL(urlStr);
        } catch (_) {
          throw new Error("Invalid URL format. Please include http:// or https://");
        }
        response = await fetch("http://localhost:5000/api/resume/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: urlStr }),
          credentials: "include",
        });
      }

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setAnalysis(data.analysis);

      // Refresh history list and map the newly created record ID
      await fetchHistory();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Find and link the active ID from the refreshed list
  useEffect(() => {
    if (analysis && historyList.length > 0 && !activeAnalysisId) {
      // Find the newest matching analysis overallScore as a best-effort link
      const matching = historyList[0];
      if (matching && matching.analysis.overallScore === analysis.overallScore) {
        setActiveAnalysisId(matching._id);
      }
    }
  }, [analysis, historyList, activeAnalysisId]);

  // Clean up image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      if (error) setError("");
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      if (error) setError("");
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setActiveAnalysisId(null);
    setError("");
  };

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

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 relative z-10 w-full">
        {/* Title */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-3">
              Advanced Resume Intelligence
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              AI Resume Analyzer
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl font-light">
              Submit your resume using text, PDF, image, or URL. Our agentic parser audits scores, detects skill gaps, checks ATS layout compatibility, and recommends directions.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-450 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-800 bg-slate-900/30 px-3 py-2 rounded-xl"
          >
            Dashboard
          </Link>
        </div>

        {/* Form and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form / History selector */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Top Level Pane Switcher */}
            <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-900">
              <button
                onClick={() => setLeftPane("new")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  leftPane === "new" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                New Analysis
              </button>
              <button
                onClick={() => setLeftPane("history")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  leftPane === "history" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Analysis History ({historyList.length})
              </button>
            </div>

            {leftPane === "new" ? (
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-850 rounded-2xl shadow-2xl p-6 space-y-5">
                
                {/* Method Tab Segmented Bar */}
                <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850/60">
                  {(["text", "pdf", "image", "url"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        setError("");
                      }}
                      className={`py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === tab ? "bg-slate-800 text-cyan-400 shadow" : "text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAnalyze} className="space-y-5">
                  
                  {/* TAB 1: TEXT INPUT */}
                  {activeTab === "text" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450">
                          Paste Resume Text *
                        </label>
                        <span className="text-[10px] font-mono text-slate-500">
                          {resumeText.length} characters (min 50)
                        </span>
                      </div>
                      <textarea
                        value={resumeText}
                        onChange={(e) => {
                          setResumeText(e.target.value);
                          if (error) setError("");
                        }}
                        disabled={isAnalyzing}
                        className="w-full h-80 p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-light leading-relaxed resize-none"
                        placeholder="Paste plain resume text here..."
                      />
                      {resumeText.trim().length > 0 && resumeText.trim().length < 50 && (
                        <p className="text-[10px] text-amber-500">Must be at least 50 characters to analyze.</p>
                      )}
                    </div>
                  )}

                  {/* TAB 2: PDF UPLOAD */}
                  {activeTab === "pdf" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                        Upload PDF Document *
                      </label>
                      
                      {!pdfFile ? (
                        <div className="border border-dashed border-slate-800 bg-slate-950 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors relative cursor-pointer">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-xs text-slate-400 font-medium block">Click to select PDF resume</span>
                          <span className="text-[10px] text-slate-550 block mt-1">Maximum file size: 5 MB</span>
                        </div>
                      ) : (
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="h-8 w-8 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">PDF</span>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-white truncate">{pdfFile.name}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{(pdfFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPdfFile(null)}
                            className="text-[10px] font-semibold text-rose-400 hover:underline shrink-0 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: IMAGE UPLOAD */}
                  {activeTab === "image" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                        Upload Resume Image *
                      </label>

                      {!imageFile ? (
                        <div className="border border-dashed border-slate-800 bg-slate-950 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors relative cursor-pointer">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-slate-400 font-medium block">Click to select resume image</span>
                          <span className="text-[10px] text-slate-550 block mt-1">JPEG, JPG, PNG, WEBP (Max 5 MB)</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="h-8 w-8 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">IMG</span>
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold text-white truncate">{imageFile.name}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{(imageFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreviewUrl("");
                              }}
                              className="text-[10px] font-semibold text-rose-400 hover:underline shrink-0 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>

                          {imagePreviewUrl && (
                            <div className="relative rounded-lg overflow-hidden border border-slate-850 max-h-40 flex items-center justify-center bg-slate-950/60 p-2">
                              <img src={imagePreviewUrl} alt="Resume Preview" className="max-h-36 object-contain rounded" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: RESUME URL */}
                  {activeTab === "url" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                          Resume URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={resumeUrl}
                          onChange={(e) => {
                            setResumeUrl(e.target.value);
                            if (error) setError("");
                          }}
                          disabled={isAnalyzing}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-light"
                          placeholder="e.g. https://example.com/resumes/my-resume.pdf"
                        />
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-955/35 border border-slate-900 text-[10px] text-slate-400 leading-relaxed font-light space-y-1">
                        <p className="font-semibold text-slate-300">Security & Access parameters:</p>
                        <p>1. The remote file link must be publicly accessible via HTTP/HTTPS protocols.</p>
                        <p>2. Accessing loopback addresses (localhost), private subnets, or internal services is blocked for SSRF protection.</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-400 flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      isAnalyzing ||
                      (activeTab === "text" && resumeText.trim().length < 50) ||
                      (activeTab === "pdf" && !pdfFile) ||
                      (activeTab === "image" && !imageFile) ||
                      (activeTab === "url" && !resumeUrl.trim())
                    }
                    className="w-full py-3 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-lg shadow-indigo-600/10 transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="flex h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing Resume with AI...
                      </>
                    ) : (
                      "Analyze Resume"
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* HISTORY LIST PANE */
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-850 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[500px] overflow-y-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Previous Evaluations</h3>
                
                {isLoadingHistory ? (
                  <div className="space-y-3 py-4">
                    {[1, 2].map((n) => (
                      <div key={n} className="h-16 rounded-xl bg-slate-950/40 border border-slate-900 animate-pulse" />
                    ))}
                  </div>
                ) : historyError ? (
                  <p className="text-xs text-red-400 font-light">{historyError}</p>
                ) : historyList.length > 0 ? (
                  <div className="space-y-2">
                    {historyList.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => handleOpenHistoryItem(item._id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          activeAnalysisId === item._id
                            ? "bg-indigo-600/10 border-indigo-500 text-white"
                            : "bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold truncate">
                            {item.inputType === "pdf" && item.originalFileName
                              ? item.originalFileName
                              : item.inputType === "image" && item.originalFileName
                              ? item.originalFileName
                              : item.inputType === "url" && item.sourceUrl
                              ? item.sourceUrl
                              : "Pasted Text Analysis"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] uppercase tracking-wider font-semibold px-1 rounded bg-slate-800 text-slate-400 shrink-0">
                              {item.inputType}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-indigo-400 shrink-0">
                          {item.analysis?.overallScore || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 font-light text-xs italic border border-dashed border-slate-850 rounded-xl">
                    No history logs found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Polished Results Dashboard */}
          <div className="lg:col-span-7">
            {isAnalyzing && (
              <div className="h-[520px] flex flex-col items-center justify-center border border-slate-800/40 bg-slate-900/20 rounded-2xl p-8 text-center backdrop-blur-sm animate-pulse">
                <span className="flex h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Analyzing Resume</h3>
                <p className="text-xs text-slate-400 max-w-sm font-light">
                  Gemini is parsing the formatting, auditing ATS layout compatibility, extracting soft & technical skills, and building your report. Please wait...
                </p>
              </div>
            )}

            {!isAnalyzing && !analysis && (
              <div className="h-[520px] flex flex-col items-center justify-center border border-dashed border-slate-850 bg-slate-900/10 rounded-2xl p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center mb-4 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-350 mb-1">Awaiting Evaluation</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-light">
                  Trigger an analysis on the left pane or inspect previous history records to display your AI Career Roadmap dashboard.
                </p>
              </div>
            )}

            {analysis && !isAnalyzing && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* 1. Score & Re-analyze Header */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-850 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-850"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-cyan-400 animate-drawCircle"
                          strokeWidth="3"
                          strokeDasharray={`${analysis.overallScore}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-2xl font-black text-white">
                        {analysis.overallScore}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Overall ATS Quality Score</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed font-light">
                        {analysis.overallScore >= 80
                          ? "Outstanding! Highly compliant format. Ready to submit to top tier platforms."
                          : analysis.overallScore >= 60
                          ? "Satisfactory foundation, but some key skill terms and format changes are recommended."
                          : "Needs immediate overhaul. Follow the suggestions and check issues list."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-xs font-semibold text-slate-350 hover:text-white bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition-all cursor-pointer text-center"
                    >
                      Analyze Another
                    </button>
                    
                    {activeAnalysisId && (
                      <Link
                        href={`/dashboard/career-recommendations?resumeAnalysisId=${activeAnalysisId}`}
                        className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-650/20 text-center shrink-0"
                      >
                        Get Career Recommendations →
                      </Link>
                    )}
                  </div>
                </div>

                {/* 2. Professional Summary & ATS Compatibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                      Professional summary
                    </h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-light">
                      {analysis.professionalSummary}
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                      ATS compatibility evaluation
                    </h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-light">
                      {analysis.atsCompatibility}
                    </p>
                  </div>
                </div>

                {/* 3. Strengths & Concerns (Weaknesses) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-450 mb-3">
                      Parsed Strengths
                    </h4>
                    <ul className="space-y-2">
                      {analysis.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs text-slate-350 leading-relaxed font-light flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-3">
                      Areas of Concern (Weaknesses)
                    </h4>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((wk, idx) => (
                        <li key={idx} className="text-xs text-slate-355 leading-relaxed font-light flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. Skills Detected Sub-Breakdowns */}
                <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">Technical Skills Detected</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.technicalSkills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-300 font-light">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Soft Skills Detected</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.softSkills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-300 font-light">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Experience & Education Critiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">Experience Section Analysis</h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-light">
                      {analysis.experienceAnalysis}
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">Education Section Analysis</h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-light">
                      {analysis.educationAnalysis}
                    </p>
                  </div>
                </div>

                {/* 6. Missing Core Skills & Gap Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-3">Missing Core Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingSkills.length > 0 ? (
                        analysis.missingSkills.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-rose-955/10 border border-rose-500/20 text-[10px] text-rose-455">
                            {sk}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 font-light italic">None detected</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2.5">Skill Gap Audit</h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-light">
                      {analysis.skillGapAnalysis}
                    </p>
                  </div>
                </div>

                {/* 7. ATS Issues & Formatting Corrections */}
                {analysis.atsIssues.length > 0 && (
                  <div className="bg-rose-955/5 border border-rose-500/15 rounded-2xl p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">ATS Format / Structure Issues</h4>
                    <ul className="space-y-2">
                      {analysis.atsIssues.map((issue, idx) => (
                        <li key={idx} className="text-xs text-slate-355 font-light leading-relaxed flex items-start gap-2.5">
                          <span className="text-rose-500 mt-0.5 shrink-0">✕</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 8. Suggestions & Matches */}
                <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">Actionable Content Suggestions</h4>
                  <ul className="space-y-2.5">
                    {analysis.improvementSuggestions.map((sug, idx) => (
                      <li key={idx} className="text-xs text-slate-350 font-light leading-relaxed flex items-start gap-2.5">
                        <span className="text-indigo-400 mt-0.5 shrink-0">→</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Paths */}
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">Recommended Career Tracks</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.recommendedCareerPaths.map((path, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-900 text-xs text-slate-300 font-light">
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Job Roles */}
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">Suitable Job Roles</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.suitableJobRoles.map((role, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-900 text-xs text-slate-300 font-light">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 9. Personalized Action Plan */}
                <div className="bg-indigo-950/10 border border-indigo-500/10 rounded-2xl p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">Personalized Action Steps Checklist</h4>
                  <ul className="space-y-2.5">
                    {analysis.personalizedActionPlan.map((step, idx) => (
                      <li key={idx} className="text-xs text-slate-350 font-light leading-relaxed flex items-start gap-2.5">
                        <span className="h-4.5 w-4.5 rounded border border-slate-800 bg-slate-950 flex items-center justify-center text-[9px] text-indigo-400 shrink-0 font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

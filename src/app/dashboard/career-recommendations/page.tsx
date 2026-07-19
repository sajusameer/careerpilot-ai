"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface CareerPath {
  pathTitle: string;
  reasoning: string;
  demandLevel: string;
}

interface ProjectSuggestion {
  projectTitle: string;
  description: string;
  keyTechStack: string[];
}

interface RoadmapStep {
  stepNumber: number;
  milestone: string;
  timeline: string;
  skillsToFocus: string[];
}

interface CareerRecommendations {
  recommendedCareerPaths: CareerPath[];
  suitableJobRoles: string[];
  skillsToLearn: string[];
  projectSuggestions: ProjectSuggestion[];
  careerRoadmap: RoadmapStep[];
  recommendationReasoning?: string;
  skillGapAnalysis?: string;
  prioritySkills?: string[];
  shortTermGoals?: string[];
  mediumTermGoals?: string[];
  longTermGoals?: string[];
  confidenceScore?: number;
}

function CareerRecommendationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeAnalysisId = searchParams.get("resumeAnalysisId");
  const { data: session, isPending } = authClient.useSession();

  // Input states
  const [skillsInput, setSkillsInput] = useState("");
  const [experienceInput, setExperienceInput] = useState("");
  const [educationInput, setEducationInput] = useState("");
  const [careerGoalInput, setCareerGoalInput] = useState("");
  const [interestsInput, setInterestsInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState<CareerRecommendations | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Pre-populate form inputs if resumeAnalysisId context is supplied
  useEffect(() => {
    if (session && resumeAnalysisId) {
      const fetchResumeContext = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/resume/analyses/${resumeAnalysisId}`, {
            credentials: "include",
          });
          const result = await res.json();
          if (res.ok && result.success && result.data?.analysis) {
            const analysis = result.data.analysis;
            
            // Skills Detected
            if (analysis.skillsDetected && analysis.skillsDetected.length > 0) {
              setSkillsInput(analysis.skillsDetected.join(", "));
            } else if (analysis.technicalSkills) {
              const allSkills = [...analysis.technicalSkills, ...(analysis.softSkills || [])];
              setSkillsInput(allSkills.join(", "));
            }

            // Summary
            if (analysis.professionalSummary) {
              setExperienceInput(analysis.professionalSummary);
            }

            // Career Goal
            if (analysis.recommendedCareerPaths && analysis.recommendedCareerPaths.length > 0) {
              setCareerGoalInput(analysis.recommendedCareerPaths[0]);
            }

            // Education
            if (analysis.educationAnalysis) {
              // Extract clean string representation or truncate
              const cleanEd = analysis.educationAnalysis.split(".")[0];
              setEducationInput(cleanEd || "Bachelor's Degree");
            }
          }
        } catch (err) {
          console.error("Failed to load resume analysis context", err);
        }
      };
      fetchResumeContext();
    }
  }, [session, resumeAnalysisId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!skillsInput.trim() || !experienceInput.trim() || !educationInput.trim() || !careerGoalInput.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setRecommendations(null);

    // Parse comma-separated fields
    const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const interests = interestsInput.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      const response = await fetch("http://localhost:5000/api/career/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills,
          experience: experienceInput,
          education: educationInput,
          careerGoal: careerGoalInput,
          interests,
          resumeAnalysisId: resumeAnalysisId || undefined,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate recommendations. Please try again.");
      }

      setRecommendations(data.recommendations);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="absolute -top-[100px] left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
        <div className="absolute -top-[100px] right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-600/15 blur-[100px]" />
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 relative z-10 w-full">
        {/* Title Banner */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-3">
              Agentic AI Feature
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              AI Career Recommendations
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl font-light">
              Enter your professional credentials, targets, and interests below to receive personalized roadmap guidelines, recommended projects, and transition advice.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-450 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-800 bg-slate-900/30 px-3 py-2 rounded-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            Dashboard
          </Link>
        </div>

        {/* Input Form and Results layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile Form */}
          <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-xl border border-slate-850 rounded-2xl shadow-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Skills (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light"
                  placeholder="e.g. JavaScript, React, Git, HTML"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Professional Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={experienceInput}
                  onChange={(e) => setExperienceInput(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light resize-none leading-relaxed"
                  placeholder="Describe your years of experience, past roles, or profile highlights..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Education Background *
                </label>
                <input
                  type="text"
                  required
                  value={educationInput}
                  onChange={(e) => setEducationInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light"
                  placeholder="e.g. B.S. in Computer Science"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Long-term Career Goal *
                </label>
                <input
                  type="text"
                  required
                  value={careerGoalInput}
                  onChange={(e) => setCareerGoalInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light"
                  placeholder="e.g. Full-Stack Team Lead or Architect"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  Personal Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-light"
                  placeholder="e.g. Cloud Deployments, System Design"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-400 flex items-start gap-2">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="flex h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating recommendations...
                  </>
                ) : (
                  "Generate Recommendations"
                )}
              </button>
            </form>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-7">
            {isSubmitting && (
              <div className="h-[520px] flex flex-col items-center justify-center border border-slate-800/40 bg-slate-900/20 rounded-2xl p-8 text-center backdrop-blur-sm animate-pulse">
                <span className="flex h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Analyzing Profile Data</h3>
                <p className="text-xs text-slate-400 max-w-sm font-light">
                  Gemini is auditing your skills and target goals, drafting milestone roadmaps, and formulating appropriate suggestions. This will take a few seconds...
                </p>
              </div>
            )}

            {!isSubmitting && !recommendations && (
              <div className="h-[520px] flex flex-col items-center justify-center border border-dashed border-slate-850 bg-slate-900/10 rounded-2xl p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center mb-4 text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-300 mb-1">Awaiting Recommendations</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-light">
                  Submit your profile credentials on the left panel to receive structural career guidance and customized milestone roadmaps.
                </p>
              </div>
            )}

            {recommendations && (
              <div className="space-y-6 animate-fadeIn">
                {/* Recommended Career Paths */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended Career Paths</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {recommendations.recommendedCareerPaths.map((path, idx) => (
                      <div key={idx} className="bg-slate-900/40 border border-slate-850 rounded-xl p-5 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-white">{path.pathTitle}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            Demand: {path.demandLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">{path.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score and Reasoning details if present */}
                {recommendations.recommendationReasoning && (
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">AI Recommendation Reasoning</h4>
                      {recommendations.confidenceScore && (
                        <span className="text-xs font-semibold text-slate-400">
                          Confidence: <span className="text-indigo-400">{recommendations.confidenceScore}%</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-light whitespace-pre-line">
                      {recommendations.recommendationReasoning}
                    </p>
                  </div>
                )}

                {/* Skill Gap Analysis if present */}
                {recommendations.skillGapAnalysis && (
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">Skill Gap Audit</h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-light">
                      {recommendations.skillGapAnalysis}
                    </p>
                  </div>
                )}

                {/* Suitable Job Roles & Skills to Learn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Roles */}
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                      Target Job Titles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.suitableJobRoles.map((role, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-850 text-xs font-light text-slate-300">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills to Learn */}
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                      Suggested Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.skillsToLearn.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-indigo-950/15 border border-indigo-500/20 text-xs font-light text-indigo-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggested Portfolio Projects */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Suggested Portfolio Projects</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {recommendations.projectSuggestions.map((proj, idx) => (
                      <div key={idx} className="bg-slate-900/40 border border-slate-850 rounded-xl p-5">
                        <h4 className="text-xs font-bold text-white mb-1">{proj.projectTitle}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-light mb-3">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.keyTechStack.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-500 font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Roadmap */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Career Roadmap Milestones</h3>
                  <div className="relative border-l-2 border-slate-850 ml-3.5 pl-6 space-y-6">
                    {recommendations.careerRoadmap.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot */}
                        <div className="absolute -left-[35px] top-0.5 h-5.5 w-5.5 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-[9px] font-bold text-white">
                          {step.stepNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xs font-bold text-white">{step.milestone}</h4>
                            <span className="text-[10px] text-cyan-400 font-mono">({step.timeline})</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {step.skillsToFocus.map((sk, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-[9px] text-slate-450">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CareerRecommendationsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1020] text-slate-100">
        <span className="flex h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Loading recommendations engine...</p>
      </div>
    }>
      <CareerRecommendationsContent />
    </Suspense>
  );
}

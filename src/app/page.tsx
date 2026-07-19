"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = authClient.useSession();

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1020] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-[150px] left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute -top-[100px] right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/15 blur-[120px]" />
        <div className="absolute top-[200px] left-1/3 w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">

        {/* Split Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6 flex flex-col items-center lg:items-start animate-slideUp">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 shadow-sm shadow-indigo-500/5 animate-fadeIn">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              Next-Gen Agentic AI Career Platform
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight animate-slideUp animation-delay-100">
              Navigate Your Career with{" "}
              <span className="block mt-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Agentic Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl font-light animate-slideUp animation-delay-200">
              CareerPilot AI leverages autonomous AI agents to optimize your resume, map your career roadmap, find target roles, and track your growth in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2 animate-slideUp animation-delay-300">
              <Link
                href={session ? "/dashboard" : "/register"}
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-600/20 hover:opacity-95 hover:shadow-indigo-600/30 active:scale-[0.98] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Launch Copilot
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 animate-bounce-right"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <Link
                href={session ? "/dashboard/resume-analyzer" : "/login?redirect=/dashboard/resume-analyzer"}
                className="h-12 px-8 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm text-slate-300 font-semibold hover:bg-slate-900/60 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
              >
                Try Resume Analyzer
              </Link>
            </div>
          </div>

          {/* Right Column: Premium AI Assistant Widget Mockup */}
          <div className="lg:col-span-6 flex justify-center relative animate-fadeIn animation-delay-300">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-cyan-500/10 blur-2xl opacity-70 animate-pulseGlow" />

            <div className="relative w-full max-w-[480px] bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6 animate-float">

              {/* Widget Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">career_roadmap_v2.json</span>
              </div>

              {/* Top Row: Score Circular Dial */}
              <div className="flex items-center gap-5 bg-slate-950/60 border border-slate-850 p-4 rounded-xl shadow-inner">
                <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800/80"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-500"
                      strokeWidth="3"
                      strokeDasharray="85, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-white">85</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">ATS Score Compatibility</h4>
                  <p className="text-[10px] text-cyan-400 mt-1">Excellent fit for Full-Stack / Software Architect</p>
                </div>
              </div>

              {/* Center Row: Roadmap Steps */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-5 w-5 rounded-full bg-indigo-600 border-2 border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white">1</div>
                    <div className="w-0.5 h-7 bg-slate-800" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">System Design & Cloud</h5>
                    <p className="text-[10px] text-slate-400">AWS / GCP architectural design methodologies</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-5 w-5 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-[10px] font-medium text-slate-400">2</div>
                    <div className="w-0.5 h-7 bg-slate-850" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400">Build Microservices Platform</h5>
                    <p className="text-[10px] text-slate-500">Deploy decoupled REST APIs using Docker containers</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-5 w-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-medium text-slate-600">3</div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-600">Senior Engineering Lead</h5>
                    <p className="text-[10px] text-slate-700">Team transition roadmap milestones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-14 border-t border-slate-900/60 mb-14 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[15px] font-semibold text-cyan-400 uppercase tracking-widest block mb-2">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-3xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-300 text-[15px] font-light">
              Get customized, agentic career recommendations in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-6 hover:border-slate-700/60 transition-all duration-300">
              <div className="text-xs font-bold text-indigo-400 bg-indigo-500/10 h-8 w-8 rounded-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-2">Upload Profile</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                Paste your resume text, outline your experience, long-term goals, and professional interests into our secure workspace.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-6 hover:border-slate-700/60 transition-all duration-300">
              <div className="text-xs font-bold text-cyan-400 bg-cyan-500/10 h-8 w-8 rounded-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-2">Agent Assessment</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                Our AI agents audit your credentials against industry criteria, parsing skill gaps, target roles, and calculating optimization scores.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-6 hover:border-slate-700/60 transition-all duration-300">
              <div className="text-xs font-bold text-purple-400 bg-purple-500/10 h-8 w-8 rounded-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-2">Accelerate Growth</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                Execute actionable suggestions, study the custom milestone roadmaps, and build recommended portfolio projects to advance.
              </p>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-14 border-t border-slate-900/60 mb-14">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest block mb-2">
              Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              AI Features Built for Growth
            </h2>
            <p className="text-slate-300 text-[15px] font-light">
              Explore our core agentic engines designed to elevate your professional trajectory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resume Analyzer */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-8 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Resume Intelligence</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
                  Audits your resume format and contents for ATS compatibility. Identifies missing industry keywords, scores compliance, and highlights strengths and weaknesses.
                </p>
              </div>
              <Link
                href="/dashboard/resume-analyzer"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 self-start transition-colors"
              >
                Analyze Your Resume
                <span>→</span>
              </Link>
            </div>

            {/* Career Recommendations */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-8 hover:border-cyan-500/30 hover:bg-slate-900/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Recommendation Engine</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
                  Audits your background parameters (skills, education, interests, experience) to recommend high-potential career pathways, custom portfolio project outlines, and actionable roadmaps.
                </p>
              </div>
              <Link
                href="/dashboard/career-recommendations"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start transition-colors"
              >
                Get Career Guidance
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Why CareerPilot AI Section */}
        <section className="py-14 border-t border-slate-900/60 mb-14">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest block mb-2">
              Value Proposition
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Why CareerPilot AI?
            </h2>
            <p className="text-slate-300 text-[15px] font-light">
              We stand apart by offering highly structured, real-time, actionable career intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition-all duration-300 space-y-2">
              <h4 className="text-sm font-bold text-white">ATS Compliance Optimization</h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Audits content formatting against tracking system requirements, helping your resume pass automated screening.
              </p>
            </div>

            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition-all duration-300 space-y-2">
              <h4 className="text-sm font-bold text-white">Structured Career Roadmaps</h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Breaks down long-term objectives into concrete timelines, showing exactly what skills to focus on at each step.
              </p>
            </div>

            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition-all duration-300 space-y-2">
              <h4 className="text-sm font-bold text-white">Targeted Portfolio Projects</h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Suggests concrete projects with specific technical stacks to help fill skill gaps and showcase expertise to recruiters.
              </p>
            </div>

            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition-all duration-300 space-y-2">
              <h4 className="text-sm font-bold text-white">Secure Session Controls</h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Features secure authentication and credentials management to safeguard all profile and evaluation assets.
              </p>
            </div>
          </div>
        </section>

        {/* Career Statistics (Insights) Section */}
        <section className="py-14 border-t border-slate-900/60 mb-14">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest block mb-2">
              Market Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Real-World Career Insights
            </h2>
            <p className="text-slate-300 text-[15px] font-light">
              Understand the common hurdles candidates face in automated hiring cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-6 text-center space-y-2">
              <span className="text-4xl font-extrabold text-white bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">85%</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-200">ATS Optimization Gaps</h4>
              <p className="text-xs sm:text-sm text-slate-350 font-light leading-relaxed">
                The majority of technology resumes submitted online fail initial automated screenings due to missing industry keywords.
              </p>
            </div>

            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-6 text-center space-y-2">
              <span className="text-4xl font-extrabold text-white bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">40+</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-200">Audited Tech Skills</h4>
              <p className="text-xs sm:text-sm text-slate-350 font-light leading-relaxed">
                Our parsing engines evaluate credentials against dozens of cloud, programming, and system design skills.
              </p>
            </div>

            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-6 text-center space-y-2">
              <span className="text-4xl font-extrabold text-white bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">&lt; 3s</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-200">Gemini Audit Latency</h4>
              <p className="text-xs sm:text-sm text-slate-350 font-light leading-relaxed">
                Experience near-instant feedback as our Gemini parser processes, scores, and structures improvement suggestions.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials (User Expectations) Section */}
        <section className="py-14 border-t border-slate-900/60 mb-14">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest block mb-2">
              Candidate Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              What Candidates Can Expect
            </h2>
            <p className="text-slate-300 text-[15px] font-light">
              Discover how our platform supports developers transitioning into senior or cloud roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-xl relative">
              <span className="text-4xl text-slate-800 absolute -top-4 left-4 font-serif">“</span>
              <p className="text-sm text-slate-300 font-light leading-relaxed mb-4 relative z-10">
                The resume analyzer parsed my background and flagged that I had no cloud certifications listed despite mentioning AWS deployments. Once I added them, my callback rate noticeably improved.
              </p>
              <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Full-Stack Engineer</span>
                <span className="text-xs text-slate-400">Verified Expectation</span>
              </div>
            </div>

            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-xl relative">
              <span className="text-4xl text-slate-800 absolute -top-4 left-4 font-serif">“</span>
              <p className="text-sm text-slate-300 font-light leading-relaxed mb-4 relative z-10">
                The recommendation engine designed a custom three-stage roadmap mapping my path to Software Architect. The project suggestions gave me specific architectural configurations to study.
              </p>
              <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Senior Backend Specialist</span>
                <span className="text-xs text-slate-400">Verified Expectation</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-14 border-t border-slate-900/60 mb-14">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest block mb-2">
              Help Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Common Questions
            </h2>
            <p className="text-slate-300 text-[15px] font-light">
              Quick answers about AI models, privacy, and account setup.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="border-b border-slate-900 pb-4">
              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">How does the AI Resume Analyzer audit content?</h4>
              <p className="text-sm text-slate-350 font-light leading-relaxed">
                It maps pasted resume text against structured schemas matching technical roles to detect lacking cloud, database, or engineering keywords.
              </p>
            </div>

            <div className="border-b border-slate-900 pb-4">
              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">Is my career data secure?</h4>
              <p className="text-sm text-slate-355 font-light leading-relaxed">
                Yes. CareerPilot AI uses secure sessions via Better Auth. Your evaluations and profile credentials are stored in private databases.
              </p>
            </div>

            <div className="pb-4">
              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">Can I access these tools for free?</h4>
              <p className="text-sm text-slate-355 font-light leading-relaxed">
                Yes! By signing in or clicking the Demo Login button, you can immediately access the Resume Analyzer and Recommendation features.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-cyan-950/20 border border-slate-800/80 rounded-2xl p-10 md:p-16 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
            <div className="absolute -top-[100px] left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-500 blur-[80px]" />
            <div className="absolute -bottom-[100px] right-1/3 w-[200px] h-[200px] rounded-full bg-cyan-500 blur-[80px]" />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to take control of your career journey?
            </h2>
            <p className="text-sm text-slate-455 max-w-md mx-auto font-light leading-relaxed">
              Sign up today and let CareerPilot AI audit your credentials, optimize your resume, and map your path to success.
            </p>
            <div className="pt-4">
              <Link
                href={session ? "/dashboard" : "/register"}
                className="inline-flex h-12 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-[0.98] transition-all justify-center items-center gap-1.5 cursor-pointer"
              >
                Get Started Now
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden opacity-50 z-0">
        <div className="absolute -top-[250px] left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -top-[200px] right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800/40 bg-neutral-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              CareerPilot AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#solutions" className="hover:text-white transition-colors">
              Solutions
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold hover:text-white transition-colors px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 cursor-pointer">
              Sign In
            </button>
            <button className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 px-4 py-2 rounded-full cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 relative z-10 w-full">
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto mb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-6 shadow-sm shadow-indigo-500/5">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            Next-Gen Agentic AI Career Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Navigate Your Career with{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Agentic Intelligence
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed">
            CareerPilot AI leverages autonomous AI agents to optimize your resume, prepare you for interviews, match you with opportunities, and track your career growth in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="h-12 px-8 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2 cursor-pointer">
              Launch Copilot
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
            <button className="h-12 px-8 rounded-full border border-neutral-800 bg-neutral-900/40 text-neutral-300 font-semibold hover:bg-neutral-900 hover:text-white transition-all cursor-pointer">
              Watch Demo
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-12 border-t border-neutral-900">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Agentic Features Built for Growth
            </h2>
            <p className="text-neutral-400">
              Autonomous workflows designed to give you an unfair advantage in the job market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/20 hover:bg-neutral-900/40 transition-all hover:-translate-y-1 duration-300 group">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
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
              <h3 className="text-lg font-bold text-white mb-2">Resume Intelligence</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Analyze and optimize your resume for targeted job descriptions using advanced AI-driven feedback and score analysis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/20 hover:bg-neutral-900/40 transition-all hover:-translate-y-1 duration-300 group">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Interactive Interviewing</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Practice with highly realistic, role-specific conversational AI agents. Receive feedback on content, structure, and tone.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/20 hover:bg-neutral-900/40 transition-all hover:-translate-y-1 duration-300 group">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.303.197l-1.591 1.591M21.75 12h-2.25m-.197 5.303l-1.591-1.591M12 21.75V19.5m-5.303-.197l1.591-1.591M2.25 12h2.25m.197-5.303l1.591 1.591"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Autonomous Discovery</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Deploy AI scouts to continuously comb the web for open positions matching your customized preference criteria.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 text-center text-sm text-neutral-500 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CareerPilot AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

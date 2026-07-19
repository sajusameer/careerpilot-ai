import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B1020] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-[150px] left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute -top-[100px] right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-600/15 blur-[120px]" />
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-3">
            About Us
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
            About CareerPilot AI
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto font-light leading-relaxed">
            CareerPilot AI is a state-of-the-art career auditing and recommendation ecosystem. We leverage autonomous AI agents to empower tech professionals worldwide.
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission Card */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              In a rapidly changing technology landscape, navigating professional growth can be overwhelming. Our mission is to democratize career planning by delivering advanced, ATS-compliant auditing mechanisms and tailored milestone roadmaps. By providing data-driven insight, we prepare candidates for their next strategic career transition.
            </p>
          </div>

          {/* Core Technology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Agentic Intelligence</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                We employ generative AI models to inspect resume text formats, check metadata tags, and calculate compatibility scores. This allows us to deliver high-fidelity evaluations without relying on generic templates.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Secure & Private</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                All profile, authentication, and session assets are secured using enterprise-grade authentication frameworks and MongoDB connections, ensuring your career telemetry data remains confidential.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-cyan-950/20 border border-slate-800/80 rounded-xl p-8 text-center">
            <h3 className="text-lg font-bold text-white mb-2">Ready to accelerate your professional growth?</h3>
            <p className="text-xs text-slate-400 mb-4 font-light">Explore career listings or create an account today to analyze your resume.</p>
            <Link
              href="/register"
              className="inline-flex h-10 px-6 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white font-semibold text-xs justify-center items-center cursor-pointer"
            >
              Join CareerPilot AI
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

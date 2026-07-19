import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(148,163,184,0.15)] bg-[#080D1C] py-16 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        {/* Brand Section */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 relative">
              <Image
                src="/careerpilot-logo.png"
                alt="CareerPilot AI Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">CareerPilot AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            AI-powered career guidance to help you analyze your skills, discover the right career paths, and build your future.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Quick Links</h4>
          <nav className="flex flex-col gap-2 text-[13px] font-light text-slate-350">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/careers" className="hover:text-white transition-colors">Explore Careers</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </nav>
        </div>

        {/* AI Tools */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">AI Copilots</h4>
          <nav className="flex flex-col gap-2 text-[13px] font-light text-slate-350">
            <Link href="/dashboard/resume-analyzer" className="hover:text-white transition-colors">Resume Analyzer</Link>
            <Link href="/dashboard/career-recommendations" className="hover:text-white transition-colors">Recommendations</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link>
          </nav>
        </div>

        {/* Support & Community */}
        <div className="md:col-span-3 space-y-4">
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Support</h4>
            <nav className="flex flex-col gap-2 text-[13px] font-light text-slate-350">
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </nav>
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Socials</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] text-slate-350 hover:text-white transition-colors flex items-center gap-1.5"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] text-slate-350 hover:text-white transition-colors flex items-center gap-1.5"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full pt-8 border-t border-slate-900 flex items-center justify-center">
        <p className="text-xs text-slate-400 font-light text-center">
          © {currentYear} CareerPilot AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

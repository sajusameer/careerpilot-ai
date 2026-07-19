"use client";

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does the AI Resume Analyzer calculate the ATS score?",
    answer: "The analyzer sends your raw resume text to Gemini Flash using structured auditing guidelines. It parses the content for specific tech keywords, layout completeness, action verbs, and structural coherence, comparing them with industry standards to calculate a score out of 100."
  },
  {
    question: "What information is required for Career Recommendations?",
    answer: "To generate highly personalized suggestions, we request details about your current skills, professional experience, education background, interests, and long-term career goals. The more detailed your inputs, the more customized the milestones and projects will be."
  },
  {
    question: "Is my resume and profile information kept private?",
    answer: "Yes. All authenticated data and session attributes are secured using Better Auth. MongoDB Atlas stores user profile details securely. We do not sell or share your resume text or profile details with third parties."
  },
  {
    question: "How do I update my profile details?",
    answer: "Once authenticated, click on 'Profile' in the navigation bar. You will be able to review your associated user ID, email address, registration timestamps, and configure your active career parameters."
  },
  {
    question: "Does CareerPilot AI support PDF/Word uploads?",
    answer: "Currently, our Resume Analyzer accepts raw pasted text to ensure fast, lightweight parsing and compatibility across all platforms. We recommend copying the text from your PDF or Word document directly into the workspace."
  }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1020] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-[150px] left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute -top-[100px] right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-600/15 blur-[120px]" />
      </div>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-3">
            FAQs
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto font-light leading-relaxed">
            Find quick answers to common queries about resume auditing, recommendations, privacy, and account settings.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="bg-slate-900/30 border border-slate-900 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-xs font-bold text-white hover:bg-slate-900/50 transition-colors"
                >
                  <span>{item.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-slate-400 transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48 border-t border-slate-950 px-6 py-4" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

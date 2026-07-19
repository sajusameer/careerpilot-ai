"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      router.push("/");
      await authClient.signOut();
      router.refresh();
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to sign out:", err);
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  // Dynamic Navigation Links
  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Careers", href: "/careers" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const authLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Explore Careers", href: "/careers" },
    { name: "Resume Analyzer", href: "/dashboard/resume-analyzer" },
    { name: "Career Recommendations", href: "/dashboard/career-recommendations" },
    { name: "Manage Items", href: "/items/manage" },
    { name: "Profile", href: "/profile" },
  ];

  const links = session ? authLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(148,163,184,0.15)] bg-[#0B1020]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 relative group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/careerpilot-logo.png"
                alt="CareerPilot AI Logo"
                fill
                priority
                sizes="40px"
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              CareerPilot AI
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors relative py-1 ${
                isActive(link.href) ? "text-indigo-400 font-semibold" : "text-slate-450 hover:text-white"
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full animate-fadeIn" />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isPending ? (
            <span className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          ) : session ? (
            <>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-sm font-semibold text-white bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 px-4 py-2 rounded-full cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isLoggingOut && (
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-705 active:bg-indigo-800 transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 px-4 py-2 rounded-full"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-white focus:outline-none cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-[rgba(148,163,184,0.15)] bg-[#0B1020] px-6 py-4 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`transition-colors py-1.5 ${
                  isActive(link.href) ? "text-indigo-400 font-semibold" : "text-slate-450 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[rgba(148,163,184,0.15)] flex flex-col gap-3">
            {isPending ? (
              <span className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin self-start" />
            ) : session ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-xs font-semibold text-center text-white bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 transition-all py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isLoggingOut && (
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-center text-slate-350 hover:text-white transition-colors py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-center text-white bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 transition-all py-2.5 rounded-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

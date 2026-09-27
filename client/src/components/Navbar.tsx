"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { GraduationCap, Users, Briefcase, Calendar, Award } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              AlumniTrack
            </span>
          </Link>
          <span className="hidden md:inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            İstanbul Üniversitesi
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/alumni" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors">
            <Users className="w-4 h-4" /> Mezunlar
          </Link>
          <Link href="/mentorship" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors">
            <Award className="w-4 h-4" /> Mentorluk
          </Link>
          <Link href="/jobs" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors">
            <Briefcase className="w-4 h-4" /> Kariyer & İlanlar
          </Link>
          <Link href="/events" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors">
            <Calendar className="w-4 h-4" /> Etkinlikler
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    </header>
  );
}

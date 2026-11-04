'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, LayoutDashboard, BookOpen } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-cream-50 border border-sand-border rounded-3xl p-8 shadow-xl text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-4">
          <Compass className="w-7 h-7" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-sand-200 px-2.5 py-1 rounded-full mb-2">
          404 Error
        </span>

        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
          The page or course you are looking for does not exist, has been moved, or the link may be outdated.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 w-full">
          <Link
            href="/dashboard"
            className="w-full flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Go to Dashboard</span>
          </Link>

          <Link
            href="/courses"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-cream-200 border border-sand-border text-charcoal-700 font-bold text-xs shadow-2xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Browse Courses</span>
          </Link>
        </div>

        <div className="mt-4">
          <Link
            href="/"
            className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 underline inline-flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


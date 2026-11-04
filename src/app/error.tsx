'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, LayoutDashboard } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-cream-50 border border-sand-border rounded-3xl p-8 shadow-xl text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 bg-sand-200 px-2.5 py-1 rounded-full mb-2">
          Application Notice
        </span>

        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
          Something went wrong
        </h1>

        <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
          An unexpected error occurred while loading this view. Your saved courses and study progress are safe in local storage.
        </p>

        {error.message && (
          <div className="mt-4 p-3 rounded-xl bg-white border border-sand-border text-left w-full">
            <span className="text-[10px] font-mono text-charcoal-500 break-words block">
              {error.message}
            </span>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={() => reset()}
            className="w-full flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try again</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-cream-200 border border-sand-border text-charcoal-700 font-bold text-xs shadow-2xs transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="mt-4">
          <Link
            href="/"
            className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 underline inline-flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

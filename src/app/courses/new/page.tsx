'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { QuickPasteHero } from '@/components/courses/QuickPasteHero';
import { CourseForm } from '@/components/courses/CourseForm';

export default function NewCoursePage() {
  const [showManual, setShowManual] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top back navigation */}
      <div className="px-4 lg:px-8 py-4 border-b border-sand-border bg-cream-50 flex items-center justify-between">
        <Link
          href="/courses"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-charcoal-600 hover:text-charcoal-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to courses</span>
        </Link>
        {showManual && (
          <button
            onClick={() => setShowManual(false)}
            className="text-xs font-semibold text-forest-700 hover:text-forest-800 underline"
          >
            ← Switch to Quick Paste
          </button>
        )}
      </div>

      <div className="flex-1 pb-16">
        {showManual ? (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <CourseForm onCancel={() => setShowManual(false)} />
          </div>
        ) : (
          <div className="w-full">
            <QuickPasteHero onToggleManual={() => setShowManual(true)} />
          </div>
        )}
      </div>
    </div>
  );
}


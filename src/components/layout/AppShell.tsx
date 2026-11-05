'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { GlobalTimerBar } from './GlobalTimerBar';
import { useLearning } from '@/context/LearningContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { storageWarning } = useLearning();
  const isAuthOrLanding = pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/landing');
  const storageNotice = storageWarning ? (
    <div role="alert" className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:px-6">
      <strong className="font-bold">Storage warning:</strong> {storageWarning}
    </div>
  ) : null;

  if (isAuthOrLanding) {
    return <main className="min-h-screen bg-cream-100">{storageNotice}{children}</main>;
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col text-charcoal-800">
      {storageNotice}
      <div className="min-h-screen flex flex-col lg:flex-row flex-1">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Top Header */}
        <MobileHeader />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden pb-44 md:pb-28 lg:pb-12">
          {children}
        </main>

        {/* Persistent Study Timer Widget */}
        <GlobalTimerBar />
      </div>
    </div>
  );
}

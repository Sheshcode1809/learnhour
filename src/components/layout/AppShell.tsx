'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { GlobalTimerBar } from './GlobalTimerBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthOrLanding = pathname.startsWith('/auth') || pathname.startsWith('/landing');

  if (isAuthOrLanding) {
    return <main className="min-h-screen bg-cream-100">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row text-charcoal-800">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top Header */}
      <MobileHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-28 lg:pb-12">
        {children}
      </main>

      {/* Persistent Study Timer Widget */}
      <GlobalTimerBar />
    </div>
  );
}

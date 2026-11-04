'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { GlobalTimerBar } from './GlobalTimerBar';

export function AppShell({ children }: { children: React.ReactNode }) {
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


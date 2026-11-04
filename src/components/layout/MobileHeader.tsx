'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Menu,
  X,
  Calendar,
  BookOpen,
  Timer,
  Settings,
  Plus,
  Flame,
} from 'lucide-react';
import { useLearning } from '@/context/LearningContext';

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { courses, preferences, stats } = useLearning();

  const navItems = [
    { label: 'Today', href: '/', icon: Calendar },
    { label: 'My courses', href: '/courses', icon: BookOpen, badge: courses.length },
    { label: 'Sessions', href: '/sessions', icon: Timer },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-cream-50/95 backdrop-blur border-b border-sand-border px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center text-white">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-bold text-charcoal-800 text-base">Courseit</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-terracotta-50 text-terracotta-600 border border-terracotta-100 px-2 py-1 rounded-full text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-terracotta-500" />
            <span>{stats.currentStreak}d</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="p-1.5 rounded-lg border border-sand-border text-charcoal-700 bg-cream-100 hover:bg-cream-200"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Drawer */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-sand-border flex flex-col gap-3 pb-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            href="/courses/new"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-forest-600 text-white font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New course</span>
          </Link>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-cream-200 font-semibold text-forest-700'
                      : 'text-charcoal-700 hover:bg-cream-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-xs bg-cream-200 px-2 py-0.5 rounded-full text-charcoal-600 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-sand-border text-xs text-charcoal-500 flex justify-between px-1">
            <span>Signed in as {preferences.name}</span>
            <span>{preferences.tier}</span>
          </div>
        </div>
      )}
    </header>
  );
}


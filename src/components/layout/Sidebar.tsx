'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Globe,
  LogOut,
} from 'lucide-react';
import { useLearning } from '@/context/LearningContext';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { courses } = useLearning();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const navItems = [
    { label: 'My courses', href: '/courses', icon: BookOpen, badge: courses.length },
  ];

  const recentCourses = courses.slice(0, 5);
  const displayName = user?.name || (user ? 'Learner' : 'Learnhour');
  const displayEmail = user?.email || (user ? '' : 'Sign in');

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-sand-border bg-cream-50 h-screen sticky top-0 px-4 py-5 select-none overflow-y-auto">
      <div className="flex flex-col gap-6">
        {/* Brand / Logo */}
        <Link href="/courses" className="flex items-center gap-2.5 px-2 group">
          <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-charcoal-800 tracking-tight">Learnhour</span>
              <span className="text-[10px] font-semibold bg-terracotta-100 text-terracotta-600 px-1.5 py-0.5 rounded-full">
                1h/day
              </span>
            </div>
            <p className="text-[11px] text-charcoal-500 font-medium">Habit & course tracker</p>
          </div>
        </Link>

        {/* CTA Button: + New Course */}
        <Link
          href="/courses/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-medium text-sm transition-all shadow-sm shadow-forest-600/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New course</span>
        </Link>

        {/* Primary Navigation — ONLY My Courses tab */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cream-300/70 text-forest-700 font-semibold shadow-2xs'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-forest-600' : 'text-charcoal-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cream-200 text-charcoal-600">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* RECENTS Section */}
        {recentCourses.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t border-sand-border/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 px-3">
              Recents
            </span>
            <div className="flex flex-col gap-1">
              {recentCourses.map((c) => {
                const isActive = pathname === `/courses/${c.id}`;
                return (
                  <Link
                    key={c.id}
                    href={`/courses/${c.id}`}
                    title={c.title}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs truncate transition-colors ${
                      isActive
                        ? 'bg-cream-200 font-semibold text-forest-700'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200/50'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-forest-500 shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Link to public Landing Page */}
        <div className="pt-2 border-t border-sand-border/60">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-charcoal-500 hover:text-charcoal-800 hover:bg-cream-200/50 rounded-lg transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-forest-600" />
            <span>Landing Page</span>
          </Link>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-sand-border flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {user?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-sand-border"
            />
          ) : (
            <div suppressHydrationWarning className="w-8 h-8 rounded-full bg-forest-700 text-white font-semibold text-xs flex items-center justify-center shrink-0">
              {displayName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span suppressHydrationWarning className="text-xs font-semibold text-charcoal-800 truncate">{displayName}</span>
            <span suppressHydrationWarning className="text-[10px] text-charcoal-500 font-medium truncate">{displayEmail}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {user ? (
            <button onClick={handleLogout} title="Sign out" aria-label="Sign out" className="text-charcoal-400 hover:text-charcoal-700 p-1">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link href="/auth/login" title="Sign in" className="text-charcoal-400 hover:text-charcoal-700 p-1">
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

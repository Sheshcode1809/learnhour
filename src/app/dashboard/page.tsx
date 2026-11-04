'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLearning } from '@/context/LearningContext';
import { calculateCourseProgress, formatDuration } from '@/lib/calculations/progress';
import { formatDateTimeInTimezone } from '@/lib/calculations/streaks';
import {
  Flame,
  Clock,
  Play,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Plus,
  BookOpen,
  Sparkles,
  Timer,
  ChevronRight,
  Check,
} from 'lucide-react';

export default function DashboardPage() {
  const { courses, sessions, preferences, stats, lastActiveCourse, startTimer } = useLearning();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getGreeting = () => {
    const hours = now.getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const dailyGoal = preferences.daily_goal_minutes || 60;
  const goalPercent = Math.min(100, Math.round((stats.todayMinutes / dailyGoal) * 100));

  const activeCourses = courses.filter((c) => c.status === 'active');
  const primaryCourse = lastActiveCourse || activeCourses[0];
  const primaryProgress = primaryCourse
    ? calculateCourseProgress(primaryCourse.total_minutes, primaryCourse.completed_minutes)
    : null;

  const nextLesson = primaryCourse?.lessons?.find((l) => !l.is_completed) || primaryCourse?.lessons?.[0];
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Welcome Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-5 border-b border-sand-border bg-cream-50/80 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
            {dateFormatted}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight mt-0.5">
            {getGreeting()}, {preferences.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => startTimer(primaryCourse?.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sand-200 hover:bg-cream-200 border border-sand-border text-charcoal-800 font-bold text-xs shadow-2xs transition-all active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5 text-forest-700 fill-current" />
            <span>Quick Timer</span>
          </button>
          <Link
            href="/courses/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-bold text-xs shadow-sm shadow-forest-800/10 transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New course</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 flex flex-col gap-6 min-w-0">
        {/* Continue Learning Card (Placed at the Top of Content for Immediate Focus) */}
        {primaryCourse && primaryProgress ? (
          <div className="bg-white border border-sand-border rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 relative overflow-hidden group">
            {/* Ambient accent stripe on left */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-forest-600" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0 flex-1">
              {/* Thumbnail / Icon Frame */}
              <div className="w-full sm:w-44 aspect-video rounded-2xl overflow-hidden bg-sand-200 shrink-0 border border-sand-border/80 shadow-2xs relative group-hover:scale-[1.01] transition-transform">
                {primaryCourse.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={primaryCourse.thumbnail_url}
                    alt={primaryCourse.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-sand-100">
                    <BookOpen className="w-6 h-6 text-forest-700 mb-1" />
                    <span className="text-[10px] font-bold text-charcoal-700 line-clamp-1">
                      {primaryCourse.title}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold bg-charcoal-900/85 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {primaryCourse.provider}
                  </span>
                </div>
              </div>

              {/* Course & Next Lesson Info */}
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
                    Current Focus
                  </span>
                  <span className="text-xs text-charcoal-400 font-medium">•</span>
                  <span className="text-xs text-charcoal-500 font-medium">
                    {primaryProgress.formattedRemaining} left
                  </span>
                </div>

                <Link
                  href={`/courses/${primaryCourse.id}`}
                  className="text-lg sm:text-xl font-black text-charcoal-900 hover:text-forest-700 transition-colors line-clamp-1"
                  title={primaryCourse.title}
                >
                  {primaryCourse.title}
                </Link>

                {nextLesson && (
                  <p className="text-xs text-charcoal-600 line-clamp-1 flex items-center gap-1.5">
                    <span className="font-semibold text-charcoal-800">Next:</span>
                    <span>{nextLesson.title}</span>
                    <span className="text-charcoal-400 font-mono text-[11px]">({nextLesson.duration_minutes}m)</span>
                  </p>
                )}

                {/* Progress Bar & Badges */}
                <div className="w-full max-w-md flex flex-col gap-1 mt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-charcoal-600">
                    <span>{primaryProgress.percentage}% complete</span>
                    <span>{primaryCourse.lessons.filter((l) => l.is_completed).length} / {primaryCourse.lessons.length} lessons</span>
                  </div>
                  <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-forest-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${primaryProgress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Actions */}
            <div className="flex sm:flex-row lg:flex-col items-stretch sm:items-center gap-2.5 shrink-0">
              <Link
                href={`/courses/${primaryCourse.id}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Lesson</span>
              </Link>
              <button
                onClick={() => startTimer(primaryCourse.id, nextLesson?.id)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sand-200 hover:bg-cream-200 text-charcoal-800 font-bold text-xs border border-sand-border transition-all active:scale-[0.98]"
              >
                <Clock className="w-3.5 h-3.5 text-forest-700" />
                <span>Start Focus Timer</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-sand-border rounded-3xl p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-charcoal-900">Welcome to your daily learning space</h2>
            <p className="text-xs text-charcoal-500 mt-1 max-w-sm">
              Add your first tutorial or pick a curated masterclass to start building your 1-hour/day habit.
            </p>
            <Link
              href="/courses/new"
              className="mt-4 px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Paste Tutorial or Pick Masterclass →
            </Link>
          </div>
        )}

        {/* Three Core Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* 1. Daily Study Goal Card (5 cols) */}
          <div className="md:col-span-5 bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-sand-border/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-charcoal-900">Today&apos;s Goal</h3>
                    <p className="text-[11px] text-charcoal-500">Target: {dailyGoal} mins</p>
                  </div>
                </div>
                {stats.todayGoalMet ? (
                  <span className="text-[10px] font-bold text-forest-800 bg-forest-100 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" /> Goal Achieved!
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-charcoal-700 bg-sand-200 px-2.5 py-1 rounded-full">
                    {stats.remainingMinutesToday}m remaining
                  </span>
                )}
              </div>

              {/* Progress Numbers */}
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-charcoal-900 font-mono tracking-tight">
                  {stats.todayMinutes}
                </span>
                <span className="text-sm font-semibold text-charcoal-400 font-mono">/ {dailyGoal} mins</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-cream-200 h-3 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stats.todayGoalMet ? 'bg-forest-600' : 'bg-forest-500'
                  }`}
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-sand-border/70 flex items-center justify-between">
              <span className="text-xs text-charcoal-500 font-medium">
                {stats.todayGoalMet ? 'Habit locked in for today!' : 'A focused hour changes everything.'}
              </span>
              <button
                onClick={() => startTimer(primaryCourse?.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-xs transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start</span>
              </button>
            </div>
          </div>

          {/* 2. Streak Card (3 cols) */}
          <div className="md:col-span-3 bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-terracotta-500" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-charcoal-900">Learning Streak</h3>
                  <p className="text-[11px] text-charcoal-500">Consecutive days</p>
                </div>
              </div>
            </div>

            <div className="my-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-terracotta-600 font-mono tracking-tight">
                  {stats.currentStreak}
                </span>
                <span className="text-sm font-bold text-charcoal-700">days</span>
              </div>
              <div className="text-xs text-charcoal-500 mt-1">
                Personal best: <span className="font-bold text-charcoal-800 font-mono">{stats.bestStreak} days</span>
              </div>
            </div>

            <div className="pt-3 border-t border-sand-border/70 text-[11px] text-charcoal-600">
              {stats.todayGoalMet
                ? 'Streak safely preserved for today!'
                : `Study ${stats.remainingMinutesToday}m more to maintain streak.`}
            </div>
          </div>

          {/* 3. Interactive Weekly 7-Day Activity Chart (4 cols) */}
          <div className="md:col-span-4 bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border/70">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-forest-600" />
                <h3 className="text-xs font-bold text-charcoal-900">Weekly Activity</h3>
              </div>
              <span className="text-[11px] font-semibold text-charcoal-500">Last 7 days</span>
            </div>

            {/* Interactive Bars */}
            <div className="my-4 flex items-end justify-between gap-1.5 h-28 pt-4 relative">
              {stats.weeklyActivity.map((day) => {
                const heightPercent = Math.min(100, Math.round((day.minutes / dailyGoal) * 100));
                const isHovered = activeTooltip === day.date;

                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setActiveTooltip(day.date)}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onClick={() => setActiveTooltip(isHovered ? null : day.date)}
                  >
                    {/* Tooltip on hover/touch */}
                    {isHovered && (
                      <div className="absolute -top-10 z-20 bg-charcoal-900 text-white text-[10px] py-1 px-2 rounded-lg shadow-lg font-mono whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95">
                        {day.minutes}m {day.goalMet ? '✓' : ''}
                      </div>
                    )}

                    <span className="text-[10px] font-mono text-charcoal-400 group-hover:text-charcoal-800 transition-colors">
                      {day.minutes > 0 ? `${day.minutes}m` : ''}
                    </span>
                    <div className="w-full bg-cream-200 rounded-lg overflow-hidden flex flex-col justify-end h-16 group-hover:bg-cream-300 transition-colors">
                      <div
                        className={`w-full rounded-lg transition-all duration-300 ${
                          day.goalMet
                            ? 'bg-forest-600'
                            : day.minutes > 0
                            ? 'bg-forest-400'
                            : 'bg-transparent'
                        }`}
                        style={{ height: `${Math.max(day.minutes > 0 ? 15 : 0, heightPercent)}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-semibold ${day.isToday ? 'text-forest-700 font-bold' : 'text-charcoal-500'}`}>
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-sand-border/70 text-[11px] text-charcoal-500 flex justify-between">
              <span>Target: {dailyGoal}m/day</span>
              <span className="text-forest-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-forest-600" /> Goal Met
              </span>
            </div>
          </div>
        </div>

        {/* In-Progress Courses & Recent History Split Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* In-Progress Courses (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-sand-border">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-forest-700" />
                <h2 className="text-sm font-bold text-charcoal-900">Courses in Progress</h2>
              </div>
              <Link
                href="/courses"
                className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1"
              >
                <span>View all ({courses.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeCourses.slice(0, 4).map((course) => {
                  const prog = calculateCourseProgress(course.total_minutes, course.completed_minutes);

                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="bg-white border border-sand-border rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group active:scale-[0.99]"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-charcoal-500 mb-1.5">
                          <span className="font-semibold text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
                            {course.provider}
                          </span>
                          <span className="font-mono text-charcoal-400">{prog.formattedRemaining} left</span>
                        </div>
                        <h3 className="text-sm font-bold text-charcoal-900 group-hover:text-forest-700 line-clamp-1" title={course.title}>
                          {course.title}
                        </h3>
                      </div>

                      <div className="mt-4 pt-3 border-t border-sand-border/70 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-charcoal-700 font-mono">{prog.percentage}%</span>
                          <span className="text-[11px] text-charcoal-400">~{course.daily_pace_minutes}m/day</span>
                        </div>
                        <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-forest-600 h-full rounded-full transition-all"
                            style={{ width: `${prog.percentage}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-sand-border rounded-2xl p-8 text-center text-xs text-charcoal-500">
                No active courses yet.
              </div>
            )}
          </div>

          {/* Recent Study Sessions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-sand-border">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-forest-700" />
                <h2 className="text-sm font-bold text-charcoal-900">Recent Sessions</h2>
              </div>
              <Link
                href="/sessions"
                className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1"
              >
                <span>All sessions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentSessions.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {recentSessions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white border border-sand-border rounded-2xl p-3.5 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-charcoal-900 truncate">
                          {s.course_title || 'General Focus Session'}
                        </span>
                        <span className="text-[10px] text-charcoal-400 font-mono">
                          {formatDateTimeInTimezone(s.started_at, preferences.timezone)}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-forest-800 bg-forest-50 px-2.5 py-1 rounded-full font-mono shrink-0">
                      {formatDuration(Math.floor(s.duration_seconds / 60))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-sand-border rounded-2xl p-6 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-cream-200 text-charcoal-500 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-forest-700" />
                </div>
                <p className="text-xs font-bold text-charcoal-800">No sessions logged yet today</p>
                <p className="text-[11px] text-charcoal-500 mt-0.5">
                  Start your focus timer to lock in your streak.
                </p>
                <button
                  onClick={() => startTimer(primaryCourse?.id)}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-2xs"
                >
                  Start First Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

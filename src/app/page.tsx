'use client';

import React from 'react';
import Link from 'next/link';
import { useLearning } from '@/context/LearningContext';
import { calculateCourseProgress, formatDuration } from '@/lib/calculations/progress';
import { ScenicBanner } from '@/components/courses/ScenicBanner';
import {
  Flame,
  Clock,
  Play,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { courses, preferences, stats, lastActiveCourse, startTimer } = useLearning();

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Welcome Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-5 border-b border-sand-border bg-cream-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="text-xs text-charcoal-500 font-medium">{dateFormatted}</div>
          <h1 className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight">
            {getGreeting()}, {preferences.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/courses/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New course</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Scenic Illustration Banner with Habit Prompt */}
        <div className="relative">
          <ScenicBanner height="h-44 sm:h-52" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pointer-events-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full w-max shadow-2xs mb-1.5">
              Habit Rule
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 drop-shadow-xs">
              One focused hour a day. Steady mastery.
            </h2>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Daily Goal Card (5 cols) */}
          <div className="md:col-span-5 bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-sand-border/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-charcoal-900">Today&apos;s Goal</h3>
                    <p className="text-[11px] text-charcoal-500">Target: {dailyGoal} mins</p>
                  </div>
                </div>
                {stats.todayGoalMet ? (
                  <span className="text-[10px] font-bold text-forest-700 bg-forest-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Goal Met!
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-charcoal-600 bg-cream-200 px-2.5 py-1 rounded-full">
                    {stats.remainingMinutesToday}m remaining
                  </span>
                )}
              </div>

              {/* Progress Numbers */}
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-charcoal-900 font-mono tracking-tight">
                  {stats.todayMinutes}
                </span>
                <span className="text-sm font-semibold text-charcoal-400">/ {dailyGoal} mins</span>
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
                {stats.todayGoalMet ? 'Great work today!' : 'Keep going! A little every day.'}
              </span>
              <button
                onClick={() => startTimer(primaryCourse?.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 text-forest-800 hover:bg-forest-100 font-bold text-xs transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start Timer</span>
              </button>
            </div>
          </div>

          {/* Streak Card (3 cols) */}
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
                <span className="text-4xl sm:text-5xl font-black text-terracotta-600 font-mono">
                  {stats.currentStreak}
                </span>
                <span className="text-sm font-bold text-charcoal-700">days</span>
              </div>
              <div className="text-xs text-charcoal-500 mt-1">
                Best streak: <span className="font-bold text-charcoal-800">{stats.bestStreak} days</span>
              </div>
            </div>

            <div className="pt-3 border-t border-sand-border/70 text-[11px] text-charcoal-600">
              {stats.todayGoalMet
                ? 'Streak safely preserved for today!'
                : `Study ${stats.remainingMinutesToday}m more to maintain streak.`}
            </div>
          </div>

          {/* Weekly 7-Day Activity Chart (4 cols) */}
          <div className="md:col-span-4 bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border/70">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-forest-600" />
                <h3 className="text-xs font-bold text-charcoal-900">Weekly Activity</h3>
              </div>
              <span className="text-[11px] font-semibold text-charcoal-500">Last 7 days</span>
            </div>

            {/* Bars */}
            <div className="my-4 flex items-end justify-between gap-1.5 h-28 pt-4">
              {stats.weeklyActivity.map((day) => {
                const heightPercent = Math.min(100, Math.round((day.minutes / dailyGoal) * 100));

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-charcoal-400 group-hover:text-charcoal-800 transition-colors">
                      {day.minutes > 0 ? `${day.minutes}m` : ''}
                    </span>
                    <div className="w-full bg-cream-200 rounded-lg overflow-hidden flex flex-col justify-end h-16">
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
              <span>Goal: {dailyGoal}m/day</span>
              <span className="text-forest-700 font-semibold">Green = Goal Met</span>
            </div>
          </div>
        </div>

        {/* Continue Learning Card (Matches reference video!) */}
        {primaryCourse && primaryProgress && (
          <div className="bg-sand-100 border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
              <div className="w-full sm:w-48 aspect-video rounded-2xl overflow-hidden bg-cream-200 shrink-0 border border-sand-border shadow-2xs relative">
                {primaryCourse.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={primaryCourse.thumbnail_url}
                    alt={primaryCourse.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal-400 text-xs font-semibold">
                    Course Preview
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold bg-charcoal-900/80 text-white px-2 py-0.5 rounded">
                    {primaryCourse.provider}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wider">
                  Continue Learning
                </span>
                <Link
                  href={`/courses/${primaryCourse.id}`}
                  className="text-base sm:text-lg font-bold text-charcoal-900 hover:text-forest-700 line-clamp-1"
                >
                  {primaryCourse.title}
                </Link>

                <div className="flex items-center gap-3 text-xs text-charcoal-600 mt-1">
                  <span>{primaryProgress.percentage}% complete</span>
                  <span>•</span>
                  <span>{primaryProgress.formattedRemaining} remaining</span>
                  <span>•</span>
                  <span>{primaryCourse.lessons.length} lessons</span>
                </div>

                <div className="w-full max-w-md bg-cream-300/80 h-2 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="bg-forest-600 h-full rounded-full transition-all"
                    style={{ width: `${primaryProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <Link
              href={`/courses/${primaryCourse.id}`}
              className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Course</span>
            </Link>
          </div>
        )}

        {/* Active Courses Section */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between pb-2 border-b border-sand-border">
            <h2 className="text-base font-bold text-charcoal-900">In-Progress Courses</h2>
            <Link
              href="/courses"
              className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1"
            >
              <span>View all courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeCourses.slice(0, 3).map((course) => {
                const prog = calculateCourseProgress(course.total_minutes, course.completed_minutes);

                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="bg-white border border-sand-border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-charcoal-500 mb-1.5">
                        <span className="font-semibold text-forest-700">{course.provider}</span>
                        <span>{prog.formattedRemaining} left</span>
                      </div>
                      <h3 className="text-sm font-bold text-charcoal-900 group-hover:text-forest-700 line-clamp-1">
                        {course.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-sand-border/70 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-charcoal-700">{prog.percentage}%</span>
                        <span className="text-[11px] text-charcoal-400">~{course.daily_pace_minutes}m/day</span>
                      </div>
                      <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
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
              No active courses yet. Click &quot;New course&quot; above to add your first course.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

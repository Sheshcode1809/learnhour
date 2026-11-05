'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Pause, Square, RotateCcw, Clock, BookOpen, Check, X } from 'lucide-react';
import { useLearning } from '@/context/LearningContext';
import { formatSeconds } from '@/lib/calculations/progress';
import confetti from 'canvas-confetti';

export function GlobalTimerBar() {
  const pathname = usePathname();
  const {
    activeTimer,
    elapsedSeconds,
    timerNotice,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    finishTimer,
    courses,
    stats,
    preferences,
  } = useLearning();

  const [isFinishing, setIsFinishing] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [finishError, setFinishError] = useState('');

  const activeCourse = courses.find((c) => c.id === activeTimer.course_id);
  const isTimerVisible = activeTimer.is_running || elapsedSeconds > 0;

  const handleFinishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFinishError('');
    try {
      finishTimer(sessionNotes);
      setIsFinishing(false);
      setSessionNotes('');
    } catch {
      setFinishError('Could not save this session. The timer is still available; check the storage warning and try again.');
      return;
    }

    // Trigger celebratory confetti if completing or exceeding daily goal!
    const goal = preferences.daily_goal_minutes || 60;
    if (stats.todayMinutes + Math.floor(elapsedSeconds / 60) >= goal) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#2D5A27', '#C85A32', '#F5F2EB'],
        });
      } catch {
        // graceful ignore
      }
    }
  };

  // On the dedicated Sessions page, avoid showing a second Quick Timer launcher
  if (pathname === '/sessions' && !isTimerVisible && !isFinishing) {
    return null;
  }

  // The dashboard already contains inline timer actions; avoid covering its summary cards.
  if (pathname === '/dashboard' && !isTimerVisible && !isFinishing) {
    return null;
  }

  if (!isTimerVisible && !isFinishing) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-30 pointer-events-auto">
        <button
          onClick={() => startTimer()}
          title="Start Study Timer"
          aria-label="Start Quick Timer"
          className="flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white py-2.5 px-4 rounded-full shadow-lg shadow-forest-800/20 text-xs font-semibold transition-transform hover:scale-105 active:scale-95 border border-forest-500/30"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Quick Timer</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-6 md:w-96 z-30 bg-charcoal-900 text-cream-100 rounded-2xl shadow-xl border border-charcoal-700 p-3 sm:p-3.5 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              activeTimer.is_running
                ? 'bg-forest-600/30 text-emerald-400 border border-emerald-500/40 animate-pulse'
                : 'bg-sand-200/10 text-cream-300 border border-cream-200/20'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base text-white tracking-wide">
                {formatSeconds(elapsedSeconds)}
              </span>
              {activeTimer.is_running ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  Focusing
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                  Paused
                </span>
              )}
            </div>
            {activeCourse ? (
              <Link
                href={`/courses/${activeCourse.id}`}
                className="text-xs text-cream-300 hover:text-white truncate flex items-center gap-1"
                title={activeCourse.title}
              >
                <BookOpen className="w-3 h-3 shrink-0" />
                <span className="truncate">{activeCourse.title}</span>
              </Link>
            ) : (
              <span className="text-xs text-cream-400">General study time</span>
            )}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {activeTimer.is_running ? (
            <button
              onClick={pauseTimer}
              title="Pause Timer"
              aria-label="Pause timer"
              className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={resumeTimer}
              title="Resume Timer"
              aria-label="Resume timer"
              className="p-2 rounded-xl bg-forest-600 hover:bg-forest-500 text-white transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            onClick={() => setIsFinishing(true)}
            title="Finish & Save Session"
            aria-label="Finish and save session"
            className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={resetTimer}
            title="Reset Timer"
            aria-label="Reset timer"
            className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
        </div>
        {timerNotice && <p role="alert" className="text-[11px] leading-relaxed text-amber-200 border-t border-charcoal-700 pt-2">{timerNotice}</p>}
      </div>

      {/* Finish Session Notes Modal */}
      {isFinishing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-cream-50 border border-sand-border rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 text-base">Save Study Session</h3>
                  <p className="text-xs text-charcoal-500">
                    Logged duration: <span className="font-semibold">{formatSeconds(elapsedSeconds)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setIsFinishing(false); setFinishError(''); }}
                aria-label="Close save session dialog"
                className="p-1 rounded-lg hover:bg-cream-200 text-charcoal-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFinishSubmit} className="mt-4 flex flex-col gap-3">
              {finishError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{finishError}</p>}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Course
                </label>
                <div className="text-xs bg-cream-200/80 border border-sand-border rounded-lg px-3 py-2 text-charcoal-800">
                  {activeCourse ? activeCourse.title : 'General Study'}
                </div>
              </div>

              <div>
                <label htmlFor="sessionNotes" className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Notes & Takeaways (optional)
                </label>
                <textarea
                  id="sessionNotes"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="What concepts did you master or practice today?"
                  rows={3}
                  className="w-full text-xs bg-white border border-sand-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFinishing(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-charcoal-600 hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save session</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


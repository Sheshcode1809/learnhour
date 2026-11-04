'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLearning } from '@/context/LearningContext';
import { LearningSession } from '@/types';
import { formatSeconds, formatDuration } from '@/lib/calculations/progress';
import { formatDateTimeInTimezone } from '@/lib/calculations/streaks';
import {
  Timer,
  Play,
  Pause,
  Square,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Clock,
  X,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SessionsPage() {
  const {
    sessions,
    courses,
    preferences,
    activeTimer,
    elapsedSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    finishTimer,
    addSession,
    updateSession,
    deleteSession,
    stats,
  } = useLearning();

  // Manual Session Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCourseId, setManualCourseId] = useState('');
  const [manualMinutes, setManualMinutes] = useState('45');
  const [manualDateTime, setManualDateTime] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualError, setManualError] = useState('');

  // Edit Session Modal State
  const [editingSession, setEditingSession] = useState<LearningSession | null>(null);
  const [editCourseId, setEditCourseId] = useState('');
  const [editMinutes, setEditMinutes] = useState('');
  const [editDateTime, setEditDateTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editError, setEditError] = useState('');

  // Course selector for active timer
  const [selectedCourseForTimer, setSelectedCourseForTimer] = useState(activeTimer.course_id || '');

  // Session table filter
  const [filterCourseId, setFilterCourseId] = useState('all');

  const filteredSessions = sessions.filter((s) => {
    if (filterCourseId !== 'all') {
      return s.course_id === filterCourseId;
    }
    return true;
  });

  const totalSessionSeconds = filteredSessions.reduce((acc, s) => acc + s.duration_seconds, 0);

  const getNowLocalDateTime = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const handleOpenManualModal = () => {
    setManualDateTime(getNowLocalDateTime());
    setManualMinutes('45');
    setManualNotes('');
    setManualCourseId('');
    setManualError('');
    setShowManualModal(true);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    const minutes = parseInt(manualMinutes, 10);
    if (isNaN(minutes) || minutes <= 0) {
      setManualError('Duration must be greater than 0 minutes.');
      return;
    }

    const sessionDate = manualDateTime ? new Date(manualDateTime) : new Date();
    if (isNaN(sessionDate.getTime())) {
      setManualError('Please provide a valid study date and time.');
      return;
    }

    const startedAt = sessionDate.toISOString();
    const endedAt = new Date(sessionDate.getTime() + minutes * 60 * 1000).toISOString();

    addSession({
      course_id: manualCourseId || null,
      duration_seconds: minutes * 60,
      started_at: startedAt,
      ended_at: endedAt,
      notes: manualNotes.trim() || undefined,
    });

    // Confetti based on configured daily goal (Requirement 6)
    const dailyTarget = preferences.daily_goal_minutes || 60;
    if (stats.todayMinutes + minutes >= dailyTarget) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 }, colors: ['#2D5A27', '#C85A32', '#FAF8F5'] });
      } catch {}
    }

    setShowManualModal(false);
  };

  const handleOpenEdit = (session: LearningSession) => {
    setEditingSession(session);
    setEditCourseId(session.course_id || '');
    setEditMinutes(Math.max(1, Math.floor(session.duration_seconds / 60)).toString());
    const d = new Date(session.started_at);
    if (!isNaN(d.getTime())) {
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setEditDateTime(d.toISOString().slice(0, 16));
    } else {
      setEditDateTime(getNowLocalDateTime());
    }
    setEditNotes(session.notes || '');
    setEditError('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    setEditError('');

    const minutes = parseInt(editMinutes, 10);
    if (isNaN(minutes) || minutes <= 0) {
      setEditError('Duration must be greater than 0 minutes.');
      return;
    }

    const sessionDate = editDateTime ? new Date(editDateTime) : new Date(editingSession.started_at);
    if (isNaN(sessionDate.getTime())) {
      setEditError('Please provide a valid study date and time.');
      return;
    }

    const startedAt = sessionDate.toISOString();
    const endedAt = new Date(sessionDate.getTime() + minutes * 60 * 1000).toISOString();
    const course = editCourseId ? courses.find((c) => c.id === editCourseId) : null;

    updateSession({
      ...editingSession,
      course_id: editCourseId || null,
      course_title: course?.title || (editCourseId ? editingSession.course_title : 'General Study'),
      duration_seconds: minutes * 60,
      started_at: startedAt,
      ended_at: endedAt,
      notes: editNotes.trim() || undefined,
    });

    setEditingSession(null);
  };

  const handleStartTimer = () => {
    startTimer(selectedCourseForTimer || undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-sand-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Learning Sessions
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Focus with the study timer or log offline learning sessions to keep your streak alive. Timezone: <span className="font-semibold text-charcoal-700">{preferences.timezone}</span>.
          </p>
        </div>

        <button
          onClick={handleOpenManualModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Log manual session</span>
        </button>
      </div>

      {/* Main Focus Timer Card */}
      <div className="bg-white border border-sand-border rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center text-center max-w-xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            activeTimer.is_running ? 'bg-forest-100 text-forest-700 animate-pulse' : 'bg-cream-200 text-charcoal-600'
          }`}>
            <Timer className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600">
            {activeTimer.is_running ? 'Timer Running' : elapsedSeconds > 0 ? 'Timer Paused' : 'Study Timer'}
          </span>
        </div>

        {/* Big Stopwatch Display */}
        <div className="font-mono text-5xl sm:text-6xl font-black text-charcoal-900 tracking-tight my-4">
          {formatSeconds(elapsedSeconds)}
        </div>

        {/* Course Assignment for Timer */}
        <div className="w-full max-w-xs mb-6">
          <label className="block text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
            Link session to course:
          </label>
          <select
            value={selectedCourseForTimer}
            onChange={(e) => setSelectedCourseForTimer(e.target.value)}
            disabled={activeTimer.is_running}
            className="w-full text-xs font-semibold bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="">General Study (No specific course)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-3">
          {activeTimer.is_running ? (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-charcoal-800 hover:bg-charcoal-900 text-white font-bold text-sm shadow-sm transition-all"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          ) : elapsedSeconds > 0 ? (
            <button
              onClick={resumeTimer}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-sm transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={handleStartTimer}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-md shadow-forest-700/20 transition-all hover:scale-102"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Timer</span>
            </button>
          )}

          {elapsedSeconds > 0 && (
            <>
              <button
                onClick={() => finishTimer()}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Finish & Save</span>
              </button>

              <button
                onClick={resetTimer}
                title="Reset Timer"
                className="p-3 rounded-2xl border border-sand-border bg-cream-100 hover:bg-cream-200 text-charcoal-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sessions History Table */}
      <div className="bg-white border border-sand-border rounded-2xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-sand-border">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-charcoal-900">Session History</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cream-200 text-charcoal-700">
              {filteredSessions.length} sessions • {formatDuration(Math.floor(totalSessionSeconds / 60))}
            </span>
          </div>

          {/* Filter dropdown */}
          <select
            value={filterCourseId}
            onChange={(e) => setFilterCourseId(e.target.value)}
            className="text-xs font-medium bg-cream-50 border border-sand-border rounded-xl px-3 py-1.5 text-charcoal-800 focus:outline-none"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {filteredSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-sand-border text-charcoal-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Date & Time ({preferences.timezone})</th>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-border/60">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="py-3 px-3 text-charcoal-600 font-mono whitespace-nowrap">
                      {formatDateTimeInTimezone(session.started_at, preferences.timezone)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-charcoal-900">
                      {session.course_title || 'General Study'}
                    </td>
                    <td className="py-3 px-3 font-bold text-forest-800 whitespace-nowrap">
                      {formatDuration(Math.floor(session.duration_seconds / 60))}
                    </td>
                    <td className="py-3 px-3 text-charcoal-600 max-w-xs truncate">
                      {session.notes || '—'}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(session)}
                          title="Edit session"
                          className="p-1.5 rounded text-charcoal-500 hover:text-forest-700 hover:bg-forest-50 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSession(session.id)}
                          title="Delete session"
                          className="p-1.5 rounded text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4 flex flex-col items-center justify-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-cream-200 text-charcoal-500 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-forest-600" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900 mb-1">No study sessions logged yet</h4>
            <p className="text-xs text-charcoal-500 leading-relaxed mb-4">
              Focus time completed with the stopwatch above or added manually will appear in this history table.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenManualModal}
                className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                Log manual session
              </button>
              <button
                type="button"
                onClick={() => startTimer(selectedCourseForTimer || undefined)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-cream-100 border border-sand-border text-charcoal-800 font-bold text-xs shadow-2xs transition-all"
              >
                Start study timer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Log Manual Session Modal (supports date backdating) */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-sand-border rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-charcoal-900 text-base">Log Offline Study</h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Study Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={manualDateTime}
                  onChange={(e) => setManualDateTime(e.target.value)}
                  className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-800 font-mono focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Course
                </label>
                <select
                  value={manualCourseId}
                  onChange={(e) => setManualCourseId(e.target.value)}
                  className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                >
                  <option value="">General Self-Study</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(e.target.value)}
                  placeholder="e.g. 60"
                  className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="What topics or lessons were covered?"
                  className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl p-3 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {manualError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{manualError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand-border">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-forest-600 hover:bg-forest-700 text-white shadow-sm"
                >
                  Save session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Session Modal (Requirement 6) */}
      {editingSession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-sand-border rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-charcoal-900 text-base">Edit Learning Session</h3>
              </div>
              <button
                onClick={() => setEditingSession(null)}
                className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Study Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={editDateTime}
                  onChange={(e) => setEditDateTime(e.target.value)}
                  className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-800 font-mono focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Course
                </label>
                <select
                  value={editCourseId}
                  onChange={(e) => setEditCourseId(e.target.value)}
                  className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                >
                  <option value="">General Self-Study</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editMinutes}
                  onChange={(e) => setEditMinutes(e.target.value)}
                  className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl p-3 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {editError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand-border">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-forest-600 hover:bg-forest-700 text-white shadow-sm"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

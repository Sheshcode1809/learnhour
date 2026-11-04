'use client';

import React, { useState } from 'react';
import { useLearning } from '@/context/LearningContext';
import {
  Settings,
  Target,
  User,
  Download,
  RotateCcw,
  Cloud,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const { preferences, updatePreferences, exportData, resetAllData } = useLearning();

  const [name, setName] = useState(preferences.name);
  const [dailyGoal, setDailyGoal] = useState(preferences.daily_goal_minutes.toString());
  const [timezone, setTimezone] = useState(preferences.timezone);
  const [savedMessage, setSavedMessage] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedGoal = parseInt(dailyGoal, 10);
    updatePreferences({
      name: name.trim() || 'Learner',
      daily_goal_minutes: isNaN(parsedGoal) || parsedGoal <= 0 ? 60 : parsedGoal,
      timezone: timezone.trim() || 'Asia/Kolkata',
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courseit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    setName('Abhishek Singh');
    setDailyGoal('60');
    setTimezone('Asia/Kolkata');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="pb-4 border-b border-sand-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
          Customize your daily study habit target, time zone, and data backups.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Daily Study Goal */}
        <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-sand-border">
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-charcoal-900">Daily Study Target</h2>
              <p className="text-[11px] text-charcoal-500">
                The core habit target required to maintain your daily streak.
              </p>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[30, 45, 60, 90, 120].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDailyGoal(mins.toString())}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  dailyGoal === mins.toString()
                    ? 'bg-forest-600 text-white shadow-xs'
                    : 'bg-cream-100 border border-sand-border text-charcoal-700 hover:bg-cream-200'
                }`}
              >
                {mins} mins / day {mins === 60 ? '(Default)' : ''}
              </button>
            ))}
          </div>

          <div className="max-w-xs mt-1">
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Custom Target (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="600"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              className="w-full text-xs sm:text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600 font-semibold"
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-sand-border">
            <div className="w-8 h-8 rounded-xl bg-cream-200 text-charcoal-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-charcoal-900">Profile & Timezone</h2>
              <p className="text-[11px] text-charcoal-500">
                Used for streak calculation boundaries and greeting.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Learner Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs sm:text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Timezone (IANA format)
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="e.g. Asia/Kolkata or America/New_York"
                className="w-full text-xs sm:text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {savedMessage && (
              <span className="text-xs text-forest-700 font-bold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Preferences saved!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-forest-600 hover:bg-forest-700 text-white shadow-sm transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </form>

      {/* Cloud Sync & Architecture Status */}
      <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-sand-border">
          <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-charcoal-900">Storage & Cloud Sync</h2>
            <p className="text-[11px] text-charcoal-500">
              Local-first zero configuration repository active.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-cream-100 border border-sand-border text-xs text-charcoal-700 flex flex-col gap-1.5 leading-relaxed">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-charcoal-900">Local-First Storage Active</span>
          </div>
          <p>
            Your courses, lessons, and learning sessions are saved safely in your browser&apos;s persistent local storage. They persist across reloads and device sleep.
          </p>
          <p className="text-[11px] text-charcoal-500 pt-1">
            Supabase migrations are located at <code className="bg-cream-200 px-1 py-0.5 rounded font-mono">supabase/migrations/001_initial_schema.sql</code> with Row-Level Security (RLS) configured for multi-device sync.
          </p>
        </div>
      </div>

      {/* Data Backup & Reset */}
      <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-sand-border">
          <div className="w-8 h-8 rounded-xl bg-sand-200 text-charcoal-700 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-charcoal-900">Data Backup & Reset</h2>
            <p className="text-[11px] text-charcoal-500">
              Export your records or reset to original sample masterclasses.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <button
            onClick={handleExport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-sand-border bg-cream-50 hover:bg-cream-100 text-charcoal-800 font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4 text-forest-700" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Demo Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-sand-border rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Reset All Data?</h3>
            <p className="text-xs text-charcoal-600 mt-1">
              This will reset your courses, sessions, and daily goals back to the default sample masterclasses from the reference video.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yes, Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

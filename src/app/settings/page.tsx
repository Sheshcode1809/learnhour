'use client';

import React, { useState, useEffect } from 'react';
import { useLearning } from '@/context/LearningContext';
import { isValidTimezone } from '@/lib/calculations/streaks';
import {
  Settings,
  Target,
  User,
  Download,
  RotateCcw,
  Cloud,
  Check,
  AlertTriangle,
  AlertCircle,
  Globe,
  Database,
  ShieldCheck,
} from 'lucide-react';

export default function SettingsPage() {
  const { preferences, updatePreferences, exportData, resetAllData } = useLearning();

  const [name, setName] = useState(preferences.name);
  const [dailyGoal, setDailyGoal] = useState(preferences.daily_goal_minutes.toString());
  const [timezone, setTimezone] = useState(preferences.timezone);
  const [timezoneError, setTimezoneError] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [actionError, setActionError] = useState('');
  const [backupError, setBackupError] = useState('');
  const [resetError, setResetError] = useState('');

  useEffect(() => {
    setName(preferences.name);
    setDailyGoal(preferences.daily_goal_minutes.toString());
    setTimezone(preferences.timezone);
  }, [preferences.name, preferences.daily_goal_minutes, preferences.timezone]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setSavedMessage(false);
    setTimezoneError('');

    const trimmedTz = timezone.trim();
    if (!isValidTimezone(trimmedTz)) {
      setTimezoneError(`"${trimmedTz}" is not a recognized IANA timezone. Examples: Asia/Kolkata, America/New_York, Europe/London, UTC.`);
      return;
    }

    const parsedGoal = parseInt(dailyGoal, 10);
    try {
      updatePreferences({
        name: name.trim() || 'Learner',
        daily_goal_minutes: isNaN(parsedGoal) || parsedGoal <= 0 ? 60 : parsedGoal,
        timezone: trimmedTz,
      });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } catch {
      setActionError('Preferences were not saved. Check the storage warning and try again.');
    }
  };

  const handleExport = () => {
    setBackupError('');
    try {
      const jsonStr = exportData();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learnhour-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setBackupError('Could not export your data from browser storage.');
    }
  };

  const handleReset = () => {
    setResetError('');
    try {
      resetAllData();
      setShowResetConfirm(false);
      setName('Learner');
      setDailyGoal('60');
      setTimezone('Asia/Kolkata');
      setTimezoneError('');
    } catch {
      setResetError('Data was not fully cleared. Check the storage warning before trying again.');
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 flex flex-col gap-6 min-w-0">
      {/* Page Header */}
      <div className="pb-4 border-b border-sand-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
          Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-2xl leading-relaxed">
          Configure your daily study habit goals, timezone boundaries for streaks, and manage local data backups.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Daily Study Goal Section */}
        <div className="bg-white border border-sand-border rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3.5 border-b border-sand-border">
            <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-charcoal-900">Daily Study Target</h2>
              <p className="text-[11px] text-charcoal-500">
                The minimum continuous learning time required each calendar day to maintain your streak.
              </p>
            </div>
          </div>

          {/* Quick Select Preset Pills */}
          <div>
            <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-2">
              Preset Durations
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyGoal(mins.toString())}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    dailyGoal === mins.toString()
                      ? 'bg-forest-600 text-white shadow-xs scale-102'
                      : 'bg-cream-100/80 border border-sand-border text-charcoal-700 hover:bg-cream-200/80'
                  }`}
                >
                  {mins}m / day {mins === 60 ? '(Recommended)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
              Custom Target (Minutes per day)
            </label>
            <div className="relative">
              <input
                type="number"
                min="15"
                max="600"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="w-full text-xs sm:text-sm font-mono bg-cream-50/70 border border-sand-border rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600/30 font-semibold"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-charcoal-400 font-mono">
                min
              </span>
            </div>
          </div>
        </div>

        {/* Profile & Timezone Section */}
        <div className="bg-white border border-sand-border rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3.5 border-b border-sand-border">
            <div className="w-9 h-9 rounded-xl bg-cream-200 text-charcoal-700 flex items-center justify-center">
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-charcoal-900">Profile & Timezone</h2>
              <p className="text-[11px] text-charcoal-500">
                Used to determine day transitions (midnight cutoff) and timestamp displays.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                Learner Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Learner"
                className="w-full text-xs sm:text-sm bg-cream-50/70 border border-sand-border rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                IANA Timezone *
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => {
                  setTimezone(e.target.value);
                  if (timezoneError) setTimezoneError('');
                }}
                placeholder="e.g. Asia/Kolkata or America/New_York"
                className="w-full text-xs sm:text-sm font-mono bg-cream-50/70 border border-sand-border rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600/30 font-medium"
              />
              {timezoneError ? (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{timezoneError}</span>
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-charcoal-400">Common:</span>
                  {['Asia/Kolkata', 'America/New_York', 'Europe/London', 'UTC'].map((tz) => (
                    <button
                      key={tz}
                      type="button"
                      onClick={() => setTimezone(tz)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cream-100 hover:bg-cream-200 text-charcoal-600 transition-colors"
                    >
                      {tz}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {actionError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{actionError}</p>}

        {/* Global Action Save Bar */}
        <div className="bg-white border border-sand-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-charcoal-600 font-medium text-center sm:text-left">
            Changes will take effect immediately across all sessions and dashboard habit meters.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            {savedMessage && (
              <span className="text-xs text-forest-700 font-bold flex items-center gap-1 bg-forest-50 border border-forest-200 px-3 py-1.5 rounded-xl animate-in fade-in">
                <Check className="w-3.5 h-3.5 text-forest-600" /> Preferences saved!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-forest-600 hover:bg-forest-700 active:scale-98 text-white shadow-sm transition-all duration-200"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </form>

      {/* Storage Architecture Telemetry Card */}
      <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-3 border-b border-sand-border">
          <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
            <Database className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-charcoal-900">Storage Architecture</h2>
            <p className="text-[11px] text-charcoal-500">
              Learning records are stored in this browser only.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-cream-100/70 border border-sand-border text-xs text-charcoal-700 flex flex-col gap-2 leading-relaxed">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-charcoal-900">Browser storage active</span>
          </div>
          <p>
            Courses, lessons, notes, preferences, and study sessions stay in this browser. They do not sync to other devices. Browser storage can be cleared, so export a copy if you need to keep your records.
          </p>
          <p className="text-[11px] text-charcoal-500 pt-1">Account sign-in, if enabled, does not sync these learning records.</p>
        </div>
      </div>

      {/* Data Backup & Reset Section */}
      <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-3 border-b border-sand-border">
          <div className="w-9 h-9 rounded-xl bg-sand-200 text-charcoal-700 flex items-center justify-center">
            <Download className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-charcoal-900">Export & {process.env.NODE_ENV === 'production' ? 'clear data' : 'reset demo'}</h2>
            <p className="text-[11px] text-charcoal-500">
              Export your browser data before clearing it. There is no import or cloud recovery yet.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <button
            onClick={handleExport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-sand-border bg-cream-50 hover:bg-cream-100 text-charcoal-800 font-semibold text-xs transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-forest-700" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{process.env.NODE_ENV === 'production' ? 'Clear all data' : 'Reset demo data'}</span>
          </button>
        </div>
        {backupError && <p role="alert" className="text-xs text-rose-800">{backupError}</p>}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-sand-border rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900">{process.env.NODE_ENV === 'production' ? 'Clear all learning data?' : 'Reset learning data?'}</h3>
            <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
              {process.env.NODE_ENV === 'production'
                ? 'This permanently clears the courses, notes, preferences, and study sessions stored in this browser. Export a JSON copy first if you need to keep them.'
                : 'This restores the development sample courses and clears your current sessions. Export a JSON copy first if you need to keep them.'}
            </p>
            {resetError && <p role="alert" className="mt-3 text-xs text-rose-800">{resetError}</p>}
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
                <span>{process.env.NODE_ENV === 'production' ? 'Clear my data' : 'Reset data'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

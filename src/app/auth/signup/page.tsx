'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { ArrowRight, GraduationCap, Lock, Mail, Target, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signupWithEmail, loginWithGoogle, isLoading, authConfigured } = useAuth();
  const { updatePreferences } = useLearning();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dailyGoal, setDailyGoal] = useState(60);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!name.trim()) return setError('Enter your name.');
    if (password.length < 8) return setError('Use a password with at least 8 characters.');

    try {
      const result = await signupWithEmail(name, email, password);
      if (result.authenticated) {
        updatePreferences({ name: name.trim(), daily_goal_minutes: dailyGoal });
        router.replace('/dashboard');
      } else {
        setNotice(result.message || 'Check your email to confirm your account, then sign in.');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create your account. Please try again.');
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      updatePreferences({ daily_goal_minutes: dailyGoal });
      await loginWithGoogle();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Google sign-in could not be started.');
    }
  };

  return (
    <main className="min-h-screen bg-cream-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-2xl bg-forest-600 flex items-center justify-center text-white"><GraduationCap aria-hidden="true" /></span>
          <span className="text-2xl font-black text-charcoal-900 tracking-tight">Learnhour</span>
        </Link>
        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-charcoal-900">Create your account</h1>
        <p className="mt-1 text-sm text-charcoal-600">Build a steady learning habit, one focused hour at a time.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <section className="bg-white border border-sand-border py-8 px-6 sm:px-8 rounded-3xl shadow-sm flex flex-col gap-5">
          {authConfigured ? (
            <>
              <GoogleButton onClick={handleGoogle} disabled={isLoading} label="Continue with Google" />
              <div className="relative flex items-center justify-center w-full" aria-hidden="true">
                <div className="flex-1 border-t border-sand-border" />
                <span className="shrink-0 px-3 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Or use email</span>
                <div className="flex-1 border-t border-sand-border" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-charcoal-700">Your name
                  <span className="relative mt-1 block"><User aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-500" /><input autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className="w-full text-sm pl-10 pr-4 py-2.5 bg-cream-50 border border-sand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600" /></span>
                </label>
                <label className="text-sm font-semibold text-charcoal-700">Email address
                  <span className="relative mt-1 block"><Mail aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-500" /><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full text-sm pl-10 pr-4 py-2.5 bg-cream-50 border border-sand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600" /></span>
                </label>
                <label className="text-sm font-semibold text-charcoal-700">Password
                  <span className="relative mt-1 block"><Lock aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-500" /><input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full text-sm pl-10 pr-4 py-2.5 bg-cream-50 border border-sand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600" /></span>
                </label>
                <fieldset>
                  <legend className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-charcoal-700"><Target className="w-4 h-4 text-forest-600" /> Daily study goal</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 60, 90].map((minutes) => <button key={minutes} type="button" aria-pressed={dailyGoal === minutes} onClick={() => setDailyGoal(minutes)} className={`min-h-10 rounded-xl text-sm font-bold ${dailyGoal === minutes ? 'bg-forest-600 text-white' : 'bg-cream-100 border border-sand-border text-charcoal-700'}`}>{minutes} min</button>)}
                  </div>
                </fieldset>
                {error && <p role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800">{error}</p>}
                {notice && <p role="status" className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">{notice}</p>}
                <button type="submit" disabled={isLoading} className="w-full min-h-11 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm disabled:opacity-50"><span>{isLoading ? 'Creating account…' : 'Create account'}</span><ArrowRight aria-hidden="true" className="w-4 h-4" /></button>
                <p className="text-xs leading-relaxed text-charcoal-600">Courses and study sessions are saved in your local browser workspace.</p>
              </form>
            </>
          ) : (
            <div className="rounded-2xl border border-sand-border bg-cream-50 p-4 text-sm leading-relaxed text-charcoal-700">Account creation is currently unavailable. Please verify your authentication configuration.</div>
          )}
          {!authConfigured && error && <p role="alert" className="text-sm text-rose-800">{error}</p>}
        </section>
        <p className="mt-6 text-center text-sm text-charcoal-600">Already have an account? <Link href="/auth/login" className="font-bold text-forest-700 hover:underline">Sign in</Link></p>
      </div>
    </main>
  );
}

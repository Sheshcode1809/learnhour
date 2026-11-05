'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { GraduationCap, Eye, EyeOff, Lock, Mail, User, ArrowRight, Target } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signupWithEmail, loginWithGoogle, isLoading } = useAuth();
  const { updatePreferences } = useLearning();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(60);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please provide an email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    try {
      await signupWithEmail(name, email, password, dailyGoal);
      updatePreferences({ name, daily_goal_minutes: dailyGoal });
      router.push('/dashboard');
    } catch {
      setError('Failed to create account. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      updatePreferences({ daily_goal_minutes: dailyGoal });
      await loginWithGoogle();
    } catch {
      setError('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-forest-600 flex items-center justify-center text-white shadow-md shadow-forest-800/10 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-charcoal-900 tracking-tight">Courseit</span>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-charcoal-500">
          Start conquering long courses with 1 focused hour a day.
        </p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-sand-border py-8 px-6 sm:px-8 rounded-3xl shadow-sm flex flex-col gap-5">
          {/* Google Sign In */}
          <GoogleButton onClick={handleGoogleSignUp} disabled={isLoading} label="Sign up with Google" />

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1 w-full">
            <div className="flex-1 border-t border-sand-border" />
            <span className="shrink-0 px-3 text-xs font-semibold text-charcoal-400 uppercase tracking-wider whitespace-nowrap">
              Or sign up with email
            </span>
            <div className="flex-1 border-t border-sand-border" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Your full name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-cream-50 border border-sand-border rounded-xl text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="learner@example.com"
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-cream-50 border border-sand-border rounded-xl text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Create password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 bg-cream-50 border border-sand-border rounded-xl text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Daily Habit Target Selector */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-forest-600" />
                <span>Preferred daily study habit:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyGoal(mins)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      dailyGoal === mins
                        ? 'bg-forest-600 text-white shadow-xs'
                        : 'bg-cream-100 border border-sand-border text-charcoal-700 hover:bg-cream-200'
                    }`}
                  >
                    {mins}m {mins === 60 ? '★' : ''}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-charcoal-400 mt-1">60 minutes is the recommended habit pace.</p>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating account...' : 'Create free account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Login Redirect */}
        <p className="mt-6 text-center text-xs text-charcoal-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-forest-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { GraduationCap, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    try {
      await loginWithEmail(email, password);
      router.push('/dashboard');
    } catch {
      setError('Failed to sign in. Please verify your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch {
      setError('Google Sign-In failed. Please try again.');
    }
  };

  const handleDemoAccess = async () => {
    await loginWithEmail('learner@courseit.dev', 'password123');
    router.push('/dashboard');
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
          Welcome back
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-charcoal-500">
          Continue your 1-hour daily learning streak.
        </p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-sand-border py-8 px-6 sm:px-8 rounded-3xl shadow-sm flex flex-col gap-5">
          {/* Google Sign In */}
          <GoogleButton onClick={handleGoogleSignIn} disabled={isLoading} label="Continue with Google (Demo)" />

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1 w-full">
            <div className="flex-1 border-t border-sand-border" />
            <span className="shrink-0 px-3 text-xs font-semibold text-charcoal-400 uppercase tracking-wider whitespace-nowrap">
              Or continue with email
            </span>
            <div className="flex-1 border-t border-sand-border" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-charcoal-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowDemoInfo((prev) => !prev)}
                  className="text-xs font-semibold text-forest-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {showDemoInfo && (
              <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 text-xs text-forest-800 leading-relaxed">
                <strong className="font-bold">Demo Mode:</strong> Account data is stored locally in your browser. Any email and password will sign you in, or click <em>Explore as Guest</em> below.
              </div>
            )}

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
              <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-3 border-t border-sand-border flex flex-col gap-2">
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sand-100 hover:bg-cream-200 text-charcoal-700 font-semibold text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              <span>Explore as Guest / Demo Learner</span>
            </button>
          </div>
        </div>

        {/* Signup Redirect */}
        <p className="mt-6 text-center text-xs text-charcoal-600">
          Don&apos;t have an account yet?{' '}
          <Link href="/auth/signup" className="font-bold text-forest-700 hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}


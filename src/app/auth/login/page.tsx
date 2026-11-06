'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthActionError, useAuth } from '@/context/AuthContext';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { GraduationCap, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, resendSignupConfirmation, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get('error');
    if (reason === 'auth-not-configured') setError('Account sign-in is being set up. Please try again shortly.');
    else if (reason === 'callback-failed') setError('Sign-in could not be verified. Please try again.');
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setShowResendConfirmation(false);
    try {
      await loginWithEmail(email, password);
      router.replace('/courses');
    } catch (cause) {
      if (cause instanceof AuthActionError && cause.code === 'email_not_confirmed') {
        setShowResendConfirmation(true);
      }
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.');
    }
  };

  const handleResendConfirmation = async () => {
    setError('');
    setNotice('');
    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }

    try {
      await resendSignupConfirmation(email);
      setShowResendConfirmation(false);
      setNotice('If this account needs confirmation, a new link has been sent. Check your inbox and spam folder.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to resend the confirmation email.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await loginWithGoogle();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Google sign-in could not be started.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-forest-600 flex items-center justify-center text-white shadow-md shadow-forest-800/10 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-charcoal-900 tracking-tight">Learnhour</span>
        </Link>
        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-charcoal-600">Continue your one-hour daily learning habit.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-sand-border py-8 px-6 sm:px-8 rounded-3xl shadow-sm flex flex-col gap-5">
          <GoogleButton onClick={handleGoogleSignIn} disabled={isLoading} label="Continue with Google" />
          
          <div className="relative flex items-center justify-center w-full" aria-hidden="true">
            <div className="flex-1 border-t border-sand-border" />
            <span className="shrink-0 px-3 text-xs font-semibold text-charcoal-500 uppercase tracking-wider whitespace-nowrap">Or use email</span>
            <div className="flex-1 border-t border-sand-border" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-charcoal-700 mb-1">Email address</label>
              <div className="relative">
                <Mail aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-500" />
                <input id="login-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full text-sm pl-10 pr-4 py-2.5 bg-cream-50 border border-sand-border rounded-xl text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600" />
              </div>
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-charcoal-700 mb-1">Password</label>
              <div className="relative">
                <Lock aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-500" />
                <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full text-sm pl-10 pr-4 py-2.5 bg-cream-50 border border-sand-border rounded-xl text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600" />
              </div>
            </div>
            <p className="rounded-xl border border-sand-border bg-cream-50 p-3 text-xs leading-relaxed text-charcoal-600">
              Your learning records are stored in this browser. Signing in gives you secure access to your account.
            </p>
            {error && <p role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800">{error}</p>}
            {notice && <p role="status" className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">{notice}</p>}
            {showResendConfirmation && <button type="button" onClick={handleResendConfirmation} disabled={isLoading} className="text-left text-sm font-semibold text-forest-700 hover:underline disabled:opacity-50">Resend confirmation email</button>}
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm disabled:opacity-50">
              <span>{isLoading ? 'Signing in…' : 'Sign in'}</span><ArrowRight aria-hidden="true" className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-charcoal-600">
          New here? <Link href="/auth/signup" className="font-bold text-forest-700 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

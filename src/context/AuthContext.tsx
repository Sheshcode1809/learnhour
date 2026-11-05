'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  provider: 'google' | 'email';
}

export interface AuthActionResult {
  authenticated: boolean;
  message?: string;
}

export class AuthActionError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AuthActionError';
  }
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authConfigured: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string) => Promise<AuthActionResult>;
  resendSignupConfirmation: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LEGACY_STORAGE_KEY = 'courseit_auth_user_v1';
const normalizeEmail = (email: string) => email.trim().toLowerCase();

function mapSessionUser(session: Session): AuthUser {
  const user = session.user;
  const provider = user.app_metadata?.provider === 'google' ? 'google' : 'email';

  return {
    id: user.id,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Learner',
    email: user.email || '',
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
    provider,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authConfigured = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    // Purge any legacy guest identity from storage
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Storage unavailable
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setUser(null);
      setIsLoading(false);
      return () => {
        mounted = false;
      };
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session ? mapSessionUser(session) : null);
    });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) throw error;
        setUser(data.session ? mapSessionUser(data.session) : null);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Email sign-in is not configured.');

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizeEmail(email),
        password,
      });
      if (error?.code === 'email_not_confirmed') {
        throw new AuthActionError('Confirm your email using the link we sent, then sign in again.', error.code);
      }
      if (error?.code === 'invalid_credentials') {
        throw new AuthActionError('Email or password is incorrect. If you just signed up, confirm your email first.', error.code);
      }
      if (error || !data.session) {
        throw new AuthActionError('Unable to sign in right now. Please try again.', error?.code || 'sign_in_failed');
      }
      setUser(mapSessionUser(data.session));
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (name: string, email: string, password: string): Promise<AuthActionResult> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Account creation is not configured.');

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizeEmail(email),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error?.code === 'email_address_invalid') {
        throw new Error('Enter a valid email address and try again.');
      }
      if (error?.code === 'weak_password') {
        throw new Error('Choose a stronger password and try again.');
      }
      if (error?.code === 'over_email_send_rate_limit') {
        throw new Error('Too many confirmation emails were requested. Wait a few minutes and try again.');
      }
      if (error?.code === 'email_address_not_authorized') {
        throw new Error('This Supabase project is not configured to send email to this address yet. Please contact support.');
      }
      if (error) throw new Error('Unable to create an account. Check your details and try again.');
      if (!data.session) {
        return {
          authenticated: false,
          message: 'Account created. Check your email for the confirmation link, then sign in.',
        };
      }

      setUser(mapSessionUser(data.session));
      return { authenticated: true };
    } finally {
      setIsLoading(false);
    }
  };

  const resendSignupConfirmation = async (email: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Email confirmation is not configured.');

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: normalizeEmail(email),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error?.code === 'over_email_send_rate_limit') {
        throw new Error('A confirmation email was sent recently. Wait a few minutes before requesting another.');
      }
      if (error) throw new Error('Unable to resend the confirmation email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Google sign-in is not configured.');

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    });

    if (error || !data.url) {
      setIsLoading(false);
      throw new Error('Google sign-in could not be started. Check the Supabase provider settings.');
    }

    window.location.assign(data.url);
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase && user) {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error('Unable to sign out. Please try again.');
    }
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    authConfigured,
    loginWithEmail,
    signupWithEmail,
    resendSignupConfirmation,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

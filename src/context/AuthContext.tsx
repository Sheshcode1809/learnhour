'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  provider: 'google' | 'email' | 'guest';
}

export interface AuthActionResult {
  authenticated: boolean;
  message?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authConfigured: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string) => Promise<AuthActionResult>;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const GUEST_STORAGE_KEY = 'courseit_auth_user_v1';

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

function readGuestUser(): AuthUser | null {
  try {
    const value = window.localStorage.getItem(GUEST_STORAGE_KEY);
    if (!value) return null;
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed === 'object' && parsed !== null &&
      'provider' in parsed && parsed.provider === 'guest'
    ) {
      return {
        id: 'local-guest',
        name: 'Learner',
        email: '',
        provider: 'guest',
      };
    }

    // Remove identities written by the previous mock-auth implementation.
    window.localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch {
    try {
      window.localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {
      // Storage may be disabled; guest mode can still be used for this page view.
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authConfigured = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;
    const guest = readGuestUser();
    const supabase = getSupabaseClient();

    if (!supabase) {
      setUser(guest);
      setIsLoading(false);
      return () => {
        mounted = false;
      };
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session ? mapSessionUser(session) : guest);
    });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) throw error;
        setUser(data.session ? mapSessionUser(data.session) : guest);
      })
      .catch(() => {
        if (mounted) setUser(guest);
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
    if (!supabase) throw new Error('Email sign-in is not configured. Continue as a guest to use local storage.');

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error || !data.session) throw new Error('Unable to sign in with those credentials.');
      setUser(mapSessionUser(data.session));
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (name: string, email: string, password: string): Promise<AuthActionResult> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Account creation is not configured. Continue as a guest to use local storage.');

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
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

  const loginWithGoogle = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Google sign-in is not configured. Continue as a guest to use local storage.');

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

  const continueAsGuest = () => {
    const guest: AuthUser = {
      id: 'local-guest',
      name: 'Learner',
      email: '',
      provider: 'guest',
    };
    try {
      window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guest));
    } catch {
      // Continue in memory if browser storage is disabled.
    }
    setUser(guest);
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase && user?.provider !== 'guest') {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error('Unable to sign out. Please try again.');
    }
    try {
      window.localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {
      // The current page still clears its in-memory identity.
    }
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user && user.provider !== 'guest'),
    isLoading,
    authConfigured,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    continueAsGuest,
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

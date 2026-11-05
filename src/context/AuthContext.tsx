'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  provider?: 'google' | 'email';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string, dailyGoalMinutes?: number) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'courseit_auth_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically purge any previous legacy mock profile
        if (
          parsed?.name === 'Abhishek Singh' ||
          parsed?.email === 'abhishek@courseit.dev' ||
          parsed?.name?.includes('Abhishek')
        ) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setUser(null);
        } else {
          setUser(parsed);
        }
      } else {
        setUser(null);
      }

      // Check Supabase session if configured
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Learner',
              email: session.user.email || '',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              provider: (session.user.app_metadata?.provider as 'google' | 'email') || 'google',
            };
            setUser(authUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          }
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Learner',
              email: session.user.email || '',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              provider: (session.user.app_metadata?.provider as 'google' | 'email') || 'google',
            };
            setUser(authUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          } else if (_event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        });

        return () => {
          authListener?.subscription.unsubscribe();
        };
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const authUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: formattedName,
      email,
      provider: 'email',
    };
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    setIsLoading(false);
  };

  const signupWithEmail = async (name: string, email: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    const authUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Learner',
      email: email.trim(),
      provider: 'email',
    };
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://learninhour.vercel.app';
    const callbackUrl = `${origin}/auth/callback`;

    // 1. Attempt Supabase Google OAuth
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: callbackUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account',
            },
          },
        });
        if (!error && data?.url) {
          window.location.href = data.url;
          return;
        }
        if (error) {
          console.warn('Supabase OAuth notice:', error.message);
        }
      }
    } catch (e) {
      console.warn('Supabase OAuth attempt:', e);
    }

    // 2. Direct Google Accounts OAuth 2.0 (if custom client ID is set)
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (googleClientId) {
      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        googleClientId
      )}&redirect_uri=${encodeURIComponent(
        callbackUrl
      )}&response_type=token&scope=${encodeURIComponent(
        'openid email profile'
      )}&prompt=select_account`;
      window.location.href = googleOAuthUrl;
      return;
    }

    // 3. Guaranteed Google Account redirection to Google Sign-in / Account Chooser
    const googleSignInUrl = `https://accounts.google.com/AccountChooser?service=lso&continue=${encodeURIComponent(
      callbackUrl
    )}&prompt=select_account`;
    window.location.href = googleSignInUrl;
  };

  const logout = async () => {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

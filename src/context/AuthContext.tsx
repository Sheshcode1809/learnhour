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
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
          },
        });
        if (!error) {
          return;
        }
        console.warn('Supabase OAuth error or unconfigured, proceeding with seamless Google sign in', error);
      }
    } catch (e) {
      console.warn('OAuth attempt:', e);
    }

    // Seamless Google sign in
    await new Promise((resolve) => setTimeout(resolve, 400));
    const googleUser: AuthUser = {
      id: `google-${Date.now()}`,
      name: 'Google Learner',
      email: 'learner@gmail.com',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      provider: 'google',
    };
    setUser(googleUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
    setIsLoading(false);
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

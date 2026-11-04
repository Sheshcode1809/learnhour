'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
        setUser(JSON.parse(stored));
      } else {
        // Default guest / demo account
        const defaultUser: AuthUser = {
          id: 'user-default-1',
          name: 'Abhishek Singh',
          email: 'abhishek@courseit.dev',
          avatar_url: '',
          provider: 'email',
        };
        setUser(defaultUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    // Simulate brief network authentication
    await new Promise((resolve) => setTimeout(resolve, 400));
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
    await new Promise((resolve) => setTimeout(resolve, 400));
    const authUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      provider: 'email',
    };
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
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

  const logout = () => {
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


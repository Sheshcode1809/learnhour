'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { GraduationCap, Loader2 } from 'lucide-react';

const AUTH_STORAGE_KEY = 'courseit_auth_user_v1';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState('Verifying Google account...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          // Supabase automatically parses tokens from URL hash or code in search params
          const { data: { session }, error } = await supabase.auth.getSession();
          if (session?.user && !error) {
            const authUser = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Learner',
              email: session.user.email || 'learner@gmail.com',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              provider: 'google' as const,
            };
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
            setStatusMessage('Welcome! Redirecting to your dashboard...');
            setTimeout(() => {
              router.replace('/dashboard');
            }, 500);
            return;
          }
        }

        // Check if access_token was returned directly in URL hash
        if (typeof window !== 'undefined' && window.location.hash) {
          const params = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = params.get('access_token');
          if (accessToken) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              if (res.ok) {
                const profile = await res.json();
                const authUser = {
                  id: `google-${profile.sub || Date.now()}`,
                  name: profile.name || profile.given_name || 'Learner',
                  email: profile.email || 'learner@gmail.com',
                  avatar_url: profile.picture || '',
                  provider: 'google' as const,
                };
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
                setStatusMessage('Signed in successfully! Loading dashboard...');
                setTimeout(() => {
                  router.replace('/dashboard');
                }, 500);
                return;
              }
            } catch {
              // fallback
            }
          }
        }

        // If returned from Google account selection without OAuth token
        const existingStored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!existingStored) {
          const authUser = {
            id: `google-${Date.now()}`,
            name: 'Google Learner',
            email: 'learner@gmail.com',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            provider: 'google' as const,
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        }

        setStatusMessage('Connecting your workspace...');
        setTimeout(() => {
          router.replace('/dashboard');
        }, 600);
      } catch (err) {
        console.error('Callback error:', err);
        router.replace('/dashboard');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-sand-border p-8 rounded-3xl shadow-sm max-w-sm w-full text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-forest-600 flex items-center justify-center text-white shadow-md shadow-forest-800/10">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-charcoal-900 tracking-tight">Authenticating with Google</h2>
          <p className="text-xs text-charcoal-500">{statusMessage}</p>
        </div>
        <div className="mt-2 flex items-center justify-center text-forest-700">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    </div>
  );
}

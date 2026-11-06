'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { GraduationCap, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState('Verifying your account…');

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        router.replace('/auth/login?error=auth-not-configured');
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error || !data.session?.user) {
          router.replace('/auth/login?error=callback-failed');
          return;
        }

        setStatusMessage('Account verified. Opening your courses…');
        router.replace('/courses');
      } catch {
        if (active) router.replace('/auth/login?error=callback-failed');
      }
    };

    void verifySession();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-sand-border p-8 rounded-3xl shadow-sm max-w-sm w-full text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-forest-600 flex items-center justify-center text-white">
          <GraduationCap className="w-7 h-7" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-charcoal-900">Verifying sign-in</h1>
          <p className="mt-1 text-sm text-charcoal-600">{statusMessage}</p>
        </div>
        <Loader2 className="w-6 h-6 text-forest-700 animate-spin" aria-label="Loading" />
      </div>
    </div>
  );
}


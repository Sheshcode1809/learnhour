'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/courses');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-charcoal-500">
      Loading My Courses…
    </div>
  );
}

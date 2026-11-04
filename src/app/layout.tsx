import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LearningProvider } from '@/context/LearningContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://courseit.vercel.app'),
  title: {
    default: 'Courseit — Daily Course & Learning Progress Tracker',
    template: '%s | Courseit',
  },
  description: 'Conquer long courses and YouTube lectures by studying 1 focused hour a day. Track daily targets, streaks, day-by-day plans, and interactive active recall quizzes.',
  keywords: [
    'course tracker',
    'learning tracker',
    'study habit',
    '1 hour a day',
    'youtube course planner',
    'daily study goal',
  ],
  authors: [{ name: 'Courseit Team' }],
  creator: 'Courseit',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://courseit.vercel.app',
    siteName: 'Courseit',
    title: 'Courseit — Daily Course & Learning Progress Tracker',
    description: 'Paste a long video. Get a 1-hour/day course. Track your daily habit and retain knowledge.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Courseit — Daily Course & Learning Progress Tracker',
    description: 'Turn long technical tutorials into structured daily 1-hour study modules.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-forest-100 selection:text-forest-800">
        <AuthProvider>
          <LearningProvider>
            <AppShell>{children}</AppShell>
          </LearningProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

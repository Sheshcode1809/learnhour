import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LearningProvider } from '@/context/LearningContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Courseit — Daily Course & Learning Progress Tracker',
  description: 'Conquer long courses and YouTube lectures by studying 1 hour a day. Track daily targets, streaks, day-by-day course plans, and interactive quizzes.',
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

import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LearningProvider } from '@/context/LearningContext';
import { AppShell } from '@/components/layout/AppShell';

const publicBaseUrl = (() => {
  try {
    const value = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (!value) return undefined;
    const parsed = new URL(value);
    return parsed.protocol === 'https:' ? new URL(parsed.origin) : undefined;
  } catch {
    return undefined;
  }
})();

export const metadata: Metadata = {
  ...(publicBaseUrl ? { metadataBase: publicBaseUrl } : {}),
  ...(publicBaseUrl ? { alternates: { canonical: '/' } } : {}),
  title: {
    default: 'Learnhour — A steady hour of learning',
    template: '%s | Learnhour',
  },
  description: 'Organize video courses into daily study plans, track focused sessions, and keep your learning progress in one place.',
  keywords: ['course tracker', 'learning tracker', 'study habit', 'daily study plan', 'video course planner'],
  authors: [{ name: 'Learnhour' }],
  creator: 'Learnhour',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    ...(publicBaseUrl ? { url: publicBaseUrl.toString() } : {}),
    siteName: 'Learnhour',
    title: 'Learnhour — A steady hour of learning',
    description: 'Organize video courses into daily study plans and track your learning progress.',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learnhour — A steady hour of learning',
    description: 'Organize video courses into daily study plans and track your learning progress.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-forest-100 selection:text-forest-800 font-sans">
        <AuthProvider>
          <LearningProvider>
            <AppShell>{children}</AppShell>
          </LearningProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { PublicPage } from '@/components/layout/PublicPage';

export const metadata: Metadata = {
  title: 'About Learnhour',
  description: 'Learn how Learnhour helps organize self-paced video courses into daily study plans.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <PublicPage title="About Learnhour">
      <p>Learnhour helps you organize self-paced learning into manageable daily study blocks. You can create a course from a supported YouTube video or start from a prepared course plan, then track lessons and focused study sessions.</p>
      <h2 className="pt-2 text-xl font-bold text-charcoal-900">Where your learning data lives</h2>
      <p>Courses, lesson progress, notes, preferences, and study sessions are currently stored in your browser. They do not sync between devices or to a Learnhour account. Clearing this browser&apos;s site data can remove them, so use the available JSON export if you need a copy.</p>
      <p>When a YouTube video is embedded, playback is provided by YouTube and is subject to that service&apos;s availability and terms. Video details and total duration for custom links must be entered by the learner.</p>
      <p>Learnhour is a study organizer. It does not host or verify the third-party course content linked by learners.</p>
    </PublicPage>
  );
}

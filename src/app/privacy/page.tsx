import type { Metadata } from 'next';
import { PublicPage } from '@/components/layout/PublicPage';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'Draft privacy notice for Learnhour.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <PublicPage title="Privacy notice">
      <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 font-semibold text-amber-900">Draft for the site operator to review and complete before public launch. This page is not legal advice.</p>
      <p><strong>Learning records.</strong> Course details, lesson progress, notes, study sessions, and preferences are stored in this browser using local storage. They are not currently synchronized to Learnhour servers or across devices. Anyone with access to this browser profile may be able to access this data. Clearing site data can delete it.</p>
      <p><strong>Optional account sign-in.</strong> If the operator enables Supabase Auth, email/password or Google sign-in sends the required account information to the configured Supabase project and, for Google sign-in, to Google. Account authentication does not currently sync course or study records.</p>
      <p><strong>Third-party video and images.</strong> Opening or embedding a video, or loading a remote thumbnail, may cause your browser to connect to the relevant third-party provider. Those providers process requests under their own policies.</p>
      <p><strong>Operator details to complete.</strong> Before launch, add the responsible legal entity, contact address, applicable jurisdiction, retention and deletion process, analytics and hosting details, and any jurisdiction-specific notices. Confirm the actual deployment configuration and third-party services.</p>
    </PublicPage>
  );
}

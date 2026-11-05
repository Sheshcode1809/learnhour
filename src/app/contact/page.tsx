import type { Metadata } from 'next';
import { PublicPage } from '@/components/layout/PublicPage';

export const metadata: Metadata = {
  title: 'Contact Learnhour',
  description: 'Contact information for Learnhour.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();

  return (
    <PublicPage title="Contact">
      <p>For help with Learnhour or to report a problem, contact the site operator.</p>
      {supportEmail ? (
        <p><a className="font-semibold text-forest-700 underline" href={`mailto:${supportEmail}`}>{supportEmail}</a></p>
      ) : (
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">The operator has not configured a support contact yet. A support address is required before public launch.</p>
      )}
    </PublicPage>
  );
}

import type { Metadata } from 'next';
import { PublicPage } from '@/components/layout/PublicPage';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Draft terms of use for Learnhour.',
  alternates: { canonical: '/terms' },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <PublicPage title="Terms of use">
      <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 font-semibold text-amber-900">Draft for the site operator to review and complete before public launch. This page is not legal advice.</p>
      <p>Learnhour is a study-planning tool. Course material linked or embedded in the service is supplied by third parties and remains subject to their terms and availability. Learners are responsible for having permission to access and use that material.</p>
      <p>Learning records are stored in the browser on this device. The operator does not currently provide cloud synchronization or a server-side recovery service for those records. Keep your own backup when needed.</p>
      <p>Before launch, the operator must complete these terms with the service owner, governing law, eligibility, account rules, acceptable-use terms, service limitations, dispute process, and any required consumer disclosures. These draft terms are not yet approved for production use.</p>
    </PublicPage>
  );
}

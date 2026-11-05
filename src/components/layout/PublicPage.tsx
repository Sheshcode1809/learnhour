import Link from 'next/link';

export function PublicPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-900">
      <header className="border-b border-sand-border bg-cream-50 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/" className="text-lg font-black tracking-tight">Learnhour</Link>
          <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm font-medium text-charcoal-700">
            <Link href="/about" className="hover:text-forest-700">About</Link>
            <Link href="/privacy" className="hover:text-forest-700">Privacy</Link>
            <Link href="/terms" className="hover:text-forest-700">Terms</Link>
            <Link href="/contact" className="hover:text-forest-700">Contact</Link>
            <Link href="/auth/login" className="rounded-lg bg-forest-600 px-3 py-2 text-white hover:bg-forest-700">Open Learnhour</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-charcoal-700 sm:text-base">{children}</div>
      </main>
      <footer className="border-t border-sand-border px-4 py-6 text-center text-xs text-charcoal-500 sm:px-8">
        Learnhour · <Link href="/privacy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link> · <Link href="/contact" className="underline">Contact</Link>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ScenicBanner } from '@/components/courses/ScenicBanner';
import { GoogleButton } from '@/components/auth/GoogleButton';
import {
  GraduationCap,
  Sparkles,
  Play,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
  Layers,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Video,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { loginWithGoogle, isAuthenticated } = useAuth();

  const handleGoogleCTA = async () => {
    await loginWithGoogle();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-800 flex flex-col selection:bg-forest-100 selection:text-forest-800">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-sand-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/landing" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-charcoal-900 tracking-tight">Courseit</span>
            <span className="ml-1.5 text-[10px] font-bold bg-terracotta-100 text-terracotta-700 px-1.5 py-0.5 rounded-full">
              1h/day
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-charcoal-600">
          <a href="#how-it-works" className="hover:text-forest-700 transition-colors">
            How it works
          </a>
          <a href="#features" className="hover:text-forest-700 transition-colors">
            Features
          </a>
          <a href="#masterclasses" className="hover:text-forest-700 transition-colors">
            Popular courses
          </a>
          <Link href="/courses/new" className="hover:text-forest-700 transition-colors">
            Paste video
          </Link>
        </nav>

        {/* Right Auth Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 px-3 py-2 rounded-xl hover:bg-cream-200 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <span>Get started free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200 border border-sand-border text-xs font-semibold text-charcoal-700 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          <span>Stop saving 10-hour tutorials you never finish</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-charcoal-900 tracking-tight max-w-4xl leading-[1.12]">
          Paste a long video.{' '}
          <span className="font-serif italic text-forest-600 font-normal">
            Get a 1-hour/day course.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-charcoal-600 max-w-2xl leading-relaxed">
          Courseit turns long 8-, 10-, and 12-hour YouTube lectures and playlists into bite-sized daily lessons.
          Track your daily 60-minute habit, keep your streak alive, and test your retention with interactive quizzes.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md">
          <Link
            href="/courses/new"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-bold text-sm shadow-md shadow-forest-800/15 transition-all hover:scale-102"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Try Quick Course Builder</span>
          </Link>

          <Link
            href="/auth/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-white hover:bg-cream-200 text-charcoal-800 border border-sand-border font-bold text-sm shadow-2xs transition-all"
          >
            <span>Sign Up Free</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Google Sign In Pill */}
        <div className="mt-4 flex items-center gap-2 text-xs text-charcoal-500">
          <span>Or get started instantly:</span>
          <button
            onClick={handleGoogleCTA}
            className="font-bold text-forest-700 hover:underline flex items-center gap-1"
          >
            <span>Continue with Google →</span>
          </button>
        </div>

        {/* Scenic Nature Illustration Banner */}
        <div className="w-full mt-12 relative max-w-5xl">
          <ScenicBanner height="h-56 sm:h-72 md:h-80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs mb-2">
              Habit Rule
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-charcoal-900 drop-shadow-xs">
              One focused hour every single day beats sporadic binge learning.
            </h3>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-cream-50/80 border-y border-sand-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
            Workflow
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight mt-3">
            How Courseit Works
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-2 max-w-lg">
            From an overwhelming 10-hour tutorial to consistent daily mastery in 3 simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left w-full">
            {/* Step 1 */}
            <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center font-black text-sm mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-charcoal-900 mb-1.5">
                  Paste Any Long Video
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Paste any YouTube link, talk, or multi-hour playlist. Courseit inspects the duration and automatically generates curriculum chapters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand-border/70 flex items-center gap-2 text-xs font-semibold text-forest-700">
                <Video className="w-4 h-4" />
                <span>Zero configuration needed</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-sand-200 text-charcoal-700 flex items-center justify-center font-black text-sm mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-charcoal-900 mb-1.5">
                  Get Day-by-Day Chunks
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Instead of watching aimlessly, follow your structured plan: <span className="font-semibold text-charcoal-800">Day 1 (60m)</span>, <span className="font-semibold text-charcoal-800">Day 2 (60m)</span>, and <span className="font-semibold text-charcoal-800">Day 3 (60m)</span>.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand-border/70 flex items-center gap-2 text-xs font-semibold text-charcoal-700">
                <Calendar className="w-4 h-4 text-forest-600" />
                <span>Custom daily pace (30m, 60m, 90m)</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center font-black text-sm mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-charcoal-900 mb-1.5">
                  Study & Retain with Quizzes
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Learn with our interactive embedded player, track study sessions with the persistent focus timer, pin timestamped notes, and test retention with quizzes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand-border/70 flex items-center gap-2 text-xs font-semibold text-terracotta-700">
                <Flame className="w-4 h-4 fill-terracotta-500" />
                <span>Build uninterrupted streaks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
            Full Toolset
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight mt-3">
            Designed for Real Learning
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-2">
            Everything you need to finish technical courses without distraction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 mb-2">Persistent Study Timer</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Floating study stopwatch stays running even when switching pages or refreshing. Never lose a second of focus.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 mb-2">Daily Streak Engine</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Calculates current and best learning streak based on verified 60-minute completed study days.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 mb-2">Active Recall Quizzes</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Instant multiple-choice quizzes after lessons with instant answer explanations to solidify mental models.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-sand-200 text-charcoal-700 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 mb-2">Timestamped Notes</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Pin takeaways, code snippets, and reflections directly to exact moments in video lectures.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 mb-2">Concept Flashcards</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Interactive 3D flippable card decks for core engineering and programming vocabulary.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white border border-sand-border rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-sand-200 text-charcoal-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 mb-2">Offline Ready + Cloud Sync</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Local-first zero-config storage works immediately offline, with Supabase PostgreSQL migrations ready for multi-device sync.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Presets Section */}
      <section id="masterclasses" className="py-16 bg-cream-50 border-t border-sand-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
            Featured Masterclasses
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight mt-3 text-center">
            Already partitioned & ready to study
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 w-full">
            {/* Course 1 */}
            <div className="bg-white border border-sand-border rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-forest-700 mb-2">
                  <span>freeCodeCamp</span>
                  <span className="bg-forest-100 px-2 py-0.5 rounded">10 Hours Total</span>
                </div>
                <h3 className="text-base font-bold text-charcoal-900">
                  Learn Python – Interactive Course 2026
                </h3>
                <p className="text-xs text-charcoal-500 mt-1 line-clamp-2">
                  Variables, control flow, functions, OOP, and mini projects partitioned into 10 daily 60m blocks.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-sand-border flex items-center justify-between">
                <span className="text-xs text-charcoal-500">18 lessons</span>
                <Link
                  href="/courses/python-2026"
                  className="px-3.5 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs"
                >
                  Start Course →
                </Link>
              </div>
            </div>

            {/* Course 2 */}
            <div className="bg-white border border-sand-border rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-forest-700 mb-2">
                  <span>freeCodeCamp</span>
                  <span className="bg-forest-100 px-2 py-0.5 rounded">8 Hours Total</span>
                </div>
                <h3 className="text-base font-bold text-charcoal-900">
                  Neural Networks from Scratch
                </h3>
                <p className="text-xs text-charcoal-500 mt-1 line-clamp-2">
                  Build deep learning models from scratch in pure Python and NumPy with backprop and gradient descent.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-sand-border flex items-center justify-between">
                <span className="text-xs text-charcoal-500">5 lessons</span>
                <Link
                  href="/courses/neural-networks"
                  className="px-3.5 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs"
                >
                  Start Course →
                </Link>
              </div>
            </div>

            {/* Course 3 */}
            <div className="bg-white border border-sand-border rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-forest-700 mb-2">
                  <span>freeCodeCamp</span>
                  <span className="bg-forest-100 px-2 py-0.5 rounded">12 Hours Total</span>
                </div>
                <h3 className="text-base font-bold text-charcoal-900">
                  System Design Interview Complete Masterclass
                </h3>
                <p className="text-xs text-charcoal-500 mt-1 line-clamp-2">
                  Scalability, database sharding, caching strategies, message queues, and distributed consensus.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-sand-border flex items-center justify-between">
                <span className="text-xs text-charcoal-500">4 lessons</span>
                <Link
                  href="/courses/system-design"
                  className="px-3.5 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs"
                >
                  Start Course →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="bg-sand-100 border border-sand-border rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white flex items-center justify-center mb-4 shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
            Ready to conquer long courses?
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 max-w-md">
            Join self-directed learners who study for 1 focused hour a day and actually complete their courses.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
            <Link
              href="/auth/signup"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-sm"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGoogleCTA}
              className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 underline"
            >
              Or sign in with Google in one click
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand-border bg-cream-50 py-8 px-4 sm:px-8 text-xs text-charcoal-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-forest-600 text-white flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-charcoal-800">Courseit</span>
          <span>— One focused hour a day.</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/auth/login" className="hover:text-charcoal-900">Sign in</Link>
          <Link href="/auth/signup" className="hover:text-charcoal-900">Sign up</Link>
          <Link href="/" className="hover:text-charcoal-900">Dashboard</Link>
        </div>
      </footer>
    </div>
  );
}

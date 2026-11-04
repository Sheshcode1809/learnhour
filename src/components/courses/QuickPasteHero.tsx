'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Play, Check, AlertCircle, Video, CheckCircle2, X } from 'lucide-react';
import { ScenicBanner } from './ScenicBanner';
import { parseYouTubeUrlOrPreset, PRESET_COURSES } from '@/lib/youtube';
import { useLearning } from '@/context/LearningContext';

export function QuickPasteHero({ onToggleManual }: { onToggleManual?: () => void }) {
  const router = useRouter();
  const { addCourse } = useLearning();

  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);

  // Confirmation state for custom YouTube videos
  const [pendingVideo, setPendingVideo] = useState<{
    videoId: string;
    embedUrl: string;
    thumbnailUrl: string;
    courseUrl: string;
  } | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDuration, setCustomDuration] = useState('120');

  const handleBuild = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please paste a YouTube video or course URL.');
      return;
    }

    const parsed = parseYouTubeUrlOrPreset(trimmed);
    if (!parsed || !parsed.videoId) {
      setError('Invalid or unsupported URL. Please paste a valid YouTube video link (e.g. https://www.youtube.com/watch?v=...) or pick a preset below.');
      return;
    }

    // 1. If it's one of our curated masterclasses, build instantly
    if (parsed.isPreset) {
      setIsBuilding(true);
      const matchedPreset = PRESET_COURSES.find(
        (p) => p.url.toLowerCase() === trimmed.toLowerCase() || trimmed.includes(p.key)
      );

      if (matchedPreset) {
        const newCourse = addCourse({
          title: matchedPreset.title,
          provider: matchedPreset.provider,
          course_url: matchedPreset.url,
          embed_url: parsed.embedUrl,
          thumbnail_url: matchedPreset.thumbnail_url,
          description: matchedPreset.description,
          total_minutes: matchedPreset.total_minutes,
          daily_pace_minutes: matchedPreset.daily_pace_minutes,
          lessons: matchedPreset.lessons.map((l) => ({
            ...l,
            course_id: '',
          })),
        });

        setTimeout(() => {
          router.push(`/courses/${newCourse.id}`);
        }, 300);
        return;
      }
    }

    // 2. Custom YouTube video without server API: ask user to confirm title & duration honestly
    setPendingVideo({
      videoId: parsed.videoId,
      embedUrl: parsed.embedUrl,
      thumbnailUrl: parsed.thumbnailUrl,
      courseUrl: trimmed,
    });
  };

  const handleConfirmCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingVideo) return;

    if (!customTitle.trim()) {
      setError('Please enter a title for your course.');
      return;
    }
    const duration = parseInt(customDuration, 10);
    if (isNaN(duration) || duration <= 0) {
      setError('Duration must be greater than 0 minutes.');
      return;
    }

    setIsBuilding(true);

    try {
      const newCourse = addCourse({
        title: customTitle.trim(),
        provider: 'YouTube',
        course_url: pendingVideo.courseUrl,
        embed_url: pendingVideo.embedUrl,
        thumbnail_url: pendingVideo.thumbnailUrl,
        description: 'Custom learning course partitioned into daily 1-hour study chunks.',
        total_minutes: duration,
        daily_pace_minutes: 60,
      });

      setTimeout(() => {
        router.push(`/courses/${newCourse.id}`);
      }, 300);
    } catch {
      setError('Failed to build course. Please try again.');
      setIsBuilding(false);
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setPendingVideo(null);
    setError('');
  };

  return (
    <div className="relative w-full">
      {/* Background Scenic Banner */}
      <ScenicBanner height="h-64 sm:h-80 md:h-96" />

      {/* Floating Hero Card Over Scenic Banner */}
      <div className="relative -mt-44 sm:-mt-56 md:-mt-64 max-w-2xl mx-auto px-4 z-10">
        <div className="bg-cream-50/95 backdrop-blur-md border border-sand-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-sand-300/30">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-700 text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              New course
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal-900 tracking-tight">
              Paste a long video. <span className="text-forest-600 font-serif italic">Get a course.</span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-charcoal-600 max-w-md">
              Paste any YouTube video or masterclass. We split it into 1-hour daily lessons so you finish steadily.
            </p>

            {/* If pending confirmation for custom YouTube video */}
            {pendingVideo ? (
              <form onSubmit={handleConfirmCustomVideo} className="w-full mt-6 p-4 rounded-2xl bg-white border border-sand-border text-left flex flex-col gap-3 shadow-xs animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-sand-border">
                  <div className="flex items-center gap-2 text-forest-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-forest-600" />
                    <span>YouTube Video Detected</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingVideo(null)}
                    className="p-1 rounded text-charcoal-400 hover:text-charcoal-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Course / Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Complete Rust Programming Masterclass"
                    className="w-full text-xs sm:text-sm bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Total Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="120"
                    className="w-full text-xs sm:text-sm bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                  />
                  <p className="text-[10px] text-charcoal-400 mt-1">
                    Enter the total video length so we can partition it into 1-hour daily plans.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPendingVideo(null)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-cream-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBuilding}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-forest-600 hover:bg-forest-700 text-white shadow-sm disabled:opacity-50"
                  >
                    {isBuilding ? 'Building plan...' : 'Build Day-by-Day Course'}
                  </button>
                </div>
              </form>
            ) : (
              /* Input & CTA Form */
              <form onSubmit={handleBuild} className="w-full mt-6 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white border border-sand-border rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-forest-600">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-transparent border-none text-charcoal-800 placeholder:text-charcoal-400 focus:outline-none font-medium"
                  />

                  <button
                    type="submit"
                    disabled={isBuilding}
                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-medium text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
                  >
                    {isBuilding ? (
                      <span>Building...</span>
                    ) : (
                      <>
                        <span>Build my course</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-medium mt-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="mt-2.5 text-xs text-charcoal-500 text-left bg-cream-50 p-2.5 rounded-xl border border-sand-border/70 leading-relaxed">
                  <strong>What happens next:</strong> Clicking &ldquo;Build my course&rdquo; organizes this material into structured 60-minute daily study days. If pasting an unrecognized YouTube video, you will be prompted to confirm the title and total duration.
                </div>
              </form>
            )}

            {/* Presets Grid */}
            <div className="w-full mt-6 pt-5 border-t border-sand-border">
              <div className="text-left mb-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal-700">Or pick a popular masterclass:</span>
                {onToggleManual && (
                  <button
                    type="button"
                    onClick={onToggleManual}
                    className="text-xs text-forest-700 hover:underline font-semibold"
                  >
                    Create custom course manually →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
                {PRESET_COURSES.map((preset) => {
                  const isSelected = url === preset.url;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-forest-600 bg-forest-50/80 ring-2 ring-forest-600/30 shadow-xs'
                          : 'border-sand-border bg-white hover:bg-cream-100 hover:border-sand-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold text-forest-700 bg-forest-100/70 px-1.5 py-0.5 rounded">
                            {Math.round(preset.total_minutes / 60)}h long
                          </span>
                          {isSelected ? (
                            <span className="text-[10px] font-bold text-white bg-forest-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Selected
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs font-bold text-charcoal-900 line-clamp-1">
                          {preset.title}
                        </div>
                        <div className="text-[10px] text-charcoal-500 mt-0.5">
                          {preset.provider}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

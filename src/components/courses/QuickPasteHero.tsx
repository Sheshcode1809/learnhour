'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Play, Check, AlertCircle } from 'lucide-react';
import { ScenicBanner } from './ScenicBanner';
import { parseYouTubeUrlOrPreset, PRESET_COURSES } from '@/lib/youtube';
import { useLearning } from '@/context/LearningContext';

export function QuickPasteHero({ onToggleManual }: { onToggleManual?: () => void }) {
  const router = useRouter();
  const { addCourse } = useLearning();

  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);

  const handleBuild = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please paste a YouTube video or course URL.');
      return;
    }

    setIsBuilding(true);

    try {
      // Check if it's one of our presets or arbitrary YouTube URL
      const matchedPreset = PRESET_COURSES.find(
        (p) => p.url.toLowerCase() === trimmed.toLowerCase() || trimmed.includes(p.key)
      );

      if (matchedPreset) {
        // Build preset course directly with its lessons and quizzes
        const newCourse = addCourse({
          title: matchedPreset.title,
          provider: matchedPreset.provider,
          course_url: matchedPreset.url,
          embed_url: `https://www.youtube.com/embed/${matchedPreset.url.split('v=')[1]?.slice(0, 11) || 'kL2gQWjmLc0'}?enablejsapi=1`,
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

      // Generic YouTube video or URL
      const parsed = parseYouTubeUrlOrPreset(trimmed);
      const videoTitle = parsed.suggestedTitle || 'New Video Course';
      const videoDuration = parsed.suggestedDuration || 180; // default 3 hours

      const newCourse = addCourse({
        title: videoTitle,
        provider: parsed.suggestedProvider || 'YouTube',
        course_url: trimmed,
        embed_url: parsed.embedUrl,
        thumbnail_url: parsed.thumbnailUrl,
        description: 'Auto-generated day-wise study course from YouTube video.',
        total_minutes: videoDuration,
        daily_pace_minutes: 60,
      });

      setTimeout(() => {
        router.push(`/courses/${newCourse.id}`);
      }, 300);
    } catch {
      setError('Could not parse course from URL. Please check the link or use manual entry.');
      setIsBuilding(false);
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
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
              Any YouTube video or playlist, from a 20-minute talk to a 12-hour masterclass. We split it into 1-hour daily lessons.
            </p>

            {/* Input & CTA Form */}
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
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-transparent border-none text-charcoal-800 placeholder:text-charcoal-400 focus:outline-none"
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
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-medium mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}
            </form>

            <div className="mt-3 text-[11px] font-semibold text-charcoal-400 tracking-wider uppercase">
              Already built by someone? It opens instantly.
            </div>

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
                    Enter manual details →
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
                          ? 'border-forest-600 bg-forest-50/60 ring-1 ring-forest-600'
                          : 'border-sand-border bg-white hover:bg-cream-100 hover:border-sand-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold text-forest-700 bg-forest-100/70 px-1.5 py-0.5 rounded">
                            {Math.round(preset.total_minutes / 60)}h long
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-forest-600" />}
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


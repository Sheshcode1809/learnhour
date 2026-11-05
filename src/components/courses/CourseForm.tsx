'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types';
import { useLearning } from '@/context/LearningContext';
import { parseYouTubeUrlOrPreset, isAllowlistedEmbedUrl } from '@/lib/youtube';
import { generateLessonsForCourse } from '@/lib/calculations/dayPlanner';
import { Check, X, AlertCircle, AlertTriangle } from 'lucide-react';

interface CourseFormProps {
  initialData?: Course;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CourseForm({ initialData, onSuccess, onCancel }: CourseFormProps) {
  const router = useRouter();
  const { addCourse, updateCourse } = useLearning();

  const [title, setTitle] = useState(initialData?.title || '');
  const [provider, setProvider] = useState(initialData?.provider || 'YouTube');
  const [courseUrl, setCourseUrl] = useState(initialData?.course_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || '');
  const [totalMinutes, setTotalMinutes] = useState(initialData?.total_minutes?.toString() || '180');
  const [dailyPaceMinutes, setDailyPaceMinutes] = useState(initialData?.daily_pace_minutes?.toString() || '60');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'active');

  // Option to explicitly rebuild plan when editing duration
  const [rebuildPlan, setRebuildPlan] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUrlBlur = () => {
    if (courseUrl && !thumbnailUrl) {
      const parsed = parseYouTubeUrlOrPreset(courseUrl);
      if (parsed?.thumbnailUrl) {
        setThumbnailUrl(parsed.thumbnailUrl);
      }
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    const parsedTotal = parseInt(totalMinutes, 10);
    if (isNaN(parsedTotal) || parsedTotal <= 0) {
      nextErrors.totalMinutes = 'Total duration must be greater than 0 minutes';
    }
    const parsedPace = parseInt(dailyPaceMinutes, 10);
    if (isNaN(parsedPace) || parsedPace <= 0) {
      nextErrors.dailyPaceMinutes = 'Daily pace must be greater than 0';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    if (!validate()) return;

    setIsSubmitting(true);
    const parsedTotal = parseInt(totalMinutes, 10);
    const parsedPace = parseInt(dailyPaceMinutes, 10);
    const parsedVideo = parseYouTubeUrlOrPreset(courseUrl);

    const safeEmbedUrl = parsedVideo?.embedUrl && isAllowlistedEmbedUrl(parsedVideo.embedUrl)
      ? parsedVideo.embedUrl
      : isAllowlistedEmbedUrl(courseUrl)
      ? courseUrl
      : '';

    try {
      if (initialData) {
        // Preserve lessons unless user explicitly chose to rebuild plan
        let updatedLessons = initialData.lessons;
        if (rebuildPlan) {
          updatedLessons = generateLessonsForCourse(initialData.id, parsedTotal, title.trim(), parsedPace);
        }

        const updated: Course = {
          ...initialData,
          title: title.trim(),
          provider: provider.trim() || 'Custom',
          course_url: courseUrl.trim(),
          embed_url: safeEmbedUrl,
          thumbnail_url: thumbnailUrl.trim() || parsedVideo?.thumbnailUrl,
          total_minutes: parsedTotal,
          daily_pace_minutes: parsedPace,
          description: description.trim(),
          status,
          lessons: updatedLessons,
          updated_at: new Date().toISOString(),
        };
        updateCourse(updated);
        if (onSuccess) onSuccess();
      } else {
        const created = addCourse({
          title: title.trim(),
          provider: provider.trim() || 'Custom',
          course_url: courseUrl.trim(),
          embed_url: safeEmbedUrl,
          thumbnail_url: thumbnailUrl.trim() || parsedVideo?.thumbnailUrl,
          total_minutes: parsedTotal,
          daily_pace_minutes: parsedPace,
          description: description.trim(),
        });
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/courses/${created.id}`);
        }
      }
    } catch {
      setActionError('Could not save this course. Check the storage warning and try again.');
      setIsSubmitting(false);
    }
  };

  const durationOrPaceChanged =
    initialData &&
    (parseInt(totalMinutes, 10) !== initialData.total_minutes ||
      parseInt(dailyPaceMinutes, 10) !== initialData.daily_pace_minutes);

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-sand-border rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-sand-border">
        <h2 className="text-lg font-bold text-charcoal-900">
          {initialData ? 'Edit Course' : 'Create Course Manually'}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {actionError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{actionError}</p>}

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-charcoal-700 mb-1">
          Course Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Master React & Next.js from Scratch"
          className="w-full text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900"
        />
        {errors.title && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.title}
          </p>
        )}
      </div>

      {/* Provider & Total Minutes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 mb-1">
            Provider / Source
          </label>
          <input
            type="text"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="e.g. YouTube, freeCodeCamp, Udemy"
            className="w-full text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-700 mb-1">
            Total Duration (minutes) *
          </label>
          <input
            type="number"
            min="1"
            value={totalMinutes}
            onChange={(e) => setTotalMinutes(e.target.value)}
            placeholder="e.g. 600 for 10 hours"
            className="w-full text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900"
          />
          {errors.totalMinutes && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.totalMinutes}
            </p>
          )}
        </div>
      </div>

      {/* Course URL & Daily Pace */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 mb-1">
            Course / Video URL
          </label>
          <input
            type="url"
            value={courseUrl}
            onBlur={handleUrlBlur}
            onChange={(e) => setCourseUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-700 mb-1">
            Daily Study Target (minutes)
          </label>
          <input
            type="number"
            min="15"
            value={dailyPaceMinutes}
            onChange={(e) => setDailyPaceMinutes(e.target.value)}
            placeholder="60"
            className="w-full text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900"
          />
        </div>
      </div>

      {/* Rebuild plan warning if duration changed during edit */}
      {durationOrPaceChanged && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span>You modified total duration or daily pace. Existing lesson progress is preserved by default.</span>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-charcoal-900 mt-1">
              <input
                type="checkbox"
                checked={rebuildPlan}
                onChange={(e) => setRebuildPlan(e.target.checked)}
                className="rounded text-forest-600"
              />
              <span>Rebuild daily plan with new duration (resets existing lesson checkmarks)</span>
            </label>
          </div>
        </div>
      )}

      {/* Thumbnail URL */}
      <div>
        <label className="block text-xs font-semibold text-charcoal-700 mb-1">
          Thumbnail URL (optional)
        </label>
        <input
          type="url"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://..."
          className="w-full text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-charcoal-700 mb-1">
          Description (optional)
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Key concepts or goals for this course..."
          className="w-full text-sm bg-cream-50 border border-sand-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900"
        />
      </div>

      {/* Status (Edit mode only) */}
      {initialData && (
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full text-sm bg-cream-50 border border-sand-border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      )}

      {/* Submit / Cancel Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-charcoal-600 hover:bg-cream-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-forest-600 hover:bg-forest-700 text-white shadow-sm disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{initialData ? 'Save Changes' : 'Create Course'}</span>
        </button>
      </div>
    </form>
  );
}

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLearning } from '@/context/LearningContext';
import { groupLessonsByDay } from '@/lib/calculations/dayPlanner';
import { calculateCourseProgress } from '@/lib/calculations/progress';
import { repository } from '@/lib/storage/repository';
import { isAllowlistedEmbedUrl, PRESET_COURSES } from '@/lib/youtube';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  ExternalLink,
  HelpCircle,
  FileText,
  Layers,
  Calendar,
  Clock,
  Check,
  ShieldAlert,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { QuizModal } from '@/components/course-player/QuizModal';
import { NotesModal } from '@/components/course-player/NotesModal';
import { FlashcardsModal } from '@/components/course-player/FlashcardsModal';
import { DayPlanModal } from '@/components/course-player/DayPlanModal';

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const {
    courses,
    enrollPreset,
    toggleLessonCompletion,
    startTimer,
    setLastActiveCourseId,
    isLoading,
  } = useLearning();

  const course = courses.find((c) => c.id === courseId);
  const matchedPreset = PRESET_COURSES.find((p) => p.key === courseId);

  // Modals state
  const [activeModal, setActiveModal] = useState<'quiz' | 'notes' | 'flashcards' | 'dayplan' | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  // Restore persisted last-selected lesson
  useEffect(() => {
    if (courseId) {
      setLastActiveCourseId(courseId);
      const savedLessonId = repository.getLastSelectedLessonId(courseId);
      if (savedLessonId) {
        setActiveLessonId(savedLessonId);
      }
    }
  }, [courseId, setLastActiveCourseId]);

  // Group lessons by Day 1, Day 2, Day 3
  const dayGroups = useMemo(() => {
    return course ? groupLessonsByDay(course.lessons) : [];
  }, [course]);

  // Current active lesson
  const currentLesson = useMemo(() => {
    if (!course || course.lessons.length === 0) return null;
    if (activeLessonId) {
      const found = course.lessons.find((l) => l.id === activeLessonId);
      if (found) return found;
    }
    // Default to first incomplete lesson or first lesson
    return course.lessons.find((l) => !l.is_completed) || course.lessons[0];
  }, [course, activeLessonId]);

  // Ensure selected day matches active lesson on first load or change
  useEffect(() => {
    if (currentLesson && currentLesson.day_number !== selectedDay) {
      setSelectedDay(currentLesson.day_number);
    }
  }, [currentLesson, selectedDay]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-3 border-forest-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-charcoal-500 font-medium font-mono">Loading course curriculum...</p>
      </div>
    );
  }

  if (!course) {
    if (matchedPreset) {
      return (
        <div className="p-8 sm:p-14 text-center flex flex-col items-center max-w-xl mx-auto my-8 bg-white border border-sand-border rounded-3xl shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 bg-sand-200 px-3.5 py-1 rounded-full mb-3">
            Featured Masterclass
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            {matchedPreset.title}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2.5 leading-relaxed">
            {matchedPreset.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-charcoal-500 font-medium">
            <span className="font-semibold text-charcoal-800">By {matchedPreset.provider}</span>
            <span>•</span>
            <span className="font-mono">{Math.round(matchedPreset.total_minutes / 60)} Hours Total</span>
            <span>•</span>
            <span>{matchedPreset.lessons.length} structured lessons</span>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => {
                enrollPreset(matchedPreset.key);
              }}
              className="w-full flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-forest-700/20 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enroll & Start Learning</span>
            </button>
            <Link
              href="/courses"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cream-50 hover:bg-cream-100 border border-sand-border text-charcoal-700 font-bold text-xs sm:text-sm transition-colors"
            >
              Browse Library
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="p-12 text-center flex flex-col items-center max-w-md mx-auto my-12 bg-white border border-sand-border rounded-3xl shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-sand-200 text-charcoal-500 flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-charcoal-900">Course Not Found</h2>
        <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
          This course ID does not exist in your local library or may have been deleted.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 w-full">
          <Link
            href="/courses"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses</span>
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-cream-100 border border-sand-border text-charcoal-700 font-bold text-xs shadow-2xs transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const progress = calculateCourseProgress(course.total_minutes, course.completed_minutes);
  const activeDayGroup = dayGroups.find((d) => d.day_number === selectedDay) || dayGroups[0];

  const handleLessonSelect = (lessonId: string) => {
    setActiveLessonId(lessonId);
    repository.setLastSelectedLessonId(course.id, lessonId);
  };

  const handleToggleCurrentCompleted = () => {
    if (currentLesson) {
      toggleLessonCompletion(course.id, currentLesson.id);

      // If auto-advance is enabled and marking complete, move to next lesson
      if (!currentLesson.is_completed && autoAdvance) {
        const nextIdx = course.lessons.findIndex((l) => l.id === currentLesson.id) + 1;
        if (nextIdx < course.lessons.length) {
          const nextLesson = course.lessons[nextIdx];
          setActiveLessonId(nextLesson.id);
          repository.setLastSelectedLessonId(course.id, nextLesson.id);
          setSelectedDay(nextLesson.day_number);
        }
      }
    }
  };

  const handleStartFocusTimer = () => {
    if (currentLesson) {
      startTimer(course.id, currentLesson.id);
    } else {
      startTimer(course.id);
    }
  };

  // Video embed source with start offset
  const isEmbedAllowlisted = isAllowlistedEmbedUrl(course.embed_url);
  const videoStartSec = currentLesson?.video_start_seconds || 0;
  const videoSrc = course.embed_url.includes('?')
    ? `${course.embed_url}&start=${videoStartSec}&autoplay=1`
    : `${course.embed_url}?start=${videoStartSec}&autoplay=1`;

  const totalLessons = course.lessons.length;
  const currentLessonIndex = currentLesson
    ? course.lessons.findIndex((l) => l.id === currentLesson.id) + 1
    : 1;

  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-20 bg-cream-50/95 backdrop-blur-md border-b border-sand-border px-4 lg:px-8 py-3 flex flex-col items-stretch sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/courses"
            className="p-2 rounded-xl border border-sand-border hover:bg-cream-100 text-charcoal-600 transition-colors shrink-0"
            title="Back to Courses"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-charcoal-500 font-medium">
              <Link href="/courses" className="hover:text-charcoal-800">Courses</Link>
              <ChevronRight className="w-3 h-3 text-charcoal-400" />
              <span className="truncate max-w-[180px] sm:max-w-xs">{course.title}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-xs sm:text-sm font-bold text-charcoal-900 truncate">
                {currentLesson?.title || course.title}
              </h1>
              <span className="hidden sm:inline-block font-mono text-[11px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-200">
                {progress.percentage}% completed
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 shrink-0">
          <button
            onClick={() => setActiveModal('dayplan')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sand-border bg-white hover:bg-cream-100 text-charcoal-700 font-semibold text-xs transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-forest-600" />
            <span>Day Plan</span>
          </button>

          <button
            onClick={handleToggleCurrentCompleted}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              currentLesson?.is_completed
                ? 'bg-cream-200 text-forest-800 border border-forest-300'
                : 'bg-forest-600 hover:bg-forest-700 text-white'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{currentLesson?.is_completed ? 'Completed ✓' : 'Mark as completed'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 xl:px-8 py-6 grid grid-cols-1 xl:grid-cols-12 gap-6 min-w-0">
        {/* Left Column: Video Cinema Player & Lesson Details */}
        <div className="xl:col-span-8 flex flex-col gap-4 min-w-0">
          {/* Cinema 16:9 Video Player */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-charcoal-900 shadow-md border border-charcoal-800">
            {/* Branded Fallback / Loading Background */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-black text-cream-100 z-0 select-none">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-3">
                <Play className="w-5 h-5 fill-current ml-0.5 text-forest-400" />
              </div>
              <h3 className="text-sm font-bold max-w-md line-clamp-1">
                {currentLesson?.title || course.title}
              </h3>
              <p className="text-xs text-charcoal-400 mt-1">
                {course.provider} • Day {currentLesson?.day_number || 1}
              </p>
              {course.course_url && (
                <a
                  href={course.course_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-100 text-xs font-semibold border border-white/15 transition-colors"
                >
                  <span>Open source video on {course.provider}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {isEmbedAllowlisted ? (
              <iframe
                src={videoSrc}
                title={currentLesson?.title || course.title}
                className="relative z-10 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="relative z-10 w-full h-full bg-charcoal-900 text-cream-100 p-8 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-10 h-10 text-amber-400 mb-2" />
                <h3 className="text-sm font-bold">External Course Link</h3>
                <p className="text-xs text-cream-300 max-w-sm mt-1">
                  This course is hosted on an external provider. For your security, open it directly in a new browser tab.
                </p>
                {course.course_url && (
                  <a
                    href={course.course_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold transition-all"
                  >
                    <span>Open Lesson on {course.provider}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {isEmbedAllowlisted && course.course_url && (
            <p className="-mt-2 px-1 text-xs text-charcoal-500">
              If playback is unavailable, <a href={course.course_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-700 underline underline-offset-2">open the source video</a>.
            </p>
          )}

          {/* Under-Video Focus Control & Curriculum Meta */}
          <div className="bg-white border border-sand-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-sand-border">
              <div>
                <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wider bg-forest-50 px-2.5 py-0.5 rounded-md border border-forest-200">
                  Day {currentLesson?.day_number || 1} • Lesson {currentLessonIndex} of {totalLessons}
                </span>
                <h2 className="text-base sm:text-xl font-extrabold text-charcoal-900 mt-2 tracking-tight">
                  {currentLesson?.title || 'Lesson Overview'}
                </h2>
              </div>

              {/* Completion CTA & Auto-Advance */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleCurrentCompleted}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    currentLesson?.is_completed
                      ? 'bg-forest-600 text-white shadow-xs'
                      : 'bg-cream-100 hover:bg-forest-50 text-charcoal-800 border border-sand-border'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{currentLesson?.is_completed ? 'Completed ✓' : 'Mark as completed'}</span>
                </button>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-charcoal-600 font-medium shrink-0">
                  <span>Auto-advance</span>
                  <input
                    type="checkbox"
                    checked={autoAdvance}
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                    className="rounded text-forest-600 focus:ring-forest-600 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Provider and Quick Focus Timer CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-charcoal-700">
                <span className="font-semibold text-charcoal-900">{course.provider}</span>
                {course.course_url && (
                  <a
                    href={course.course_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-700 hover:underline font-semibold ml-2"
                  >
                    <span>Original Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <button
                onClick={handleStartFocusTimer}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 border border-forest-200 text-forest-800 font-bold text-xs transition-colors shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5 text-forest-600" />
                <span>Focus timer on this lesson</span>
              </button>
            </div>

            {course.description && (
              <p className="text-xs text-charcoal-600 leading-relaxed pt-3 border-t border-sand-border/60">
                {course.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Day Tabs, Lessons List & Study Dock */}
        <div className="xl:col-span-4 flex flex-col gap-4 min-w-0">
          <div className="bg-white border border-sand-border rounded-3xl p-5 shadow-xs flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-sand-border">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-charcoal-900 truncate">
                  Course Curriculum
                </h3>
                <span className="text-[11px] text-charcoal-500 font-mono">
                  Lesson {currentLessonIndex} of {totalLessons} total
                </span>
              </div>
              <span className="text-xs font-bold text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200 font-mono">
                {progress.percentage}%
              </span>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar border-b border-sand-border/70">
              {dayGroups.map((group) => {
                const isSelected = selectedDay === group.day_number;
                return (
                  <button
                    key={group.day_number}
                    onClick={() => setSelectedDay(group.day_number)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-forest-700 text-white shadow-2xs'
                        : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
                    }`}
                  >
                    <span>Day {group.day_number}</span>
                    {group.is_completed && <span className="text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Lessons List for Selected Day */}
            <div className="flex flex-col gap-2 py-3.5 max-h-[380px] overflow-y-auto pr-1">
              {activeDayGroup ? (
                activeDayGroup.lessons.map((lesson) => {
                  const isActive = currentLesson?.id === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson.id)}
                      className={`flex items-center justify-between gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'border-forest-600 bg-forest-50/70 shadow-2xs ring-1 ring-forest-600'
                          : 'border-sand-border/70 bg-cream-50/50 hover:bg-cream-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLessonCompletion(course.id, lesson.id);
                          }}
                          aria-label={lesson.is_completed ? 'Mark incomplete' : 'Mark complete'}
                          className="shrink-0 p-0.5 text-charcoal-400 hover:text-forest-600"
                        >
                          {lesson.is_completed ? (
                            <CheckCircle2 className="w-4 h-4 text-forest-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-charcoal-300" />
                          )}
                        </button>

                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-xs font-semibold line-clamp-1 ${
                              isActive ? 'text-forest-900 font-bold' : 'text-charcoal-800'
                            } ${lesson.is_completed ? 'line-through opacity-70' : ''}`}
                            title={lesson.title}
                          >
                            {lesson.title}
                          </span>
                          <span className="text-[10px] text-charcoal-400 font-mono">
                            {lesson.duration_minutes} min
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-forest-600 shrink-0" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-charcoal-400 text-center py-4">
                  No lessons found for this day.
                </div>
              )}
            </div>

            {/* Study Tools Dock */}
            <div className="pt-3.5 border-t border-sand-border">
              <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block mb-2.5">
                Active Study Tools
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Quiz Tool */}
                <button
                  type="button"
                  onClick={() => setActiveModal('quiz')}
                  className="bg-cream-50/70 hover:bg-forest-50/70 border border-sand-border rounded-2xl p-3 text-left transition-all duration-200 flex flex-col justify-between group hover:border-forest-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-7 h-7 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-charcoal-400 group-hover:text-forest-700 font-mono">→</span>
                  </div>
                  <div className="mt-2.5">
                    <div className="text-xs font-bold text-charcoal-900">Recall Quiz</div>
                    <div className="text-[10px] text-charcoal-500">
                      {course.quizzes?.length || 2} questions
                    </div>
                  </div>
                </button>

                {/* Smart Notes Tool */}
                <button
                  type="button"
                  onClick={() => setActiveModal('notes')}
                  className="bg-cream-50/70 hover:bg-forest-50/70 border border-sand-border rounded-2xl p-3 text-left transition-all duration-200 flex flex-col justify-between group hover:border-forest-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-7 h-7 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-charcoal-400 group-hover:text-forest-700 font-mono">→</span>
                  </div>
                  <div className="mt-2.5">
                    <div className="text-xs font-bold text-charcoal-900">Smart Notes</div>
                    <div className="text-[10px] text-charcoal-500">
                      {course.notes?.length || 0} saved
                    </div>
                  </div>
                </button>

                {/* Day Plan Tool */}
                <button
                  type="button"
                  onClick={() => setActiveModal('dayplan')}
                  className="bg-cream-50/70 hover:bg-forest-50/70 border border-sand-border rounded-2xl p-3 text-left transition-all duration-200 flex flex-col justify-between group hover:border-forest-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-7 h-7 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-charcoal-400 group-hover:text-forest-700 font-mono">→</span>
                  </div>
                  <div className="mt-2.5">
                    <div className="text-xs font-bold text-charcoal-900">Day Plan</div>
                    <div className="text-[10px] text-charcoal-500">Daily syllabus</div>
                  </div>
                </button>

                {/* Flashcards Tool */}
                <button
                  type="button"
                  onClick={() => setActiveModal('flashcards')}
                  className="bg-cream-50/70 hover:bg-forest-50/70 border border-sand-border rounded-2xl p-3 text-left transition-all duration-200 flex flex-col justify-between group hover:border-forest-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-7 h-7 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-charcoal-400 group-hover:text-forest-700 font-mono">→</span>
                  </div>
                  <div className="mt-2.5">
                    <div className="text-xs font-bold text-charcoal-900">Flashcards</div>
                    <div className="text-[10px] text-charcoal-500">Key concepts</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      {activeModal === 'quiz' && (
        <QuizModal
          quizzes={course.quizzes}
          courseTitle={course.title}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'notes' && (
        <NotesModal
          courseId={course.id}
          lessonId={currentLesson?.id}
          lessonTitle={currentLesson?.title}
          notes={course.notes}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'flashcards' && (
        <FlashcardsModal
          flashcards={course.flashcards}
          courseTitle={course.title}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'dayplan' && (
        <DayPlanModal
          course={course}
          onClose={() => setActiveModal(null)}
          onStartLearning={() => {
            setActiveModal(null);
            handleStartFocusTimer();
          }}
        />
      )}
    </div>
  );
}

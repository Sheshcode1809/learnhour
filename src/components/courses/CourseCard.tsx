'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { calculateCourseProgress } from '@/lib/calculations/progress';
import {
  Play,
  MoreVertical,
  Clock,
  CheckCircle2,
  Archive,
  Trash2,
  Edit,
  RotateCcw,
  Timer,
  Check,
} from 'lucide-react';
import { useLearning } from '@/context/LearningContext';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const { updateCourse, startTimer } = useLearning();
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);

  const progress = calculateCourseProgress(course.total_minutes, course.completed_minutes);

  const handleToggleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = course.status === 'archived' ? 'active' : 'archived';
    updateCourse({ ...course, status: nextStatus, updated_at: new Date().toISOString() });
    setShowMenu(false);
  };

  const handleStartCourseTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTimer(course.id);
    setShowMenu(false);
  };

  return (
    <div className="bg-white border border-sand-border rounded-2xl overflow-hidden shadow-2xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Course Thumbnail & Badges */}
        <div className="relative aspect-video w-full bg-cream-200 overflow-hidden">
          {course.thumbnail_url && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail_url}
              alt={course.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cream-100 via-sand-100 to-cream-200 p-4 text-center select-none">
              <div className="w-11 h-11 rounded-2xl bg-forest-600 text-white flex items-center justify-center font-black text-sm mb-1.5 shadow-sm">
                {course.title.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-xs font-bold text-charcoal-800 line-clamp-1 max-w-[90%]">
                {course.title}
              </p>
              <span className="text-[11px] font-semibold text-charcoal-500 mt-0.5">
                {course.provider || 'Learnhour'}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Provider Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="bg-charcoal-900/80 backdrop-blur-xs text-cream-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
              {course.provider}
            </span>
            {progress.isCompleted && (
              <span className="bg-forest-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" /> Done
              </span>
            )}
          </div>

          {/* Quick Menu */}
          <div className="absolute top-3 right-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Course options"
                className="w-7 h-7 rounded-lg bg-charcoal-900/80 backdrop-blur-xs text-cream-100 flex items-center justify-center hover:bg-black transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  onMouseLeave={() => setShowMenu(false)}
                  className="absolute right-0 mt-1 w-40 bg-white border border-sand-border rounded-xl shadow-lg py-1 z-20 text-xs text-charcoal-700 animate-in fade-in zoom-in-95"
                >
                  <button
                    onClick={handleStartCourseTimer}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-cream-100 font-medium text-forest-800"
                  >
                    <Timer className="w-3.5 h-3.5 text-forest-600" />
                    <span>Start Timer</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(course);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-cream-100"
                  >
                    <Edit className="w-3.5 h-3.5 text-charcoal-500" />
                    <span>Edit details</span>
                  </button>
                  <button
                    onClick={handleToggleArchive}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-cream-100"
                  >
                    {course.status === 'archived' ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-charcoal-500" />
                        <span>Restore course</span>
                      </>
                    ) : (
                      <>
                        <Archive className="w-3.5 h-3.5 text-charcoal-500" />
                        <span>Archive course</span>
                      </>
                    )}
                  </button>
                  <div className="my-1 border-t border-sand-border/70" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(course);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2.5 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-cream-200" />
            <span>{progress.formattedTotal}</span>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-4 flex flex-col gap-2">
          <Link
            href={`/courses/${course.id}`}
            className="text-sm font-bold text-charcoal-900 hover:text-forest-700 line-clamp-2 leading-snug transition-colors"
            title={course.title}
          >
            {course.title}
          </Link>

          {course.description && (
            <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          )}

          {/* Progress Bar & Stats */}
          <div className="mt-2 pt-2 border-t border-sand-border/70 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal-800 font-mono">
                {progress.percentage}%
              </span>
              <span className="text-charcoal-500 text-[11px] font-mono">
                {progress.remainingMinutes === 0 ? 'Completed' : `${progress.formattedRemaining} left`}
              </span>
            </div>

            <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress.isCompleted ? 'bg-forest-600' : 'bg-forest-500'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-charcoal-500 mt-1">
              <span>{course.lessons.length} lessons</span>
              <span className="font-medium text-charcoal-600">~{course.daily_pace_minutes}m / day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <Link
          href={`/courses/${course.id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sand-200/80 hover:bg-forest-600 hover:text-white text-charcoal-800 font-bold text-xs transition-all border border-sand-border shadow-2xs active:scale-[0.98]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{progress.percentage > 0 ? 'Resume Course' : 'Start Course'}</span>
        </Link>
      </div>
    </div>
  );
}

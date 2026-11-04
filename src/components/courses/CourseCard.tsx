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

  return (
    <div className="bg-white border border-sand-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Course Thumbnail & Badges */}
        <div className="relative aspect-video w-full bg-cream-200 overflow-hidden">
          {course.thumbnail_url && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail_url}
              alt={course.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
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
                {course.provider || 'Courseit'}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Provider Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-charcoal-900/80 backdrop-blur-xs text-cream-100 text-[10px] font-semibold px-2 py-0.5 rounded-md">
              {course.provider}
            </span>
          </div>

          {/* Quick Menu */}
          <div className="absolute top-3 right-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Course options"
                className="w-7 h-7 rounded-lg bg-charcoal-900/80 backdrop-blur-xs text-cream-100 flex items-center justify-center hover:bg-black"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  onMouseLeave={() => setShowMenu(false)}
                  className="absolute right-0 mt-1 w-36 bg-white border border-sand-border rounded-xl shadow-lg py-1 z-20 text-xs text-charcoal-700 animate-in fade-in zoom-in-95"
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(course);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-cream-100"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleToggleArchive}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-cream-100"
                  >
                    {course.status === 'archived' ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </>
                    ) : (
                      <>
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive</span>
                      </>
                    )}
                  </button>
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
          <div className="absolute bottom-2.5 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            <span>{progress.formattedTotal}</span>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-4 flex flex-col gap-2">
          <Link
            href={`/courses/${course.id}`}
            className="text-sm font-bold text-charcoal-900 hover:text-forest-700 line-clamp-2 leading-snug"
            title={course.title}
          >
            {course.title}
          </Link>

          {course.description && (
            <p className="text-xs text-charcoal-500 line-clamp-2">
              {course.description}
            </p>
          )}

          {/* Progress Bar & Stats */}
          <div className="mt-2 pt-2 border-t border-sand-border/70 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-charcoal-700">
                {progress.percentage}% complete
              </span>
              <span className="text-charcoal-500 text-[11px]">
                {progress.remainingMinutes === 0 ? 'Completed' : `${progress.formattedRemaining} left`}
              </span>
            </div>

            <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progress.isCompleted ? 'bg-forest-600' : 'bg-forest-500'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-charcoal-500 mt-1">
              <span>{course.lessons.length} lessons</span>
              <span>~{course.daily_pace_minutes}m/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <Link
          href={`/courses/${course.id}`}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sand-100 hover:bg-forest-50 hover:text-forest-700 text-charcoal-800 font-semibold text-xs transition-colors border border-sand-border"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{progress.percentage > 0 ? 'Continue learning' : 'Start learning'}</span>
        </Link>
      </div>
    </div>
  );
}


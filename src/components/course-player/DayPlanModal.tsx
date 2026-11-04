'use client';

import React from 'react';
import { Course } from '@/types';
import { groupLessonsByDay } from '@/lib/calculations/dayPlanner';
import { calculateCourseProgress } from '@/lib/calculations/progress';
import { X, CheckCircle2, Circle, Play, Calendar, Clock, Flame } from 'lucide-react';
import { useLearning } from '@/context/LearningContext';

interface DayPlanModalProps {
  course: Course;
  onClose: () => void;
  onStartLearning: () => void;
}

export function DayPlanModal({ course, onClose, onStartLearning }: DayPlanModalProps) {
  const { toggleLessonCompletion, updateCourse } = useLearning();

  const dayGroups = groupLessonsByDay(course.lessons);
  const completedLessonsCount = course.lessons.filter((l) => l.is_completed).length;
  const progress = calculateCourseProgress(course.total_minutes, course.completed_minutes);

  const handlePaceChange = (pace: number) => {
    updateCourse({ ...course, daily_pace_minutes: pace });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-cream-50 border border-sand-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-sand-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2 py-0.5 rounded-full">
              Ready to Personalize
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 mt-1">
              You know {completedLessonsCount} of {course.lessons.length} lessons.
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Review what you already know or adjust your daily pace.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Pills matching frame 011 */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <div className="bg-[#DCE7D6] border border-[#BFD4B6] rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-forest-800 uppercase tracking-wider">
              Daily Target
            </span>
            <div className="text-2xl sm:text-3xl font-black text-forest-900 mt-1">
              {course.daily_pace_minutes}m
            </div>
            <span className="text-[10px] text-forest-700 mt-1">Recommended pace</span>
          </div>

          <div className="bg-[#DCE7D6] border border-[#BFD4B6] rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-forest-800 uppercase tracking-wider">
              Remaining
            </span>
            <div className="text-2xl sm:text-3xl font-black text-forest-900 mt-1">
              {progress.formattedRemaining}
            </div>
            <span className="text-[10px] text-forest-700 mt-1">
              ~{Math.ceil(progress.remainingMinutes / course.daily_pace_minutes)} study days
            </span>
          </div>
        </div>

        {/* Pace Selector */}
        <div className="flex items-center gap-2 pb-4">
          <span className="text-xs font-bold text-charcoal-700">Daily Pace:</span>
          {[30, 45, 60, 90].map((pace) => (
            <button
              key={pace}
              type="button"
              onClick={() => handlePaceChange(pace)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                course.daily_pace_minutes === pace
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'bg-white border border-sand-border text-charcoal-700 hover:bg-cream-100'
              }`}
            >
              {pace}m a day
            </button>
          ))}
        </div>

        {/* Day-Wise Schedule Breakdown */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 py-2 border-t border-sand-border">
          <span className="text-xs font-bold text-charcoal-800">Day-Wise Curriculum</span>
          {dayGroups.map((group) => (
            <div
              key={group.day_number}
              className="bg-white border border-sand-border rounded-2xl p-4 flex flex-col gap-2 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-sand-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-forest-800 bg-forest-100 px-2 py-0.5 rounded">
                    Day {group.day_number}
                  </span>
                  <span className="text-xs text-charcoal-500 font-medium">
                    {group.lessons.length} lessons • ~{group.total_minutes}m
                  </span>
                </div>
                {group.is_completed && (
                  <span className="text-[10px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Day Complete
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                {group.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => toggleLessonCompletion(course.id, lesson.id)}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-cream-100 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {lesson.is_completed ? (
                        <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-charcoal-300 shrink-0" />
                      )}
                      <span className={`truncate ${lesson.is_completed ? 'line-through text-charcoal-400' : 'text-charcoal-800 font-medium'}`}>
                        {lesson.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-charcoal-400 shrink-0">
                      {lesson.duration_minutes}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-sand-border flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-cream-200"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onStartLearning();
            }}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-forest-600 hover:bg-forest-700 text-white shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start learning</span>
          </button>
        </div>
      </div>
    </div>
  );
}


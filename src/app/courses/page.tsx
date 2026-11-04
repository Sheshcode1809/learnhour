'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLearning } from '@/context/LearningContext';
import { Course, CourseStatus } from '@/types';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseForm } from '@/components/courses/CourseForm';
import { PRESET_COURSES } from '@/lib/youtube';
import {
  Plus,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function CoursesPage() {
  const { courses, deleteCourse, enrollPreset } = useLearning();

  const [activeTab, setActiveTab] = useState<'all' | CourseStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Tab filter
      if (activeTab !== 'all' && course.status !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          course.title.toLowerCase().includes(q) ||
          course.provider.toLowerCase().includes(q) ||
          course.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [courses, activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: courses.length,
      active: courses.filter((c) => c.status === 'active').length,
      completed: courses.filter((c) => c.status === 'completed').length,
      archived: courses.filter((c) => c.status === 'archived').length,
    };
  }, [courses]);

  const confirmDelete = () => {
    if (deletingCourse) {
      deleteCourse(deletingCourse.id);
      setDeletingCourse(null);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 flex flex-col gap-6 min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-sand-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              My Courses
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sand-200 text-charcoal-700 font-mono">
              {courses.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Turn long tutorials and multi-hour lectures into steady 1-hour daily progress.
          </p>
        </div>

        <Link
          href="/courses/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 active:bg-forest-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New course</span>
        </Link>
      </div>

      {/* Search & Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 min-w-0">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-cream-200/80 rounded-xl border border-sand-border overflow-x-auto text-xs font-semibold max-w-full min-w-0 shadow-2xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white text-forest-800 font-bold shadow-2xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'active'
                ? 'bg-white text-forest-800 font-bold shadow-2xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Active ({counts.active})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'completed'
                ? 'bg-white text-forest-800 font-bold shadow-2xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Completed ({counts.completed})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'archived'
                ? 'bg-white text-forest-800 font-bold shadow-2xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Archived ({counts.archived})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses or topics..."
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 bg-white border border-sand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-800 placeholder:text-charcoal-400 font-medium"
          />
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={(c) => setEditingCourse(c)}
              onDelete={(c) => setDeletingCourse(c)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-sand-border rounded-3xl p-10 sm:p-12 text-center flex flex-col items-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-cream-200 text-charcoal-600 flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7 text-forest-700" />
          </div>
          <h3 className="font-extrabold text-lg text-charcoal-900">
            {searchQuery ? 'No matching courses' : 'Your course library is empty'}
          </h3>
          <p className="text-xs text-charcoal-500 mt-1.5 max-w-sm leading-relaxed">
            {searchQuery
              ? `No course matched "${searchQuery}". Try a different search term or clear the filter.`
              : activeTab === 'archived'
              ? 'No courses are currently archived.'
              : 'Add your own tutorial via URL or pick one of our partitioned masterclasses below to begin.'}
          </p>

          {!searchQuery && activeTab !== 'archived' && (
            <div className="mt-6 flex flex-col gap-2.5 w-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                Quick-Enroll Curated Masterclass:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {PRESET_COURSES.slice(0, 2).map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => enrollPreset(preset.key)}
                    className="p-3 rounded-xl border border-sand-border bg-cream-50 hover:bg-forest-50 text-left transition-colors flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-charcoal-800 line-clamp-1">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-forest-700 font-semibold mt-1 flex items-center gap-1">
                      <span>Enroll in {Math.round(preset.total_minutes / 60)}h course</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Link
            href="/courses/new"
            className="mt-6 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-forest-600 text-white font-bold text-xs shadow-sm hover:bg-forest-700 transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Course</span>
          </Link>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CourseForm
              initialData={editingCourse}
              onSuccess={() => setEditingCourse(null)}
              onCancel={() => setEditingCourse(null)}
            />
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-sand-border rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Delete Course?</h3>
            <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-charcoal-900">{deletingCourse.title}</span>? This will remove the course and its lesson plan. Saved learning sessions will be preserved.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all active:scale-[0.98]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLearning } from '@/context/LearningContext';
import { Course, CourseStatus } from '@/types';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseForm } from '@/components/courses/CourseForm';
import {
  Plus,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
} from 'lucide-react';

export default function CoursesPage() {
  const { courses, deleteCourse } = useLearning();

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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              My Courses
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sand-200 text-charcoal-700">
              {courses.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Turn long tutorials and playlists into steady 1-hour daily progress.
          </p>
        </div>

        <Link
          href="/courses/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New course</span>
        </Link>
      </div>

      {/* Search & Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 min-w-0">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-cream-200/80 rounded-xl border border-sand-border overflow-x-auto text-xs font-medium max-w-full min-w-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white text-forest-800 font-bold shadow-2xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'active'
                ? 'bg-white text-forest-800 font-bold shadow-2xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Active ({counts.active})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'completed'
                ? 'bg-white text-forest-800 font-bold shadow-2xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Completed ({counts.completed})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
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
            placeholder="Search courses..."
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 bg-white border border-sand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-800 placeholder:text-charcoal-400"
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
        <div className="bg-white border border-sand-border rounded-2xl p-12 text-center flex flex-col items-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-cream-200 text-charcoal-500 flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-charcoal-800">No courses found</h3>
          <p className="text-xs text-charcoal-500 mt-1 max-w-sm">
            {searchQuery
              ? `No course matched "${searchQuery}". Try a different search.`
              : activeTab === 'archived'
              ? 'No archived courses.'
              : 'You have not added any courses yet. Add your first course or paste a YouTube video to get started.'}
          </p>
          <Link
            href="/courses/new"
            className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-600 text-white font-semibold text-xs shadow-sm hover:bg-forest-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add course</span>
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
          <div className="bg-white border border-sand-border rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Delete Course?</h3>
            <p className="text-xs text-charcoal-600 mt-1">
              Are you sure you want to delete <span className="font-semibold">{deletingCourse.title}</span>? This will remove the course and its lesson plan. Saved learning sessions will be preserved.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
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


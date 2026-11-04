'use client';

import React, { useState } from 'react';
import { CourseNote } from '@/types';
import { X, Plus, Clock, FileText, Check } from 'lucide-react';
import { useLearning } from '@/context/LearningContext';
import { formatSeconds } from '@/lib/calculations/progress';

interface NotesModalProps {
  courseId: string;
  lessonId?: string;
  lessonTitle?: string;
  notes?: CourseNote[];
  onClose: () => void;
}

export function NotesModal({ courseId, lessonId, lessonTitle, notes = [], onClose }: NotesModalProps) {
  const { addCourseNote } = useLearning();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [timestampMinutes, setTimestampMinutes] = useState('0');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const parsedMin = parseInt(timestampMinutes, 10);
    const totalSecs = isNaN(parsedMin) || parsedMin < 0 ? null : parsedMin * 60;

    addCourseNote(courseId, {
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      timestamp_seconds: totalSecs,
      lesson_id: lessonId,
    });

    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-cream-50 border border-sand-border rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal-900">Course Notes</h2>
              <p className="text-[11px] text-charcoal-500">
                {lessonTitle ? `Pinned to: ${lessonTitle}` : 'Course & lesson notes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notes List / Form */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
          {isAdding ? (
            <form onSubmit={handleAddNote} className="bg-white border border-sand-border rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal-800">Add Lesson Note</span>
                <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
                  <Clock className="w-3.5 h-3.5 text-forest-600" />
                  <label className="text-[11px] font-medium">Offset (min):</label>
                  <input
                    type="number"
                    min="0"
                    value={timestampMinutes}
                    onChange={(e) => setTimestampMinutes(e.target.value)}
                    className="w-14 px-1.5 py-0.5 text-xs border border-sand-border rounded bg-cream-50 font-mono text-center"
                  />
                </div>
              </div>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Key concept or takeaway title..."
                className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl px-3 py-2 text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600 font-semibold"
              />

              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Key insight, code snippet, or reflection..."
                className="w-full text-xs bg-cream-50 border border-sand-border rounded-xl p-3 text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-charcoal-600 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save note</span>
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-3 border border-dashed border-sand-border hover:border-forest-600 rounded-xl bg-white hover:bg-forest-50/40 text-forest-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add note for this lesson</span>
            </button>
          )}

          {notes.length > 0 ? (
            <div className="flex flex-col gap-2 mt-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white border border-sand-border rounded-xl p-3.5 flex flex-col gap-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-charcoal-900">{note.title}</span>
                    {note.timestamp_seconds !== null && note.timestamp_seconds !== undefined && (
                      <span className="text-[10px] font-mono bg-cream-200 text-charcoal-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatSeconds(note.timestamp_seconds)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-600 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !isAdding && (
              <div className="text-center py-8 text-xs text-charcoal-400">
                No notes saved yet. Add your first note while learning.
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-sand-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cream-200 hover:bg-cream-300 text-charcoal-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

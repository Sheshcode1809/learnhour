'use client';

import React, { useState } from 'react';
import { Flashcard } from '@/types';
import { X, Layers, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface FlashcardsModalProps {
  flashcards?: Flashcard[];
  courseTitle: string;
  onClose: () => void;
}

export function FlashcardsModal({ flashcards = [], courseTitle, onClose }: FlashcardsModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cards: Flashcard[] = flashcards.length > 0 ? flashcards : [
    {
      id: 'fc-def-1',
      course_id: '',
      concept: 'Spaced Repetition',
      definition: 'A learning technique that incorporates increasing intervals of time between subsequent review of previously learned material.'
    },
    {
      id: 'fc-def-2',
      course_id: '',
      concept: 'The 1-Hour Habit Rule',
      definition: 'Studying for 60 focused minutes every single day outperforms sporadic 8-hour weekend cram sessions by maintaining constant neural activation.'
    }
  ];

  const currentCard = cards[currentIdx];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-cream-50 border border-sand-border rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal-900">Flashcards</h2>
              <p className="text-[11px] text-charcoal-500">Key ideas & spaced repetition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body with Flip interaction */}
        <div className="py-6 flex flex-col items-center">
          <div className="text-xs text-charcoal-400 font-semibold mb-3">
            Card {currentIdx + 1} of {cards.length}
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full aspect-[4/3] bg-white border border-sand-border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group"
          >
            <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-charcoal-400 flex items-center gap-1 group-hover:text-forest-600">
              <RotateCw className="w-3 h-3" />
              <span>Click to flip</span>
            </span>

            {!isFlipped ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-forest-700 font-bold bg-forest-50 px-2 py-0.5 rounded">
                  Concept
                </span>
                <h3 className="text-lg font-extrabold text-charcoal-900 px-2">
                  {currentCard.concept}
                </h3>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 animate-in fade-in">
                <span className="text-[11px] uppercase tracking-wider text-terracotta-600 font-bold bg-terracotta-50 px-2 py-0.5 rounded">
                  Definition
                </span>
                <p className="text-xs text-charcoal-700 leading-relaxed px-2">
                  {currentCard.definition}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="pt-3 border-t border-sand-border flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-cream-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-forest-700 bg-forest-50 hover:bg-forest-100"
          >
            Flip
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

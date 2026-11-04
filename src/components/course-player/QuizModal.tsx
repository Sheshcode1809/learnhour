'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/types';
import { X, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface QuizModalProps {
  quizzes?: QuizQuestion[];
  courseTitle: string;
  onClose: () => void;
}

export function QuizModal({ quizzes = [], courseTitle, onClose }: QuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Fallback default questions if course has no custom quiz
  const questions: QuizQuestion[] = quizzes.length > 0 ? quizzes : [
    {
      id: 'default-1',
      question: 'What is the most effective approach to mastering a 10+ hour course?',
      options: [
        'Binge-watch the entire course in one sitting without taking notes.',
        'Study consistently for 60 minutes a day, practice code, and test retention.',
        'Watch at 2.5x speed without practicing.',
        'Skip directly to the final project without understanding core concepts.'
      ],
      correctIndex: 1,
      explanation: 'Consistent spaced practice (e.g. 1 hour a day) provides the highest retention and skill mastery over long courses.'
    },
    {
      id: 'default-2',
      question: 'Why should you test yourself with quizzes after studying a lecture?',
      options: [
        'Active recall strengthens neural pathways more than passive re-reading.',
        'It fills out your certificate.',
        'It makes the video stream faster.',
        'It resets your streak counter.'
      ],
      correctIndex: 0,
      explanation: 'Active recall and self-testing force your brain to retrieve knowledge, significantly boosting long-term memory.'
    }
  ];

  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-cream-50 border border-sand-border rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-border">
          <div>
            <div className="text-[10px] font-bold text-forest-700 tracking-wider uppercase">
              Knowledge Check
            </div>
            <h2 className="text-base font-bold text-charcoal-900">Quiz</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4">
          {!completed ? (
            <div className="flex flex-col gap-4">
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs text-charcoal-500 font-medium">
                <span>Question {currentIdx + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>

              {/* Question prompt */}
              <h3 className="text-sm font-semibold text-charcoal-900 leading-snug">
                {currentIdx + 1}. {currentQ.question}
              </h3>

              {/* Options */}
              <div className="flex flex-col gap-2 mt-1">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let style = 'bg-white border-sand-border text-charcoal-800 hover:bg-cream-100';
                  if (isSelected && !isSubmitted) {
                    style = 'bg-forest-50 border-forest-600 text-forest-900 ring-1 ring-forest-600 font-medium';
                  } else if (isSubmitted) {
                    if (isCorrect) {
                      style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-400';
                    } else {
                      style = 'bg-white/60 border-sand-border text-charcoal-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${style}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current shrink-0 flex items-center justify-center text-[10px] font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown upon submission, exactly like video frame 018) */}
              {isSubmitted && (
                <div className={`p-3.5 rounded-xl text-xs border animate-in fade-in ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-sand-100 border-sand-border text-charcoal-800'
                }`}>
                  <div className="font-bold mb-0.5">
                    {selectedOption === currentQ.correctIndex ? '✓ Correct!' : 'Explanation:'}
                  </div>
                  <div>{currentQ.explanation}</div>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">Quiz Completed!</h3>
              <p className="text-xs text-charcoal-600 max-w-xs">
                You scored <span className="font-bold text-forest-700">{score}</span> out of <span className="font-bold">{questions.length}</span> questions.
              </p>
              <div className="w-full bg-cream-200 h-2.5 rounded-full overflow-hidden mt-2 max-w-xs">
                <div
                  className="bg-forest-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.round((score / questions.length) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-sand-border flex items-center justify-between">
          {!completed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-800"
              >
                Close
              </button>

              {!isSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white disabled:opacity-50 transition-all shadow-xs"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white transition-all shadow-xs"
                >
                  {currentIdx < questions.length - 1 ? 'Next Question →' : 'View Results'}
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-cream-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Course, LearningSession, UserPreferences, ActiveTimerState, CourseLesson, CourseNote } from '@/types';
import { repository } from '@/lib/storage/repository';
import { calculateStreaks, getWeeklyActivity } from '@/lib/calculations/streaks';
import { generateLessonsForCourse } from '@/lib/calculations/dayPlanner';
import { PRESET_COURSES } from '@/lib/youtube';
import { INITIAL_PREFERENCES } from '@/lib/storage/mockData';
import { canSwitchTimerTarget, getElapsedTimerSeconds, pauseTimerState, resumeTimerState, startTimerState, timerTargetMatches } from '@/lib/calculations/timer';

interface LearningContextType {
  courses: Course[];
  sessions: LearningSession[];
  preferences: UserPreferences;
  activeTimer: ActiveTimerState;
  elapsedSeconds: number;
  timerNotice: string | null;
  storageWarning: string | null;
  lastActiveCourse: Course | null;
  isLoading: boolean;
  
  // Course actions
  addCourse: (courseData: {
    id?: string;
    title: string;
    provider?: string;
    course_url: string;
    embed_url?: string;
    thumbnail_url?: string;
    description?: string;
    total_minutes: number;
    daily_pace_minutes?: number;
    lessons?: CourseLesson[];
    quizzes?: Course['quizzes'];
    flashcards?: Course['flashcards'];
    notes?: Course['notes'];
  }) => Course;
  enrollPreset: (presetKey: string) => Course | null;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  toggleLessonCompletion: (courseId: string, lessonId: string) => void;
  addCourseNote: (courseId: string, note: { title: string; content: string; timestamp_seconds?: number | null; lesson_id?: string | null }) => void;
  setLastActiveCourseId: (id: string) => void;

  // Session actions
  addSession: (sessionData: {
    course_id?: string | null;
    lesson_id?: string | null;
    duration_seconds: number;
    notes?: string;
    started_at?: string;
    ended_at?: string;
  }) => LearningSession;
  updateSession: (session: LearningSession) => void;
  deleteSession: (id: string) => void;

  // Timer actions
  startTimer: (courseId?: string, lessonId?: string) => boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  finishTimer: (notes?: string) => void;

  // Preferences & Data actions
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetAllData: () => void;
  exportData: () => string;

  // Computed metrics
  stats: {
    todayMinutes: number;
    remainingMinutesToday: number;
    todayGoalMet: boolean;
    currentStreak: number;
    bestStreak: number;
    weeklyActivity: ReturnType<typeof getWeeklyActivity>;
  };
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState>({
    is_running: false,
    started_at: null,
    course_id: null,
    lesson_id: null,
    accumulated_seconds: 0,
    session_start_epoch: null,
  });
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [lastActiveId, setLastActiveId] = useState<string>('');
  const [timerNotice, setTimerNotice] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const finishingTimerRef = useRef(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial client hydration from storage
  useEffect(() => {
    setStorageWarning(repository.getStorageFailure());
    const handleStorageFailure = (event: Event) => {
      const message = (event as CustomEvent<string>).detail;
      setStorageWarning(message || 'Browser storage is unavailable. Changes may not persist.');
    };
    window.addEventListener('learnhour:storage-failure', handleStorageFailure);

    try {
      const loadedCourses = repository.getCourses();
      const loadedSessions = repository.getSessions();
      const loadedPrefs = repository.getPreferences();
      const loadedTimer = repository.getActiveTimer();
      const loadedLastActive = repository.getLastActiveCourseId();

      setCourses(loadedCourses);
      setSessions(loadedSessions);
      setPreferences(loadedPrefs);
      setActiveTimer(loadedTimer);
      setLastActiveId(loadedLastActive);

      // Compute initial elapsed seconds if timer was running
      if (loadedTimer.is_running && loadedTimer.started_at) {
        const liveRunning = Math.floor((Date.now() - loadedTimer.started_at) / 1000);
        setElapsedSeconds(loadedTimer.accumulated_seconds + Math.max(0, liveRunning));
      } else {
        setElapsedSeconds(loadedTimer.accumulated_seconds || 0);
      }
    } catch (e) {
      console.error('Failed to initialize local data', e);
    } finally {
      setIsLoading(false);
    }

    return () => window.removeEventListener('learnhour:storage-failure', handleStorageFailure);
  }, []);

  // Timer ticker loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (activeTimer.is_running && activeTimer.started_at) {
      interval = setInterval(() => {
        const liveSeconds = Math.floor((Date.now() - activeTimer.started_at!) / 1000);
        setElapsedSeconds(activeTimer.accumulated_seconds + Math.max(0, liveSeconds));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer.is_running, activeTimer.started_at, activeTimer.accumulated_seconds]);

  // Sync timer state changes to persistent repository
  const updateTimerState = useCallback((nextState: ActiveTimerState) => {
    repository.saveActiveTimer(nextState);
    setActiveTimer(nextState);
  }, []);

  const startTimer = useCallback((courseId?: string, lessonId?: string) => {
    const now = Date.now();
    const targetCourseId = courseId || activeTimer.course_id || lastActiveId;
    const targetLessonId = lessonId !== undefined ? lessonId : activeTimer.lesson_id;
    if (!canSwitchTimerTarget(activeTimer, targetCourseId, targetLessonId, now)) {
      setTimerNotice('This timer already has recorded time for another course or lesson. Save or reset it before switching.');
      return false;
    }

    if (targetCourseId) {
      setLastActiveId(targetCourseId);
      repository.setLastActiveCourseId(targetCourseId);
    }

    if (activeTimer.is_running && timerTargetMatches(activeTimer, targetCourseId, targetLessonId)) {
      setTimerNotice(null);
      return true;
    }

    const nextState = startTimerState(activeTimer, targetCourseId, targetLessonId, now);
    updateTimerState(nextState);
    setElapsedSeconds(nextState.accumulated_seconds);
    setTimerNotice(null);
    return true;
  }, [activeTimer, lastActiveId, updateTimerState]);

  const pauseTimer = useCallback(() => {
    if (!activeTimer.is_running) return;
    setTimerNotice(null);
    const now = Date.now();
    const nextState = pauseTimerState(activeTimer, now);
    updateTimerState(nextState);
    setElapsedSeconds(nextState.accumulated_seconds);
  }, [activeTimer, updateTimerState]);

  const resumeTimer = useCallback(() => {
    if (activeTimer.is_running) return;
    setTimerNotice(null);
    const now = Date.now();
    const nextState = resumeTimerState(activeTimer, now);
    updateTimerState(nextState);
  }, [activeTimer, updateTimerState]);

  const resetTimer = useCallback(() => {
    setTimerNotice(null);
    const nextState: ActiveTimerState = {
      is_running: false,
      course_id: null,
      lesson_id: null,
      started_at: null,
      accumulated_seconds: 0,
      session_start_epoch: null,
    };
    setElapsedSeconds(0);
    updateTimerState(nextState);
  }, [updateTimerState]);

  // Finish timer and record session losslessly
  const finishTimer = useCallback((notes?: string) => {
    if (finishingTimerRef.current) return;
    finishingTimerRef.current = true;
    setTimerNotice(null);
    try {
      const now = Date.now();
      const finalSeconds = getElapsedTimerSeconds(activeTimer, now);

      if (finalSeconds < 5) {
        resetTimer();
        return;
      }

      const sessionStart = activeTimer.session_start_epoch
        ? new Date(activeTimer.session_start_epoch).toISOString()
        : new Date(now - finalSeconds * 1000).toISOString();
      const sessionEnd = new Date(now).toISOString();
      const course = activeTimer.course_id ? repository.getCourseById(activeTimer.course_id) : null;

      const newSession: LearningSession = {
        id: `timer-session-${activeTimer.session_start_epoch || now}`,
        user_id: preferences.user_id,
        course_id: activeTimer.course_id,
        lesson_id: activeTimer.lesson_id,
        course_title: course?.title || 'General Study',
        started_at: sessionStart,
        ended_at: sessionEnd,
        duration_seconds: finalSeconds,
        notes: notes || undefined,
        created_at: sessionEnd,
      };

      repository.addSession(newSession);
      setSessions(repository.getSessions());
      setCourses(repository.getCourses());
      resetTimer();
    } finally {
      finishingTimerRef.current = false;
    }
  }, [activeTimer, preferences.user_id, resetTimer]);

  // Course operations
  const addCourse = useCallback((courseData: {
    id?: string;
    title: string;
    provider?: string;
    course_url: string;
    embed_url?: string;
    thumbnail_url?: string;
    description?: string;
    total_minutes: number;
    daily_pace_minutes?: number;
    lessons?: CourseLesson[];
    quizzes?: Course['quizzes'];
    flashcards?: Course['flashcards'];
    notes?: Course['notes'];
  }): Course => {
    const id = courseData.id || `course-${Date.now()}`;
    const dailyPace = courseData.daily_pace_minutes || 60;
    const generatedLessons = courseData.lessons && courseData.lessons.length > 0
      ? courseData.lessons.map((l) => ({ ...l, course_id: id }))
      : generateLessonsForCourse(id, courseData.total_minutes, courseData.title, dailyPace);

    const newCourse: Course = {
      id,
      user_id: preferences.user_id,
      title: courseData.title,
      provider: courseData.provider || 'Custom',
      course_url: courseData.course_url,
      embed_url: courseData.embed_url || courseData.course_url,
      thumbnail_url: courseData.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      description: courseData.description || 'Self-paced learning journey.',
      total_minutes: courseData.total_minutes,
      completed_minutes: 0,
      daily_pace_minutes: dailyPace,
      status: 'active',
      lessons: generatedLessons,
      quizzes: courseData.quizzes,
      flashcards: courseData.flashcards,
      notes: courseData.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    repository.saveCourse(newCourse);
    setCourses(repository.getCourses());
    setLastActiveId(id);
    repository.setLastActiveCourseId(id);
    return newCourse;
  }, [preferences.user_id]);

  const enrollPreset = useCallback((presetKey: string): Course | null => {
    const preset = PRESET_COURSES.find((p) => p.key === presetKey);
    if (!preset) return null;
    const videoId = preset.url.includes('v=') ? preset.url.split('v=')[1].slice(0, 11) : 'kL2gQWjmLc0';
    return addCourse({
      id: preset.key,
      title: preset.title,
      provider: preset.provider,
      course_url: preset.url,
      embed_url: `https://www.youtube.com/embed/${videoId}?enablejsapi=1`,
      thumbnail_url: preset.thumbnail_url,
      description: preset.description,
      total_minutes: preset.total_minutes,
      daily_pace_minutes: preset.daily_pace_minutes,
      lessons: preset.lessons.map((l) => ({
        ...l,
        course_id: preset.key,
        is_completed: false,
      })),
      quizzes: preset.quizzes,
      flashcards: preset.flashcards?.map((f) => ({ ...f, course_id: preset.key })),
      notes: preset.notes?.map((n) => ({ ...n, course_id: preset.key })),
    });
  }, [addCourse]);

  const updateCourse = useCallback((course: Course) => {
    repository.saveCourse(course);
    setCourses(repository.getCourses());
  }, []);

  const deleteCourse = useCallback((id: string) => {
    repository.deleteCourse(id);
    setCourses(repository.getCourses());
    if (activeTimer.course_id === id) {
      resetTimer();
    }
  }, [activeTimer.course_id, resetTimer]);

  const toggleLessonCompletion = useCallback((courseId: string, lessonId: string) => {
    const updated = repository.toggleLessonCompletion(courseId, lessonId);
    if (updated) {
      setCourses(repository.getCourses());
    }
  }, []);

  const addCourseNote = useCallback((courseId: string, noteData: {
    title: string;
    content: string;
    timestamp_seconds?: number | null;
    lesson_id?: string | null;
  }) => {
    const note: CourseNote = {
      id: `note-${Date.now()}`,
      course_id: courseId,
      lesson_id: noteData.lesson_id,
      timestamp_seconds: noteData.timestamp_seconds,
      title: noteData.title,
      content: noteData.content,
      created_at: new Date().toISOString(),
    };
    repository.addCourseNote(courseId, note);
    setCourses(repository.getCourses());
  }, []);

  const setLastActiveCourseIdCallback = useCallback((id: string) => {
    setLastActiveId(id);
    repository.setLastActiveCourseId(id);
  }, []);

  // Manual session operations
  const addSession = useCallback((sessionData: {
    course_id?: string | null;
    lesson_id?: string | null;
    duration_seconds: number;
    notes?: string;
    started_at?: string;
    ended_at?: string;
  }) => {
    if (!sessionData.duration_seconds || sessionData.duration_seconds <= 0) {
      throw new Error('Session duration must be greater than zero.');
    }

    const now = new Date();
    const duration = sessionData.duration_seconds;
    const startedAt = sessionData.started_at || new Date(now.getTime() - duration * 1000).toISOString();
    const endedAt = sessionData.ended_at || now.toISOString();

    const course = sessionData.course_id ? repository.getCourseById(sessionData.course_id) : null;

    const session: LearningSession = {
      id: `session-${Date.now()}`,
      user_id: preferences.user_id,
      course_id: sessionData.course_id || null,
      lesson_id: sessionData.lesson_id || null,
      course_title: course?.title || 'General Study',
      started_at: startedAt,
      ended_at: endedAt,
      duration_seconds: duration,
      notes: sessionData.notes,
      created_at: now.toISOString(),
    };

    repository.addSession(session);
    setSessions(repository.getSessions());
    setCourses(repository.getCourses());
    return session;
  }, [preferences.user_id]);

  const updateSession = useCallback((session: LearningSession) => {
    repository.updateSession(session);
    setSessions(repository.getSessions());
    setCourses(repository.getCourses());
  }, []);

  const deleteSession = useCallback((id: string) => {
    repository.deleteSession(id);
    setSessions(repository.getSessions());
    setCourses(repository.getCourses());
  }, []);

  // Preferences & Reset
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    const current = repository.getPreferences();
    const updated: UserPreferences = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    repository.savePreferences(updated);
    setPreferences(updated);
  }, []);

  const resetAllData = useCallback(() => {
    repository.resetToDefaults();
    setCourses(repository.getCourses());
    setSessions(repository.getSessions());
    setPreferences(repository.getPreferences());
    resetTimer();
  }, [resetTimer]);

  const exportData = useCallback(() => {
    return repository.exportBackupJson();
  }, []);

  // Last active course
  const lastActiveCourse = useMemo(() => {
    return courses.find((c) => c.id === lastActiveId) || courses[0] || null;
  }, [courses, lastActiveId]);

  // Streak & Goal Metrics (computed with safe timezone and without future sessions)
  const stats = useMemo(() => {
    const streakData = calculateStreaks(sessions, preferences.daily_goal_minutes, preferences.timezone);
    const weeklyActivity = getWeeklyActivity(sessions, preferences.daily_goal_minutes, preferences.timezone);

    return {
      todayMinutes: streakData.todayMinutes,
      remainingMinutesToday: streakData.remainingMinutesToday,
      todayGoalMet: streakData.todayGoalMet,
      currentStreak: streakData.currentStreak,
      bestStreak: streakData.bestStreak,
      weeklyActivity,
    };
  }, [sessions, preferences.daily_goal_minutes, preferences.timezone]);

  return (
    <LearningContext.Provider
      value={{
        courses,
        sessions,
        preferences,
        activeTimer,
        elapsedSeconds,
        timerNotice,
        storageWarning,
        lastActiveCourse,
        isLoading,
        addCourse,
        enrollPreset,
        updateCourse,
        deleteCourse,
        toggleLessonCompletion,
        addCourseNote,
        setLastActiveCourseId: setLastActiveCourseIdCallback,
        addSession,
        updateSession,
        deleteSession,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        finishTimer,
        updatePreferences,
        resetAllData,
        exportData,
        stats,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Course, LearningSession, UserPreferences, ActiveTimerState, CourseLesson, CourseNote } from '@/types';
import { repository } from '@/lib/storage/repository';
import { calculateStreaks, getWeeklyActivity } from '@/lib/calculations/streaks';
import { generateLessonsForCourse } from '@/lib/calculations/dayPlanner';

interface LearningContextType {
  courses: Course[];
  sessions: LearningSession[];
  preferences: UserPreferences;
  activeTimer: ActiveTimerState;
  elapsedSeconds: number;
  lastActiveCourse: Course | null;
  isLoading: boolean;
  
  // Course actions
  addCourse: (courseData: {
    title: string;
    provider?: string;
    course_url: string;
    embed_url?: string;
    thumbnail_url?: string;
    description?: string;
    total_minutes: number;
    daily_pace_minutes?: number;
    lessons?: CourseLesson[];
  }) => Course;
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
  startTimer: (courseId?: string, lessonId?: string) => void;
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
  const [preferences, setPreferences] = useState<UserPreferences>(repository.getPreferences());
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState>(repository.getActiveTimer());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [lastActiveId, setLastActiveId] = useState<string>('python-2026');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial client hydration from storage
  useEffect(() => {
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
    setActiveTimer(nextState);
    repository.saveActiveTimer(nextState);
  }, []);

  const startTimer = useCallback((courseId?: string, lessonId?: string) => {
    const now = Date.now();
    const targetCourseId = courseId || activeTimer.course_id || lastActiveId;
    if (targetCourseId) {
      setLastActiveId(targetCourseId);
      repository.setLastActiveCourseId(targetCourseId);
    }

    // Idempotent check when already running
    if (activeTimer.is_running) {
      const targetLessonId = lessonId !== undefined ? lessonId : activeTimer.lesson_id;
      if (activeTimer.course_id === targetCourseId && activeTimer.lesson_id === targetLessonId) {
        return; // already running with exact target, do not reset
      }
      // If switching target while running, flush current live segment into accumulated_seconds
      const liveSegment = activeTimer.started_at ? Math.max(0, Math.floor((now - activeTimer.started_at) / 1000)) : 0;
      const nextAccumulated = activeTimer.accumulated_seconds + liveSegment;
      const nextState: ActiveTimerState = {
        is_running: true,
        course_id: targetCourseId || null,
        lesson_id: targetLessonId || null,
        started_at: now,
        accumulated_seconds: nextAccumulated,
        session_start_epoch: activeTimer.session_start_epoch || (now - nextAccumulated * 1000),
      };
      setElapsedSeconds(nextAccumulated);
      updateTimerState(nextState);
      return;
    }

    // Starting from paused / stopped
    const currentAccumulated = activeTimer.accumulated_seconds > 0 ? activeTimer.accumulated_seconds : elapsedSeconds;
    const nextState: ActiveTimerState = {
      is_running: true,
      course_id: targetCourseId || null,
      lesson_id: lessonId || activeTimer.lesson_id || null,
      started_at: now,
      accumulated_seconds: currentAccumulated,
      session_start_epoch: activeTimer.session_start_epoch || (now - currentAccumulated * 1000),
    };
    updateTimerState(nextState);
  }, [activeTimer, elapsedSeconds, lastActiveId, updateTimerState]);

  const pauseTimer = useCallback(() => {
    if (!activeTimer.is_running) return;
    const now = Date.now();
    const segment = activeTimer.started_at ? Math.floor((now - activeTimer.started_at) / 1000) : 0;
    const totalAccumulated = activeTimer.accumulated_seconds + Math.max(0, segment);

    const nextState: ActiveTimerState = {
      ...activeTimer,
      is_running: false,
      started_at: null,
      accumulated_seconds: totalAccumulated,
    };
    setElapsedSeconds(totalAccumulated);
    updateTimerState(nextState);
  }, [activeTimer, updateTimerState]);

  const resumeTimer = useCallback(() => {
    if (activeTimer.is_running) return;
    const now = Date.now();
    const nextState: ActiveTimerState = {
      ...activeTimer,
      is_running: true,
      started_at: now,
      session_start_epoch: activeTimer.session_start_epoch || (now - activeTimer.accumulated_seconds * 1000),
    };
    updateTimerState(nextState);
  }, [activeTimer, updateTimerState]);

  const resetTimer = useCallback(() => {
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
    const now = Date.now();
    const liveSegment = activeTimer.is_running && activeTimer.started_at
      ? Math.max(0, Math.floor((now - activeTimer.started_at) / 1000))
      : 0;
    const finalSeconds = activeTimer.accumulated_seconds + liveSegment;

    if (finalSeconds < 5) {
      // Ignore accidental micro-clicks under 5 seconds
      resetTimer();
      return;
    }

    const sessionStart = activeTimer.session_start_epoch
      ? new Date(activeTimer.session_start_epoch).toISOString()
      : new Date(now - finalSeconds * 1000).toISOString();
    const sessionEnd = new Date(now).toISOString();

    const course = activeTimer.course_id ? repository.getCourseById(activeTimer.course_id) : null;

    const newSession: LearningSession = {
      id: `session-${Date.now()}`,
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
  }, [activeTimer, preferences.user_id, resetTimer]);

  // Course operations
  const addCourse = useCallback((courseData: {
    title: string;
    provider?: string;
    course_url: string;
    embed_url?: string;
    thumbnail_url?: string;
    description?: string;
    total_minutes: number;
    daily_pace_minutes?: number;
    lessons?: CourseLesson[];
  }): Course => {
    const id = `course-${Date.now()}`;
    const dailyPace = courseData.daily_pace_minutes || 60;
    const generatedLessons = courseData.lessons && courseData.lessons.length > 0
      ? courseData.lessons
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    repository.saveCourse(newCourse);
    setCourses(repository.getCourses());
    setLastActiveId(id);
    repository.setLastActiveCourseId(id);
    return newCourse;
  }, [preferences.user_id]);

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
        lastActiveCourse,
        isLoading,
        addCourse,
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

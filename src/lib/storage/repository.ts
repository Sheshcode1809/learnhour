import { Course, CourseStatus, LearningSession, UserPreferences, ActiveTimerState, CourseNote } from '@/types';
import { INITIAL_COURSES, INITIAL_PREFERENCES, generateSeedSessions } from './mockData';
import { deriveCourseCompletedMinutes } from '../calculations/progress';

const STORAGE_KEYS = {
  COURSES: 'courseit_courses_v1',
  SESSIONS: 'courseit_sessions_v1',
  PREFERENCES: 'courseit_preferences_v1',
  ACTIVE_TIMER: 'courseit_active_timer_v1',
  ACTIVE_COURSE_ID: 'courseit_last_active_course_id_v1',
  LAST_LESSON_PREFIX: 'courseit_last_lesson_',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCourseRecord(value: unknown): value is Course {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && typeof value.title === 'string' &&
    typeof value.provider === 'string' && typeof value.course_url === 'string' &&
    typeof value.embed_url === 'string' && typeof value.description === 'string' &&
    Number.isFinite(value.total_minutes) && Number(value.total_minutes) > 0 &&
    Number.isFinite(value.completed_minutes) && Number.isFinite(value.daily_pace_minutes) &&
    ['active', 'completed', 'archived'].includes(String(value.status)) &&
    Array.isArray(value.lessons) && value.lessons.every((lesson) =>
      isRecord(lesson) && typeof lesson.id === 'string' && typeof lesson.title === 'string' &&
      Number.isFinite(lesson.duration_minutes) && Number.isFinite(lesson.day_number) &&
      typeof lesson.is_completed === 'boolean'
    ) && typeof value.created_at === 'string' && typeof value.updated_at === 'string';
}

function isLearningSessionRecord(value: unknown): value is LearningSession {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && typeof value.started_at === 'string' &&
    Number.isFinite(Date.parse(value.started_at)) && typeof value.ended_at === 'string' &&
    Number.isFinite(Date.parse(value.ended_at)) && Number.isFinite(value.duration_seconds) &&
    Number(value.duration_seconds) > 0 && typeof value.created_at === 'string';
}

function isPreferencesRecord(value: unknown): value is UserPreferences {
  return isRecord(value) && typeof value.user_id === 'string' && typeof value.name === 'string' &&
    Number.isFinite(value.daily_goal_minutes) && Number(value.daily_goal_minutes) > 0 &&
    typeof value.timezone === 'string' && typeof value.tier === 'string' &&
    typeof value.created_at === 'string' && typeof value.updated_at === 'string';
}

class LocalCourseRepository {
  private storageFailureMessage: string | null = null;

  private reportStorageFailure(): void {
    this.storageFailureMessage = 'Browser storage is unavailable or full. Changes may not persist; export your data if the app still allows it.';
    if (this.isBrowser()) {
      window.dispatchEvent(new CustomEvent('learnhour:storage-failure', { detail: this.storageFailureMessage }));
    }
  }

  getStorageFailure(): string | null {
    return this.storageFailureMessage;
  }

  private getInitialCourses(): Course[] {
    return process.env.NODE_ENV === 'production' ? [] : INITIAL_COURSES;
  }

  private getInitialSessions(): LearningSession[] {
    return process.env.NODE_ENV === 'production' ? [] : generateSeedSessions();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- PREFERENCES ---
  getPreferences(): UserPreferences {
    if (!this.isBrowser()) return INITIAL_PREFERENCES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (data !== null) {
        const parsed: unknown = JSON.parse(data);
        if (isPreferencesRecord(parsed)) return parsed;
        this.reportStorageFailure();
        return INITIAL_PREFERENCES;
      }
      this.savePreferences(INITIAL_PREFERENCES);
      return INITIAL_PREFERENCES;
    } catch {
      this.reportStorageFailure();
      return INITIAL_PREFERENCES;
    }
  }

  savePreferences(prefs: UserPreferences): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch {
      this.reportStorageFailure();
      throw new Error('Unable to save preferences in this browser.');
    }
  }

  // --- COURSES ---
  getCourses(): Course[] {
    if (!this.isBrowser()) return this.getInitialCourses();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      // Distinguish intentionally saved empty array [] from uninitialized storage (null)
      if (data !== null) {
        const parsed: unknown = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.every(isCourseRecord)) return parsed;
        this.reportStorageFailure();
        return this.getInitialCourses();
      }
      // Demo content is limited to development. Production starts with an empty account.
      const initialCourses = this.getInitialCourses();
      this.saveCourses(initialCourses);
      return initialCourses;
    } catch {
      this.reportStorageFailure();
      return this.getInitialCourses();
    }
  }

  getCourseById(id: string): Course | null {
    const courses = this.getCourses();
    return courses.find((c) => c.id === id) || null;
  }

  saveCourses(courses: Course[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch {
      this.reportStorageFailure();
      throw new Error('Unable to save courses in this browser.');
    }
  }

  saveCourse(course: Course): Course {
    const courses = this.getCourses();
    const sessions = this.getSessions();
    const derivedMins = deriveCourseCompletedMinutes(course, sessions);
    const updatedCourse: Course = {
      ...course,
      completed_minutes: derivedMins,
      status: course.status === 'archived' ? 'archived' : derivedMins >= course.total_minutes ? 'completed' : 'active',
      updated_at: new Date().toISOString(),
    };

    const index = courses.findIndex((c) => c.id === course.id);
    let updatedList: Course[];

    if (index >= 0) {
      updatedList = [...courses];
      updatedList[index] = updatedCourse;
    } else {
      updatedList = [updatedCourse, ...courses];
    }

    this.saveCourses(updatedList);
    return updatedCourse;
  }

  deleteCourse(id: string): void {
    const courses = this.getCourses();
    const filtered = courses.filter((c) => c.id !== id);
    this.saveCourses(filtered);
    if (this.isBrowser()) {
      try {
        localStorage.removeItem(`${STORAGE_KEYS.LAST_LESSON_PREFIX}${id}`);
      } catch {
        this.reportStorageFailure();
      }
    }
  }

  toggleLessonCompletion(courseId: string, lessonId: string): Course | null {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    const updatedLessons = course.lessons.map((lesson) => {
      if (lesson.id === lessonId) {
        const nextCompleted = !lesson.is_completed;
        return {
          ...lesson,
          is_completed: nextCompleted,
          completed_at: nextCompleted ? new Date().toISOString() : null,
        };
      }
      return lesson;
    });

    const sessions = this.getSessions();
    const tempCourse: Course = {
      ...course,
      lessons: updatedLessons,
    };
    const derivedMins = deriveCourseCompletedMinutes(tempCourse, sessions);

    const updatedCourse: Course = {
      ...tempCourse,
      completed_minutes: derivedMins,
      status: course.status === 'archived' ? 'archived' : derivedMins >= course.total_minutes ? 'completed' : 'active',
      updated_at: new Date().toISOString(),
    };

    this.saveCourse(updatedCourse);
    return updatedCourse;
  }

  addCourseNote(courseId: string, note: CourseNote): Course | null {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    const existingNotes = course.notes || [];
    const updatedCourse: Course = {
      ...course,
      notes: [note, ...existingNotes],
      updated_at: new Date().toISOString(),
    };

    this.saveCourse(updatedCourse);
    return updatedCourse;
  }

  // Persist per-course last-selected lesson
  setLastSelectedLessonId(courseId: string, lessonId: string): void {
    if (!this.isBrowser() || !courseId || !lessonId) return;
    try {
      localStorage.setItem(`${STORAGE_KEYS.LAST_LESSON_PREFIX}${courseId}`, lessonId);
    } catch {
      this.reportStorageFailure();
    }
  }

  getLastSelectedLessonId(courseId: string): string | null {
    if (!this.isBrowser() || !courseId) return null;
    try {
      return localStorage.getItem(`${STORAGE_KEYS.LAST_LESSON_PREFIX}${courseId}`);
    } catch {
      this.reportStorageFailure();
      return null;
    }
  }

  // --- SESSIONS ---
  getSessions(): LearningSession[] {
    if (!this.isBrowser()) return this.getInitialSessions();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data !== null) {
        const parsed: unknown = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.every(isLearningSessionRecord)) return parsed;
        this.reportStorageFailure();
        return this.getInitialSessions();
      }
      const initial = this.getInitialSessions();
      this.saveSessions(initial);
      return initial;
    } catch {
      this.reportStorageFailure();
      return this.getInitialSessions();
    }
  }

  saveSessions(sessions: LearningSession[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {
      this.reportStorageFailure();
      throw new Error('Unable to save study sessions in this browser.');
    }
  }

  /**
   * Recalculate derived progress for all courses using the single calculation path
   */
  private recalculateCoursesWithSessions(sessions: LearningSession[]): void {
    const courses = this.getCourses();
    const updatedCourses = courses.map((course) => {
      const derived = deriveCourseCompletedMinutes(course, sessions);
      const nextStatus: CourseStatus =
        course.status === 'archived'
          ? 'archived'
          : derived >= course.total_minutes
          ? 'completed'
          : 'active';
      return {
        ...course,
        completed_minutes: derived,
        status: nextStatus,
        updated_at: new Date().toISOString(),
      };
    });
    this.saveCourses(updatedCourses);
  }

  addSession(session: LearningSession): LearningSession {
    if (!session.duration_seconds || session.duration_seconds <= 0) {
      throw new Error('Session duration must be greater than zero.');
    }

    const sessions = this.getSessions();
    const existingSession = sessions.find((saved) => saved.id === session.id);
    if (existingSession) {
      this.recalculateCoursesWithSessions(sessions);
      return existingSession;
    }
    const updatedSessions = [session, ...sessions];
    this.saveSessions(updatedSessions);
    this.recalculateCoursesWithSessions(updatedSessions);
    return session;
  }

  updateSession(session: LearningSession): LearningSession {
    if (!session.duration_seconds || session.duration_seconds <= 0) {
      throw new Error('Session duration must be greater than zero.');
    }

    const sessions = this.getSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index === -1) {
      throw new Error('Session not found.');
    }

    const updatedSessions = [...sessions];
    updatedSessions[index] = session;
    this.saveSessions(updatedSessions);
    this.recalculateCoursesWithSessions(updatedSessions);
    return session;
  }

  deleteSession(sessionId: string): void {
    const sessions = this.getSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    this.saveSessions(filtered);
    this.recalculateCoursesWithSessions(filtered);
  }

  // --- ACTIVE TIMER STATE ---
  getActiveTimer(): ActiveTimerState {
    const defaultTimer: ActiveTimerState = {
      is_running: false,
      course_id: null,
      lesson_id: null,
      started_at: null,
      accumulated_seconds: 0,
      session_start_epoch: null,
    };
    if (!this.isBrowser()) return defaultTimer;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TIMER);
      if (!data) return defaultTimer;
      const parsed: unknown = JSON.parse(data);
      if (
        isRecord(parsed) && typeof parsed.is_running === 'boolean' &&
        (parsed.course_id === null || typeof parsed.course_id === 'string') &&
        (parsed.lesson_id === null || typeof parsed.lesson_id === 'string') &&
        (parsed.started_at === null || Number.isFinite(parsed.started_at)) &&
        Number.isFinite(parsed.accumulated_seconds) && Number(parsed.accumulated_seconds) >= 0
      ) return parsed as unknown as ActiveTimerState;
      this.reportStorageFailure();
      return defaultTimer;
    } catch {
      this.reportStorageFailure();
      return defaultTimer;
    }
  }

  saveActiveTimer(state: ActiveTimerState): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMER, JSON.stringify(state));
    } catch {
      this.reportStorageFailure();
      throw new Error('Unable to save the timer in this browser.');
    }
  }

  // --- LAST ACTIVE COURSE ---
  getLastActiveCourseId(): string {
    if (!this.isBrowser()) return this.getInitialCourses()[0]?.id || '';
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE_ID) || this.getCourses()[0]?.id || '';
    } catch {
      this.reportStorageFailure();
      return this.getCourses()[0]?.id || '';
    }
  }

  setLastActiveCourseId(courseId: string): void {
    if (!this.isBrowser() || !courseId) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE_ID, courseId);
    } catch {
      this.reportStorageFailure();
      throw new Error('Unable to clear data from this browser.');
    }
  }

  // --- BACKUP & RESET ---
  exportBackupJson(): string {
    return JSON.stringify(
      {
        version: '1.0',
        exported_at: new Date().toISOString(),
        preferences: this.getPreferences(),
        courses: this.getCourses(),
        sessions: this.getSessions(),
      },
      null,
      2
    );
  }

  resetToDefaults(): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.COURSES);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMER);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_COURSE_ID);
      // Clean per-course lesson keys
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith(STORAGE_KEYS.LAST_LESSON_PREFIX)) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      this.reportStorageFailure();
    }

    this.savePreferences(INITIAL_PREFERENCES);
    this.saveCourses(this.getInitialCourses());
    this.saveSessions(this.getInitialSessions());
  }
}

export const repository = new LocalCourseRepository();

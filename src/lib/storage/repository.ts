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

class LocalCourseRepository {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- PREFERENCES ---
  getPreferences(): UserPreferences {
    if (!this.isBrowser()) return INITIAL_PREFERENCES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (data !== null) {
        return JSON.parse(data);
      }
      this.savePreferences(INITIAL_PREFERENCES);
      return INITIAL_PREFERENCES;
    } catch {
      return INITIAL_PREFERENCES;
    }
  }

  savePreferences(prefs: UserPreferences): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.error('Failed to save preferences to localStorage', e);
    }
  }

  // --- COURSES ---
  getCourses(): Course[] {
    if (!this.isBrowser()) return INITIAL_COURSES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      // Distinguish intentionally saved empty array [] from uninitialized storage (null)
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      // First install: seed default masterclasses
      this.saveCourses(INITIAL_COURSES);
      return INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
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
    } catch (e) {
      console.error('Failed to save courses to localStorage', e);
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
      } catch {}
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
    } catch {}
  }

  getLastSelectedLessonId(courseId: string): string | null {
    if (!this.isBrowser() || !courseId) return null;
    try {
      return localStorage.getItem(`${STORAGE_KEYS.LAST_LESSON_PREFIX}${courseId}`);
    } catch {
      return null;
    }
  }

  // --- SESSIONS ---
  getSessions(): LearningSession[] {
    if (!this.isBrowser()) return generateSeedSessions();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      const initial = generateSeedSessions();
      this.saveSessions(initial);
      return initial;
    } catch {
      return generateSeedSessions();
    }
  }

  saveSessions(sessions: LearningSession[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage', e);
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
      return data ? JSON.parse(data) : defaultTimer;
    } catch {
      return defaultTimer;
    }
  }

  saveActiveTimer(state: ActiveTimerState): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMER, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save active timer to localStorage', e);
    }
  }

  // --- LAST ACTIVE COURSE ---
  getLastActiveCourseId(): string {
    if (!this.isBrowser()) return 'python-2026';
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE_ID) || 'python-2026';
  }

  setLastActiveCourseId(courseId: string): void {
    if (!this.isBrowser() || !courseId) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE_ID, courseId);
    } catch {}
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
    } catch {}

    this.savePreferences(INITIAL_PREFERENCES);
    this.saveCourses(INITIAL_COURSES);
    this.saveSessions(generateSeedSessions());
  }
}

export const repository = new LocalCourseRepository();

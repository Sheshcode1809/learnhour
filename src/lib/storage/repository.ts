import { Course, LearningSession, UserPreferences, ActiveTimerState, CourseNote } from '@/types';
import { INITIAL_COURSES, INITIAL_PREFERENCES, generateSeedSessions } from './mockData';

const STORAGE_KEYS = {
  COURSES: 'courseit_courses_v1',
  SESSIONS: 'courseit_sessions_v1',
  PREFERENCES: 'courseit_preferences_v1',
  ACTIVE_TIMER: 'courseit_active_timer_v1',
  ACTIVE_COURSE_ID: 'courseit_last_active_course_id_v1',
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
      if (data) return JSON.parse(data);
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
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
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
    const index = courses.findIndex((c) => c.id === course.id);
    let updated: Course[];

    if (index >= 0) {
      updated = [...courses];
      updated[index] = { ...course, updated_at: new Date().toISOString() };
    } else {
      updated = [course, ...courses];
    }

    this.saveCourses(updated);
    return course;
  }

  deleteCourse(id: string): void {
    const courses = this.getCourses();
    const filtered = courses.filter((c) => c.id !== id);
    this.saveCourses(filtered);
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

    const completedMinutes = updatedLessons
      .filter((l) => l.is_completed)
      .reduce((acc, l) => acc + (l.duration_minutes || 0), 0);

    const updatedCourse: Course = {
      ...course,
      lessons: updatedLessons,
      completed_minutes: completedMinutes,
      status: completedMinutes >= course.total_minutes ? 'completed' : 'active',
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

  // --- SESSIONS ---
  getSessions(): LearningSession[] {
    if (!this.isBrowser()) return generateSeedSessions();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) {
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

  addSession(session: LearningSession): LearningSession {
    const sessions = this.getSessions();
    const updated = [session, ...sessions];
    this.saveSessions(updated);

    // If linked to a course, also update course completed_minutes
    if (session.course_id && session.duration_seconds > 0) {
      const course = this.getCourseById(session.course_id);
      if (course) {
        const additionalMinutes = Math.floor(session.duration_seconds / 60);
        const updatedCourse: Course = {
          ...course,
          completed_minutes: Math.min(course.total_minutes, course.completed_minutes + additionalMinutes),
          updated_at: new Date().toISOString(),
        };
        this.saveCourse(updatedCourse);
      }
    }

    return session;
  }

  deleteSession(sessionId: string): void {
    const sessions = this.getSessions();
    const toDelete = sessions.find((s) => s.id === sessionId);
    const filtered = sessions.filter((s) => s.id !== sessionId);
    this.saveSessions(filtered);

    // If linked to a course, subtract minutes
    if (toDelete && toDelete.course_id && toDelete.duration_seconds > 0) {
      const course = this.getCourseById(toDelete.course_id);
      if (course) {
        const subtractedMinutes = Math.floor(toDelete.duration_seconds / 60);
        const updatedCourse: Course = {
          ...course,
          completed_minutes: Math.max(0, course.completed_minutes - subtractedMinutes),
          updated_at: new Date().toISOString(),
        };
        this.saveCourse(updatedCourse);
      }
    }
  }

  // --- ACTIVE TIMER STATE ---
  getActiveTimer(): ActiveTimerState {
    const defaultTimer: ActiveTimerState = {
      is_running: false,
      course_id: null,
      lesson_id: null,
      started_at: null,
      accumulated_seconds: 0,
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
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE_ID, courseId);
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
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_COURSE_ID);
    this.savePreferences(INITIAL_PREFERENCES);
    this.saveCourses(INITIAL_COURSES);
    this.saveSessions(generateSeedSessions());
  }
}

export const repository = new LocalCourseRepository();


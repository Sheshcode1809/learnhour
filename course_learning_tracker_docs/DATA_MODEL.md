# Data Model

Store timestamps in UTC ISO strings and convert to the user's local timezone for daily aggregation.
- Courses `total_minutes`: integer minutes.
- Sessions `duration_seconds`: integer seconds.
- Goal `daily_goal_minutes`: integer minutes.

## users / preferences
| Field | Type | Description |
|---|---|---|
| id | string (uuid) | PK / User identifier |
| name | string | User display name (e.g. Alex Johnson) |
| email | string | Optional user email |
| daily_goal_minutes | number | Default 60 minutes |
| timezone | string | IANA timezone (e.g. Asia/Kolkata or Intl.DateTimeFormat default) |
| created_at | string | ISO UTC timestamp |
| updated_at | string | ISO UTC timestamp |

## courses
| Field | Type | Description |
|---|---|---|
| id | string (uuid) | PK |
| user_id | string | Owner ID |
| title | string | Course title |
| provider | string | YouTube, Udemy, Coursera, FreeCodeCamp, Custom, etc. |
| course_url | string | Direct course or YouTube URL |
| embed_url | string | Embeddable video URL (e.g., https://www.youtube.com/embed/...) |
| thumbnail_url | string | Image thumbnail URL |
| description | string | Detailed course description |
| total_minutes | number | Total length in minutes (e.g., 600 for a 10hr course) |
| completed_minutes | number | Completed duration in minutes (calculated from sessions / lessons) |
| daily_pace_minutes | number | Targeted study time per day (default: 60) |
| status | string | 'active' \| 'completed' \| 'archived' |
| created_at | string | ISO UTC timestamp |
| updated_at | string | ISO UTC timestamp |

## course_lessons
| Field | Type | Description |
|---|---|---|
| id | string (uuid) | PK |
| course_id | string | FK to course.id |
| day_number | number | Day grouping (1, 2, 3...) based on daily pace |
| order_index | number | Lesson position in sequence |
| title | string | Lesson headline |
| duration_minutes | number | Lesson length in minutes |
| video_url | string | Optional video / timestamp URL |
| video_start_seconds | number | Start offset in seconds for YouTube player |
| is_completed | boolean | Whether the user marked this lesson completed |
| completed_at | string nullable | ISO UTC timestamp |

## learning_sessions
| Field | Type | Description |
|---|---|---|
| id | string (uuid) | PK |
| user_id | string | Owner ID |
| course_id | string nullable | FK to course.id, or null for general self-study |
| lesson_id | string nullable | Optional FK to course_lessons.id |
| started_at | string | ISO UTC timestamp |
| ended_at | string | ISO UTC timestamp |
| duration_seconds | number | Elapsed study time in seconds (> 0) |
| notes | string nullable | Optional reflection or notes for this session |
| created_at | string | ISO UTC timestamp |

## course_notes & flashcards
| Field | Type | Description |
|---|---|---|
| id | string (uuid) | PK |
| course_id | string | FK to course.id |
| lesson_id | string nullable | Optional lesson association |
| timestamp_seconds | number nullable | Pinned video timestamp |
| title | string | Note or flashcard concept |
| content | string | Note text or flashcard answer/back |
| kind | string | 'note' \| 'flashcard' \| 'quiz' |
| metadata | json/object | Additional metadata (e.g., quiz options, correct answer) |
| created_at | string | ISO UTC timestamp |

## active_timer_state
| Field | Type | Description |
|---|---|---|
| user_id | string | Owner ID |
| course_id | string nullable | Currently active course |
| lesson_id | string nullable | Currently active lesson |
| is_running | boolean | True if timer is actively counting |
| started_at | string nullable | Timestamp when current segment started |
| accumulated_seconds | number | Seconds accumulated prior to current running segment |
| updated_at | string | ISO UTC timestamp |

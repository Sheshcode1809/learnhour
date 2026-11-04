export interface ParsedVideoInfo {
  videoId: string | null;
  embedUrl: string;
  thumbnailUrl: string;
  suggestedTitle?: string;
  suggestedDuration?: number; // minutes
  suggestedProvider?: string;
  isPreset?: boolean;
}

// Preset courses highlighted in the reference video
export const PRESET_COURSES = [
  {
    key: 'python-2026',
    url: 'https://www.youtube.com/watch?v=kL2gQWjmLc0',
    title: 'Learn Python – Interactive Course 2026',
    provider: 'freeCodeCamp.org',
    total_minutes: 602, // ~10 hours
    thumbnail_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
    description: 'Master Python fundamentals, variables, control flow, functions, OOP, and build real projects in this complete beginner to advanced course.',
    daily_pace_minutes: 60,
    lessons: [
      {
        id: 'py-l1',
        title: 'Course Introduction & Project Overview',
        duration_minutes: 15,
        day_number: 1,
        order_index: 1,
        video_start_seconds: 0,
        is_completed: false,
      },
      {
        id: 'py-l2',
        title: 'Variables: Assignment, Reassignment & Naming Rules',
        duration_minutes: 20,
        day_number: 1,
        order_index: 2,
        video_start_seconds: 900,
        is_completed: false,
      },
      {
        id: 'py-l3',
        title: 'F-Strings: Formatting with Variable Placeholders',
        duration_minutes: 25,
        day_number: 1,
        order_index: 3,
        video_start_seconds: 2100,
        is_completed: false,
      },
      {
        id: 'py-l4',
        title: 'Building the Pay Up Display with F-Strings',
        duration_minutes: 20,
        day_number: 2,
        order_index: 4,
        video_start_seconds: 3600,
        is_completed: false,
      },
      {
        id: 'py-l5',
        title: 'Completing the Pay Up App: Calculations & Formatting',
        duration_minutes: 20,
        day_number: 2,
        order_index: 5,
        video_start_seconds: 4800,
        is_completed: false,
      },
      {
        id: 'py-l6',
        title: 'Final Polish: Input Guards & strip() on Service Lines',
        duration_minutes: 20,
        day_number: 2,
        order_index: 6,
        video_start_seconds: 6000,
        is_completed: false,
      },
      {
        id: 'py-l7',
        title: 'Conditionals & Logical Operators in Python',
        duration_minutes: 30,
        day_number: 3,
        order_index: 7,
        video_start_seconds: 7200,
        is_completed: false,
      },
      {
        id: 'py-l8',
        title: 'While Loops and Interactive Menu Construction',
        duration_minutes: 30,
        day_number: 3,
        order_index: 8,
        video_start_seconds: 9000,
        is_completed: false,
      },
    ],
    quizzes: [
      {
        id: 'quiz-py-1',
        question: 'Why does Python syntax feel natural to read and write compared to low-level languages?',
        options: [
          'Its syntax resembles natural language, reducing cognitive load.',
          'It requires explicit manual memory allocation.',
          'It compiles to machine code faster than C.',
          'It enforces semicolons on every line.'
        ],
        correctIndex: 0,
        explanation: 'Right! The lesson highlights Python\'s clean, English-like syntax that lets learners focus on problem solving rather than language quirks.'
      },
      {
        id: 'quiz-py-2',
        question: 'In the party invitation example, what is the primary purpose of using variables?',
        options: [
          'To define new data types exclusive to Python.',
          'To increase the execution speed of the print loop.',
          'To store values that can be reused and easily changed throughout the program.',
          'To create comments that explain the code.'
        ],
        correctIndex: 2,
        explanation: 'Variables allow storing and dynamically updating state throughout program execution.'
      },
      {
        id: 'quiz-py-3',
        question: 'What prefix is used before string quotes to define a formatted string (f-string)?',
        options: ['&', 'f or F', '#', 'format()'],
        correctIndex: 1,
        explanation: 'f-strings are prefixed with "f" or "F" and allow direct interpolation of expressions within curly braces {}.'
      }
    ],
    notes: [
      {
        id: 'note-py-1',
        title: 'Naming Conventions',
        content: 'Use snake_case for variable and function names. Keep them descriptive (e.g., user_total_score instead of uts).',
        timestamp_seconds: 940,
        created_at: new Date().toISOString(),
      },
      {
        id: 'note-py-2',
        title: 'String Interpolation Trick',
        content: 'Use f"{price:.2f}" to force two decimal places when displaying currency.',
        timestamp_seconds: 2200,
        created_at: new Date().toISOString(),
      }
    ],
    flashcards: [
      {
        id: 'fc-py-1',
        concept: 'Immutable Types',
        definition: 'Data types in Python (integers, floats, strings, tuples) whose state cannot be modified after creation.'
      },
      {
        id: 'fc-py-2',
        concept: 'List Comprehension',
        definition: 'A concise syntax to create lists: [expression for item in iterable if condition].'
      },
      {
        id: 'fc-py-3',
        concept: 'Duck Typing',
        definition: '"If it walks like a duck and quacks like a duck, it\'s a duck." Python checks for methods/behaviors rather than explicit type hierarchies.'
      }
    ]
  },
  {
    key: 'neural-networks',
    url: 'https://www.youtube.com/watch?v=VMj-3S1tku0',
    title: 'Neural Networks from Scratch',
    provider: 'freeCodeCamp.org',
    total_minutes: 480, // 8 hours
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    description: 'Build a deep learning neural network from scratch in pure Python and NumPy with backpropagation and gradient descent.',
    daily_pace_minutes: 60,
    lessons: [
      {
        id: 'nn-l1',
        title: 'Introduction & Coding A Single Neuron',
        duration_minutes: 20,
        day_number: 1,
        order_index: 1,
        video_start_seconds: 0,
        is_completed: false,
      },
      {
        id: 'nn-l2',
        title: 'Layer of Neurons & Matrix Dot Products',
        duration_minutes: 20,
        day_number: 1,
        order_index: 2,
        video_start_seconds: 1200,
        is_completed: false,
      },
      {
        id: 'nn-l3',
        title: 'Batches, Layers & Vectorization with NumPy',
        duration_minutes: 20,
        day_number: 1,
        order_index: 3,
        video_start_seconds: 2400,
        is_completed: false,
      },
      {
        id: 'nn-l4',
        title: 'Activation Functions: Step, Sigmoid & ReLU',
        duration_minutes: 30,
        day_number: 2,
        order_index: 4,
        video_start_seconds: 3600,
        is_completed: false,
      },
      {
        id: 'nn-l5',
        title: 'Softmax Activation for Categorical Classification',
        duration_minutes: 30,
        day_number: 2,
        order_index: 5,
        video_start_seconds: 5400,
        is_completed: false,
      },
    ],
    quizzes: [
      {
        id: 'quiz-nn-1',
        question: 'Why is non-linearity crucial in neural network activation functions?',
        options: [
          'Without non-linearity, stacking layers collapses into a single linear transformation.',
          'It prevents weights from becoming zero.',
          'It makes forward propagation faster than backward propagation.',
          'It eliminates the need for bias terms.'
        ],
        correctIndex: 0,
        explanation: 'A composition of linear functions is just another linear function. Non-linear activation enables networks to learn arbitrary complex mappings.'
      }
    ],
    flashcards: [
      {
        id: 'fc-nn-1',
        concept: 'Forward Propagation',
        definition: 'Passing input data forward through the network layers to calculate activations and final prediction.'
      },
      {
        id: 'fc-nn-2',
        concept: 'Backpropagation',
        definition: 'Applying the calculus chain rule backward from the loss function to compute gradients with respect to every weight and bias.'
      }
    ]
  },
  {
    key: 'system-design',
    url: 'https://www.youtube.com/watch?v=m8Icp_Cid5o',
    title: 'System Design Interview – Complete Masterclass',
    provider: 'freeCodeCamp.org',
    total_minutes: 720, // 12 hours
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    description: 'Comprehensive software architecture and large-scale system design covering scalability, databases, caching, message queues, and consensus.',
    daily_pace_minutes: 60,
    lessons: [
      {
        id: 'sd-l1',
        title: 'System Design Fundamentals: Client-Server & Scaling Vertically vs Horizontally',
        duration_minutes: 25,
        day_number: 1,
        order_index: 1,
        video_start_seconds: 0,
        is_completed: false,
      },
      {
        id: 'sd-l2',
        title: 'Load Balancers & Reverse Proxies (L4 vs L7)',
        duration_minutes: 35,
        day_number: 1,
        order_index: 2,
        video_start_seconds: 1500,
        is_completed: false,
      },
      {
        id: 'sd-l3',
        title: 'Relational vs NoSQL Databases & Partitioning (Sharding)',
        duration_minutes: 30,
        day_number: 2,
        order_index: 3,
        video_start_seconds: 3600,
        is_completed: false,
      },
      {
        id: 'sd-l4',
        title: 'Caching Strategies: Cache-Aside, Write-Through & Eviction Policies',
        duration_minutes: 30,
        day_number: 2,
        order_index: 4,
        video_start_seconds: 5400,
        is_completed: false,
      },
    ],
    quizzes: [
      {
        id: 'quiz-sd-1',
        question: 'Under the CAP theorem, what trade-off must a distributed system make during a network partition?',
        options: [
          'Choose between Consistency or Availability.',
          'Choose between CPU speed and Memory cache.',
          'Choose between REST or GraphQL.',
          'Choose between SQL or Document storage.'
        ],
        correctIndex: 0,
        explanation: 'When a network partition (P) occurs, the system must either accept stale data for availability (AP) or reject requests for consistency (CP).'
      }
    ],
    flashcards: [
      {
        id: 'fc-sd-1',
        concept: 'Consistent Hashing',
        definition: 'A distributed hashing scheme where changing the number of servers minimizes the number of keys that must be remapped.'
      }
    ]
  }
];

export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Handle standard watch url: youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Handle short url: youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Handle embed url: youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return null;
}

export function isAllowlistedEmbedUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'www.youtube.com' ||
      host === 'youtube.com' ||
      host === 'youtu.be' ||
      host === 'www.youtube-nocookie.com' ||
      host === 'youtube-nocookie.com'
    );
  } catch {
    return false;
  }
}

/**
 * Honest YouTube & preset parser.
 * Never silently substitutes a fallback sample video ID for invalid/unrecognized links.
 */
export function parseYouTubeUrlOrPreset(url: string): ParsedVideoInfo | null {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. Check if matches one of our curated preset masterclasses
  const matchedPreset = PRESET_COURSES.find(
    (p) => p.url.toLowerCase() === trimmed.toLowerCase() || trimmed.includes(p.key)
  );

  if (matchedPreset) {
    const videoId = extractYouTubeVideoId(matchedPreset.url);
    return {
      videoId,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : '',
      thumbnailUrl: matchedPreset.thumbnail_url,
      suggestedTitle: matchedPreset.title,
      suggestedDuration: matchedPreset.total_minutes,
      suggestedProvider: matchedPreset.provider,
      isPreset: true,
    };
  }

  // 2. Check if it's a valid YouTube URL
  const videoId = extractYouTubeVideoId(trimmed);
  if (videoId) {
    return {
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      suggestedTitle: undefined, // Do not fake metadata
      suggestedDuration: undefined, // Ask user to confirm
      suggestedProvider: 'YouTube',
      isPreset: false,
    };
  }

  // Not a recognized YouTube link
  return null;
}

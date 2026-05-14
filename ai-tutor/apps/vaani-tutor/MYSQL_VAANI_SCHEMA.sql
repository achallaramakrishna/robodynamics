-- ============================================
-- VAANI TUTOR - MySQL Schema for Progress Tracking
-- ============================================

-- Students table
CREATE TABLE IF NOT EXISTS vaani_students (
  id VARCHAR(128) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) DEFAULT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lesson completions (granular tracking)
CREATE TABLE IF NOT EXISTS vaani_lesson_completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(128) NOT NULL,
  lesson_id VARCHAR(64) NOT NULL,
  level INT NOT NULL,
  completed_at DATETIME(3) NOT NULL,
  xp_earned INT NOT NULL DEFAULT 0,
  stars_earned INT NOT NULL DEFAULT 0,
  accuracy INT NOT NULL DEFAULT 0,
  hints_used INT NOT NULL DEFAULT 0,
  mastered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_student_lesson (student_id, lesson_id),
  FOREIGN KEY (student_id) REFERENCES vaani_students(id) ON DELETE CASCADE,
  INDEX idx_level (level),
  INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Level statistics (aggregated, updated on lesson completion)
CREATE TABLE IF NOT EXISTS vaani_level_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(128) NOT NULL,
  level INT NOT NULL,
  total_lessons INT NOT NULL DEFAULT 0,
  completed_lessons INT NOT NULL DEFAULT 0,
  mastered_lessons INT NOT NULL DEFAULT 0,
  total_xp INT NOT NULL DEFAULT 0,
  badges_earned JSON DEFAULT NULL,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_practice_date DATE DEFAULT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_student_level (student_id, level),
  FOREIGN KEY (student_id) REFERENCES vaani_students(id) ON DELETE CASCADE,
  INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student game profile (overall stats)
CREATE TABLE IF NOT EXISTS vaani_student_profiles (
  student_id VARCHAR(128) NOT NULL PRIMARY KEY,
  total_xp INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_practice_date DATE DEFAULT NULL,
  all_badges_earned JSON DEFAULT NULL,
  last_synced_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (student_id) REFERENCES vaani_students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Snapshot for quick access (denormalized for performance)
CREATE TABLE IF NOT EXISTS vaani_student_snapshots (
  student_id VARCHAR(128) NOT NULL PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL DEFAULT '',
  profile_json JSON NOT NULL,
  completions_json JSON NOT NULL,
  level_stats_json JSON NOT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (student_id) REFERENCES vaani_students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

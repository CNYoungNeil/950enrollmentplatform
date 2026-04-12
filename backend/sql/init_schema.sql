-- Course Platform initial schema
-- MySQL 8.x

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
    `name` VARCHAR(100) NOT NULL COMMENT 'User full name',
    `email` VARCHAR(150) NOT NULL COMMENT 'Login email, must be unique',
    `password_hash` VARCHAR(255) NOT NULL COMMENT 'Encrypted password hash',
    `role` TINYINT NOT NULL COMMENT 'User role: 1=student, 2=instructor',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'User status: 1=active, 2=disabled',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record update time',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System users';

CREATE TABLE IF NOT EXISTS `courses` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
    `course_code` VARCHAR(50) NOT NULL COMMENT 'Course code, for example CSCI933',
    `title` VARCHAR(200) NOT NULL COMMENT 'Course title',
    `description` TEXT NULL COMMENT 'Course description',
    `semester` VARCHAR(50) NULL COMMENT 'Semester information, for example 2026 Autumn',
    `instructor_id` BIGINT UNSIGNED NOT NULL COMMENT 'Course instructor user id, references users.id',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Course status: 1=draft, 2=published, 3=archived',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record update time',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_courses_course_code` (`course_code`),
    KEY `idx_courses_instructor_id` (`instructor_id`),
    CONSTRAINT `fk_courses_instructor_id` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Courses created on the platform';

CREATE TABLE IF NOT EXISTS `enrollments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
    `course_id` BIGINT UNSIGNED NOT NULL COMMENT 'Course id, references courses.id',
    `student_id` BIGINT UNSIGNED NOT NULL COMMENT 'Student user id, references users.id',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Enrollment status: 1=enrolled, 2=dropped, 3=completed',
    `enrolled_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Enrollment time',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record update time',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_enrollments_course_student` (`course_id`, `student_id`),
    KEY `idx_enrollments_student_id` (`student_id`),
    CONSTRAINT `fk_enrollments_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
    CONSTRAINT `fk_enrollments_student_id` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Relationship between students and courses';

CREATE TABLE IF NOT EXISTS `course_sections` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
    `course_id` BIGINT UNSIGNED NOT NULL COMMENT 'Course id, references courses.id',
    `creator_id` BIGINT UNSIGNED NOT NULL COMMENT 'Section creator user id, usually instructor, references users.id',
    `title` VARCHAR(200) NOT NULL COMMENT 'Section title, for example Assignment 1 or Lecture presentations',
    `section_type` TINYINT NOT NULL COMMENT 'Section type: 1=materials, 2=announcement, 3=article, 4=lecture_presentation, 5=assignment',
    `description_text` TEXT NULL COMMENT 'Section description text shown on the page',
    `due_at` DATETIME NULL COMMENT 'Assignment deadline, mainly used when section_type=5 assignment',
    `display_order` INT NOT NULL DEFAULT 0 COMMENT 'Display order within the course page, smaller value first',
    `is_published` TINYINT NOT NULL DEFAULT 1 COMMENT 'Publish status: 1=published, 2=hidden',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record update time',
    PRIMARY KEY (`id`),
    KEY `idx_course_sections_course_id` (`course_id`),
    KEY `idx_course_sections_creator_id` (`creator_id`),
    KEY `idx_course_sections_type` (`section_type`),
    CONSTRAINT `fk_course_sections_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
    CONSTRAINT `fk_course_sections_creator_id` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='All course content sections including materials, announcements, articles, lecture presentations, and assignments';

CREATE TABLE IF NOT EXISTS `course_section_files` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
    `section_id` BIGINT UNSIGNED NOT NULL COMMENT 'Section id, references course_sections.id',
    `file_name` VARCHAR(255) NOT NULL COMMENT 'Original display file name',
    `file_url` VARCHAR(500) NOT NULL COMMENT 'File access url or storage path',
    `file_type` TINYINT NOT NULL DEFAULT 1 COMMENT 'File type: 1=pdf, 2=doc, 3=docx, 4=ppt, 5=pptx, 6=zip, 7=image, 8=video, 9=other',
    `display_order` INT NOT NULL DEFAULT 0 COMMENT 'Display order within the section, smaller value first',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
    PRIMARY KEY (`id`),
    KEY `idx_course_section_files_section_id` (`section_id`),
    CONSTRAINT `fk_course_section_files_section_id` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Files attached to a course section';

CREATE TABLE IF NOT EXISTS `discussion_posts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
    `course_id` BIGINT UNSIGNED NOT NULL COMMENT 'Course id, references courses.id',
    `author_id` BIGINT UNSIGNED NOT NULL COMMENT 'Post author user id, references users.id',
    `parent_id` BIGINT UNSIGNED NULL COMMENT 'Parent post id, null means top-level thread, references discussion_posts.id',
    `title` VARCHAR(200) NULL COMMENT 'Post title, usually filled for top-level thread',
    `content` TEXT NOT NULL COMMENT 'Post body content',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Post status: 1=normal, 2=hidden, 3=deleted',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record update time',
    PRIMARY KEY (`id`),
    KEY `idx_discussion_posts_course_id` (`course_id`),
    KEY `idx_discussion_posts_author_id` (`author_id`),
    KEY `idx_discussion_posts_parent_id` (`parent_id`),
    CONSTRAINT `fk_discussion_posts_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
    CONSTRAINT `fk_discussion_posts_author_id` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_discussion_posts_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `discussion_posts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Discussion forum posts and replies';

CREATE TABLE IF NOT EXISTS `section_submissions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
    `section_id` BIGINT UNSIGNED NOT NULL COMMENT 'Assignment section id, references course_sections.id, should point to section_type=5 assignment',
    `student_id` BIGINT UNSIGNED NOT NULL COMMENT 'Student user id, references users.id',
    `file_name` VARCHAR(255) NOT NULL COMMENT 'Submitted file name',
    `file_url` VARCHAR(500) NOT NULL COMMENT 'Submitted file access url or storage path',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Submission status: 1=submitted, 2=late, 3=graded, 4=returned',
    `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Actual submission time',
    `score` DECIMAL(5,2) NULL COMMENT 'Assignment score',
    `feedback` TEXT NULL COMMENT 'Instructor feedback text',
    `graded_by` BIGINT UNSIGNED NULL COMMENT 'Grader user id, references users.id',
    `graded_at` DATETIME NULL COMMENT 'Grading completion time',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record update time',
    PRIMARY KEY (`id`),
    KEY `idx_section_submissions_section_id` (`section_id`),
    KEY `idx_section_submissions_student_id` (`student_id`),
    KEY `idx_section_submissions_graded_by` (`graded_by`),
    CONSTRAINT `fk_section_submissions_section_id` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`),
    CONSTRAINT `fk_section_submissions_student_id` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_section_submissions_graded_by` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student submissions for assignment sections';

SET FOREIGN_KEY_CHECKS = 1;

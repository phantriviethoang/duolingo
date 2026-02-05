-- =====================================================
-- Duolingo Database Schema for Visual Paradigm
-- Generated: 2026-02-05
-- Database: MySQL 8.0
-- =====================================================

-- Drop tables if exists (reverse order due to foreign keys)
DROP TABLE IF EXISTS `test_questions`;
DROP TABLE IF EXISTS `test_results`;
DROP TABLE IF EXISTS `flashcards`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `tests`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `users`;

-- =====================================================
-- Table: users
-- Description: Quản lý tài khoản người dùng
-- =====================================================
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'student' COMMENT 'Vai trò: student, teacher, admin',
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_index` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng người dùng';

-- =====================================================
-- Table: password_reset_tokens
-- Description: Token để reset mật khẩu
-- =====================================================
CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng token reset mật khẩu';

-- =====================================================
-- Table: sessions
-- Description: Quản lý phiên đăng nhập
-- =====================================================
CREATE TABLE `sessions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `ip_address` VARCHAR(45) NULL DEFAULT NULL,
  `user_agent` TEXT NULL DEFAULT NULL,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng phiên làm việc';

-- =====================================================
-- Table: tests
-- Description: Bài kiểm tra/bài thi
-- =====================================================
CREATE TABLE `tests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề bài test',
  `description` TEXT NULL DEFAULT NULL COMMENT 'Mô tả bài test',
  `duration` INT NOT NULL COMMENT 'Thời gian làm bài (phút)',
  `audio_path` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Đường dẫn file audio',
  `image_path` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Đường dẫn file hình ảnh',
  `total_questions` INT NOT NULL DEFAULT 0 COMMENT 'Tổng số câu hỏi',
  `attempts` INT NOT NULL DEFAULT 0 COMMENT 'Số lượt làm bài',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Trạng thái kích hoạt',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tests_is_active_index` (`is_active`),
  KEY `tests_created_at_index` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng bài kiểm tra';

-- =====================================================
-- Table: test_questions
-- Description: Câu hỏi của bài kiểm tra
-- =====================================================
CREATE TABLE `test_questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `test_id` BIGINT UNSIGNED NOT NULL COMMENT 'ID bài test',
  `question` TEXT NOT NULL COMMENT 'Nội dung câu hỏi',
  `options` JSON NOT NULL COMMENT 'Mảng chứa các lựa chọn',
  `correct_option_id` INT NOT NULL COMMENT 'ID đáp án đúng',
  `explanation` TEXT NULL DEFAULT NULL COMMENT 'Giải thích ngắn gọn',
  `translation` TEXT NULL DEFAULT NULL COMMENT 'Bản dịch câu hỏi',
  `detailed_explanation` TEXT NULL DEFAULT NULL COMMENT 'Giải thích chi tiết',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `test_questions_test_id_foreign` (`test_id`),
  CONSTRAINT `test_questions_test_id_foreign` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng câu hỏi';

-- =====================================================
-- Table: test_results
-- Description: Kết quả làm bài kiểm tra
-- =====================================================
CREATE TABLE `test_results` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'ID người dùng',
  `test_id` BIGINT UNSIGNED NOT NULL COMMENT 'ID bài test',
  `score` DOUBLE(8,2) NOT NULL COMMENT 'Điểm số',
  `user_answer` JSON NOT NULL COMMENT 'Câu trả lời của người dùng',
  `completed_at` TIMESTAMP NOT NULL COMMENT 'Thời gian hoàn thành',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `test_results_test_id_unique` (`test_id`),
  KEY `test_results_user_id_foreign` (`user_id`),
  KEY `test_results_test_id_foreign` (`test_id`),
  KEY `test_results_completed_at_index` (`completed_at`),
  CONSTRAINT `test_results_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `test_results_test_id_foreign` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng kết quả bài test';

-- =====================================================
-- Table: categories
-- Description: Danh mục từ vựng
-- =====================================================
CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Tên danh mục',
  `slug` VARCHAR(255) NOT NULL COMMENT 'Slug URL',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_name_index` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng danh mục';

-- =====================================================
-- Table: flashcards
-- Description: Thẻ từ vựng học tập
-- =====================================================
CREATE TABLE `flashcards` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(255) NOT NULL COMMENT 'Từ vựng',
  `phonetic` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Phiên âm',
  `meaning` VARCHAR(255) NOT NULL COMMENT 'Nghĩa của từ',
  `example` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Ví dụ sử dụng',
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT 'ID danh mục',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `flashcards_category_id_foreign` (`category_id`),
  KEY `flashcards_word_index` (`word`),
  CONSTRAINT `flashcards_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng thẻ từ vựng';

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Insert sample users
-- INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
-- ('Admin User', 'admin@example.com', '$2y$12$abcdefghijklmnopqrstuvwxyz', 'admin', NOW(), NOW()),
-- ('Teacher User', 'teacher@example.com', '$2y$12$abcdefghijklmnopqrstuvwxyz', 'teacher', NOW(), NOW()),
-- ('Student User', 'student@example.com', '$2y$12$abcdefghijklmnopqrstuvwxyz', 'student', NOW(), NOW());

-- Insert sample categories
-- INSERT INTO `categories` (`name`, `slug`, `created_at`, `updated_at`) VALUES
-- ('Basic Vocabulary', 'basic-vocabulary', NOW(), NOW()),
-- ('Grammar', 'grammar', NOW(), NOW()),
-- ('Advanced', 'advanced', NOW(), NOW());

-- =====================================================
-- End of Schema
-- =====================================================

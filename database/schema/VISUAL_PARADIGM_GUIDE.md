# Visual Paradigm - Database Schema Import Guide

## 📋 Thông tin Database Schema

**File SQL:** `duolingo_schema.sql`
**Database Type:** MySQL 8.0
**Character Set:** utf8mb4_unicode_ci
**Total Tables:** 8 bảng chính

---

## 🎯 Hướng dẫn Import vào Visual Paradigm

### Cách 1: Import từ DDL Script

1. **Mở Visual Paradigm**
2. **Tools** → **Database** → **Generate Database from ERD...**
3. Hoặc: **Database** → **Import Database Schema**
4. Chọn **Database Type**: MySQL
5. Chọn **Import from DDL Script**
6. Browse và chọn file `duolingo_schema.sql`
7. Click **Import** hoặc **Generate**

### Cách 2: Reverse Engineering từ Database

1. **Database** → **Database Configuration**
2. Add new connection (MySQL)
3. **Database** → **Reverse Database to ERD**
4. Chọn các bảng cần reverse
5. Generate ERD diagram

### Cách 3: Tạo ERD thủ công

Sử dụng thông tin chi tiết bên dưới để tạo từng entity và relationship.

---

## 📊 Chi tiết các bảng (Tables)

### 1. **USERS** - Người dùng

| Column Name       | Data Type       | Length | Nullable | Default        | Key   | Description                    |
| ----------------- | --------------- | ------ | -------- | -------------- | ----- | ------------------------------ |
| id                | BIGINT UNSIGNED | -      | NO       | AUTO_INCREMENT | PK    | ID người dùng                  |
| name              | VARCHAR         | 255    | NO       | -              | -     | Tên người dùng                 |
| email             | VARCHAR         | 255    | NO       | -              | UK    | Email (unique)                 |
| email_verified_at | TIMESTAMP       | -      | YES      | NULL           | -     | Thời gian xác thực email       |
| password          | VARCHAR         | 255    | NO       | -              | -     | Mật khẩu (hashed)              |
| role              | VARCHAR         | 20     | NO       | 'student'      | INDEX | Vai trò: student/teacher/admin |
| remember_token    | VARCHAR         | 100    | YES      | NULL           | -     | Token ghi nhớ đăng nhập        |
| created_at        | TIMESTAMP       | -      | YES      | NULL           | -     | Ngày tạo                       |
| updated_at        | TIMESTAMP       | -      | YES      | NULL           | -     | Ngày cập nhật                  |

**Indexes:**

- PRIMARY KEY: `id`
- UNIQUE: `email`
- INDEX: `role`

---

### 2. **TESTS** - Bài kiểm tra

| Column Name     | Data Type       | Length | Nullable | Default        | Key   | Description                      |
| --------------- | --------------- | ------ | -------- | -------------- | ----- | -------------------------------- |
| id              | BIGINT UNSIGNED | -      | NO       | AUTO_INCREMENT | PK    | ID bài test                      |
| title           | VARCHAR         | 255    | NO       | -              | -     | Tiêu đề bài test                 |
| description     | TEXT            | -      | YES      | NULL           | -     | Mô tả chi tiết                   |
| duration        | INT             | -      | NO       | -              | -     | Thời gian làm bài (phút)         |
| audio_path      | VARCHAR         | 255    | YES      | NULL           | -     | Đường dẫn file audio             |
| image_path      | VARCHAR         | 255    | YES      | NULL           | -     | Đường dẫn hình ảnh               |
| total_questions | INT             | -      | NO       | 0              | -     | Tổng số câu hỏi                  |
| attempts        | INT             | -      | NO       | 0              | -     | Số lượt làm bài                  |
| is_active       | TINYINT(1)      | -      | NO       | 1              | INDEX | Trạng thái: 0=disabled, 1=active |
| created_at      | TIMESTAMP       | -      | YES      | NULL           | INDEX | Ngày tạo                         |
| updated_at      | TIMESTAMP       | -      | YES      | NULL           | -     | Ngày cập nhật                    |

**Indexes:**

- PRIMARY KEY: `id`
- INDEX: `is_active`, `created_at`

---

### 3. **TEST_QUESTIONS** - Câu hỏi

| Column Name          | Data Type       | Length | Nullable | Default        | Key | Description               |
| -------------------- | --------------- | ------ | -------- | -------------- | --- | ------------------------- |
| id                   | BIGINT UNSIGNED | -      | NO       | AUTO_INCREMENT | PK  | ID câu hỏi                |
| test_id              | BIGINT UNSIGNED | -      | NO       | -              | FK  | ID bài test               |
| question             | TEXT            | -      | NO       | -              | -   | Nội dung câu hỏi          |
| options              | JSON            | -      | NO       | -              | -   | Các lựa chọn [A, B, C, D] |
| correct_option_id    | INT             | -      | NO       | -              | -   | ID đáp án đúng (0-3)      |
| explanation          | TEXT            | -      | YES      | NULL           | -   | Giải thích ngắn           |
| translation          | TEXT            | -      | YES      | NULL           | -   | Bản dịch                  |
| detailed_explanation | TEXT            | -      | YES      | NULL           | -   | Giải thích chi tiết       |
| created_at           | TIMESTAMP       | -      | YES      | NULL           | -   | Ngày tạo                  |
| updated_at           | TIMESTAMP       | -      | YES      | NULL           | -   | Ngày cập nhật             |

**Foreign Keys:**

- `test_id` → `tests(id)` ON DELETE CASCADE

---

### 4. **TEST_RESULTS** - Kết quả thi

| Column Name  | Data Type       | Length | Nullable | Default        | Key    | Description           |
| ------------ | --------------- | ------ | -------- | -------------- | ------ | --------------------- |
| id           | BIGINT UNSIGNED | -      | NO       | AUTO_INCREMENT | PK     | ID kết quả            |
| user_id      | BIGINT UNSIGNED | -      | NO       | -              | FK     | ID người dùng         |
| test_id      | BIGINT UNSIGNED | -      | NO       | -              | FK, UK | ID bài test (unique)  |
| score        | DOUBLE          | 8,2    | NO       | -              | -      | Điểm số (0.00-100.00) |
| user_answer  | JSON            | -      | NO       | -              | -      | Câu trả lời của user  |
| completed_at | TIMESTAMP       | -      | NO       | -              | INDEX  | Thời gian hoàn thành  |
| created_at   | TIMESTAMP       | -      | YES      | NULL           | -      | Ngày tạo              |
| updated_at   | TIMESTAMP       | -      | YES      | NULL           | -      | Ngày cập nhật         |

**Foreign Keys:**

- `user_id` → `users(id)` ON DELETE CASCADE
- `test_id` → `tests(id)` ON DELETE CASCADE

**Indexes:**

- PRIMARY KEY: `id`
- UNIQUE: `test_id`
- INDEX: `user_id`, `completed_at`

---

### 5. **CATEGORIES** - Danh mục

| Column Name | Data Type       | Length | Nullable | Default        | Key   | Description       |
| ----------- | --------------- | ------ | -------- | -------------- | ----- | ----------------- |
| id          | BIGINT UNSIGNED | -      | NO       | AUTO_INCREMENT | PK    | ID danh mục       |
| name        | VARCHAR         | 255    | NO       | -              | INDEX | Tên danh mục      |
| slug        | VARCHAR         | 255    | NO       | -              | UK    | Slug URL-friendly |
| created_at  | TIMESTAMP       | -      | YES      | NULL           | -     | Ngày tạo          |
| updated_at  | TIMESTAMP       | -      | YES      | NULL           | -     | Ngày cập nhật     |

**Indexes:**

- PRIMARY KEY: `id`
- UNIQUE: `slug`
- INDEX: `name`

---

### 6. **FLASHCARDS** - Thẻ từ vựng

| Column Name | Data Type       | Length | Nullable | Default        | Key   | Description       |
| ----------- | --------------- | ------ | -------- | -------------- | ----- | ----------------- |
| id          | BIGINT UNSIGNED | -      | NO       | AUTO_INCREMENT | PK    | ID flashcard      |
| word        | VARCHAR         | 255    | NO       | -              | INDEX | Từ vựng tiếng Anh |
| phonetic    | VARCHAR         | 255    | YES      | NULL           | -     | Phiên âm IPA      |
| meaning     | VARCHAR         | 255    | NO       | -              | -     | Nghĩa tiếng Việt  |
| example     | VARCHAR         | 255    | YES      | NULL           | -     | Câu ví dụ         |
| category_id | BIGINT UNSIGNED | -      | NO       | -              | FK    | ID danh mục       |
| created_at  | TIMESTAMP       | -      | YES      | NULL           | -     | Ngày tạo          |
| updated_at  | TIMESTAMP       | -      | YES      | NULL           | -     | Ngày cập nhật     |

**Foreign Keys:**

- `category_id` → `categories(id)` ON DELETE CASCADE

**Indexes:**

- PRIMARY KEY: `id`
- INDEX: `word`, `category_id`

---

### 7. **SESSIONS** - Phiên làm việc

| Column Name   | Data Type       | Length | Nullable | Default | Key   | Description              |
| ------------- | --------------- | ------ | -------- | ------- | ----- | ------------------------ |
| id            | VARCHAR         | 255    | NO       | -       | PK    | Session ID               |
| user_id       | BIGINT UNSIGNED | -      | YES      | NULL    | INDEX | ID người dùng            |
| ip_address    | VARCHAR         | 45     | YES      | NULL    | -     | Địa chỉ IP               |
| user_agent    | TEXT            | -      | YES      | NULL    | -     | Thông tin trình duyệt    |
| payload       | LONGTEXT        | -      | NO       | -       | -     | Dữ liệu session          |
| last_activity | INT             | -      | NO       | -       | INDEX | Thời gian hoạt động cuối |

**Indexes:**

- PRIMARY KEY: `id`
- INDEX: `user_id`, `last_activity`

---

### 8. **PASSWORD_RESET_TOKENS** - Token reset mật khẩu

| Column Name | Data Type | Length | Nullable | Default | Key | Description      |
| ----------- | --------- | ------ | -------- | ------- | --- | ---------------- |
| email       | VARCHAR   | 255    | NO       | -       | PK  | Email người dùng |
| token       | VARCHAR   | 255    | NO       | -       | -   | Token reset      |
| created_at  | TIMESTAMP | -      | YES      | NULL    | -   | Ngày tạo token   |

**Indexes:**

- PRIMARY KEY: `email`

---

## 🔗 Relationships (Mối quan hệ)

### One-to-Many (1:N)

1. **users → test_results**
    - Type: One-to-Many
    - Cardinality: 1 user có nhiều test_results
    - FK: `test_results.user_id` → `users.id`
    - On Delete: CASCADE

2. **tests → test_results**
    - Type: One-to-Many
    - Cardinality: 1 test có nhiều test_results
    - FK: `test_results.test_id` → `tests.id`
    - On Delete: CASCADE

3. **tests → test_questions**
    - Type: One-to-Many
    - Cardinality: 1 test có nhiều test_questions
    - FK: `test_questions.test_id` → `tests.id`
    - On Delete: CASCADE

4. **categories → flashcards**
    - Type: One-to-Many
    - Cardinality: 1 category có nhiều flashcards
    - FK: `flashcards.category_id` → `categories.id`
    - On Delete: CASCADE

---

## 🎨 Visual Paradigm Settings

### Recommended Display Options:

- ✅ Show Column Types
- ✅ Show Primary Keys
- ✅ Show Foreign Keys
- ✅ Show Indexes
- ✅ Show Constraints
- ✅ Show Column Comments
- ✅ Show Table Comments

### Layout Tips:

1. Nhóm các bảng theo chức năng:
    - **User Module**: users, sessions, password_reset_tokens
    - **Test Module**: tests, test_questions, test_results
    - **Flashcard Module**: categories, flashcards

2. Sắp xếp theo chiều:
    - Parent tables (users, tests, categories) ở trên
    - Child tables (test_results, test_questions, flashcards) ở dưới

---

## 📝 Notes

- Tất cả bảng sử dụng `InnoDB` engine (hỗ trợ foreign keys)
- Character set: `utf8mb4` (hỗ trợ emoji và Unicode đầy đủ)
- Collation: `utf8mb4_unicode_ci` (case-insensitive)
- Timestamps tự động quản lý bởi Laravel
- JSON columns cho dữ liệu động (options, user_answer)
- CASCADE delete để tự động xóa dữ liệu liên quan

---

## 🔧 Troubleshooting

### Nếu import lỗi:

1. Kiểm tra version Visual Paradigm (khuyến nghị ≥ 16.0)
2. Kiểm tra MySQL version compatibility
3. Thử import từng bảng riêng lẻ
4. Kiểm tra encoding file SQL (UTF-8)

### Nếu relationship không hiển thị:

1. Verify foreign key constraints
2. Check relationship detection settings
3. Manual create relationships nếu cần

---

**Generated:** February 5, 2026
**Author:** GitHub Copilot
**Database:** MySQL 8.0
**Framework:** Laravel 11

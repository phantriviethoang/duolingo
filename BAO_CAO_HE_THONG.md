# BÁO CÁO PHÂN TÍCH HỆ THỐNG LINGO LEARNING PLATFORM

## 2.3. Đặc tả yêu cầu hệ thống

### 2.3.1. Hệ thống yêu cầu chức năng

#### 2.3.1.1. Quản lý người dùng
- **Đăng ký tài khoản**: Người dùng có thể tạo tài khoản mới với email và mật khẩu
- **Đăng nhập/Đăng xuất**: Xác thực người dùng và quản lý phiên làm việc
- **Quản lý hồ sơ**: Cập nhật thông tin cá nhân, chọn trình độ học tập
- **Phân quyền**: Hệ thống có 3 vai trò: Student, Teacher, Admin

#### 2.3.1.2. Hệ thống học tập theo CEFR
- **6 trình độ CEFR**: A1, A2, B1, B2, C1, C2
- **Phân chia theo Part**: Mỗi trình độ có 3 phần (trừ A1 có 1 phần)
- **Lộ trình học tập**: Hiển thị tiến độ và điều kiện mở khóa
- **Chọn trình độ**: Người dùng có thể chọn trình độ hiện tại và mục tiêu

#### 2.3.1.3. Hệ thống kiểm tra
- **Tạo đề thi**: Admin có thể tạo đề thi với câu hỏi trắc nghiệm
- **Làm bài thi**: Người dùng làm bài với đồng hồ đếm ngược
- **Auto-save**: Tự động lưu tiến độ làm bài để khôi phục khi refresh
- **Nộp bài**: Tính điểm và lưu kết quả

#### 2.3.1.4. Quản lý kết quả
- **Lưu kết quả**: Điểm số, câu trả lời, thời gian hoàn thành
- **Xem lại bài**: Hiển thị đáp án đúng và giải thích chi tiết
- **Lịch sử**: Theo dõi kết quả các lần làm bài
- **Thống kê**: Báo cáo tiến độ học tập

#### 2.3.1.5. Quản trị hệ thống
- **Dashboard**: Tổng quan về hệ thống
- **Quản lý người dùng**: Xem, chỉnh sửa, xóa tài khoản
- **Quản lý đề thi**: CRUD operations cho tests và questions
- **Analytics**: Báo cáo và thống kê chi tiết

### 2.3.1.2. Yêu cầu phi chức năng

#### 2.3.1.2.1. Yêu cầu hiệu năng
- **Thời gian phản hồi**: < 2 giây cho các thao tác cơ bản
- **Tương đồng thời**: Hỗ trợ 100+ người dùng cùng lúc
- **Tối ưu**: Lazy loading cho danh sách dài
- **Cache**: Cache cho dữ liệu tĩnh và thường xuyên truy cập

#### 2.3.1.2.2. Yêu cầu bảo mật
- **Xác thực**: Bảo vệ routes với middleware
- **Phân quyền**: Role-based access control (RBAC)
- **CSRF Protection**: Ngăn chặn tấn công CSRF
- **Input Validation**: Validate và sanitize dữ liệu đầu vào

#### 2.3.1.2.3. Yêu cầu khả dụng
- **Responsive**: Tương thích mobile, tablet, desktop
- **Accessibility**: Tuân thủ WCAG 2.1 AA
- **Error Handling**: Thông báo lỗi thân thiện
- **Loading States**: Hiển thị trạng thái tải

#### 2.3.1.2.4. Yêu cầu bảo trì
- **Logging**: Ghi log lỗi và hoạt động hệ thống
- **Backup**: Tự động backup database
- **Monitoring**: Theo dõi sức khỏe hệ thống
- **Documentation**: Code documentation và API docs

## 1.2. Mô hình hóa hệ thống

### 1.2.1. Sơ đồ Use Case

#### Actors (Diễn viên)
1. **Student**: Người học
2. **Teacher**: Giáo viên  
3. **Admin**: Quản trị viên
4. **Guest**: Khách (chưa đăng nhập)

#### Use Cases chính

**Student Use Cases:**
- UC-01: Đăng ký tài khoản
- UC-02: Đăng nhập hệ thống
- UC-03: Quản lý hồ sơ cá nhân
- UC-04: Xem lộ trình học tập
- UC-05: Chọn trình độ học tập
- UC-06: Làm bài kiểm tra
- UC-07: Xem kết quả
- UC-08: Xem tiến độ học tập

**Teacher Use Cases:**
- UC-09: Quản lý học sinh
- UC-10: Tạo bài kiểm tra
- UC-11: Chấm bài và phản hồi
- UC-12: Xem báo cáo lớp học

**Admin Use Cases:**
- UC-13: Quản lý người dùng
- UC-14: Quản lý đề thi
- UC-15: Quản lý nội dung
- UC-16: Xem báo cáo hệ thống
- UC-17: Cấu hình hệ thống

**Guest Use Cases:**
- UC-18: Xem trang chủ
- UC-19: Xem giới thiệu
- UC-20: Liên hệ hỗ trợ

### 1.2.2. Sơ đồ hoạt động (Activity Diagram)

#### Activity: Quy trình làm bài kiểm tra
```
[Bắt đầu] → [Đăng nhập] → [Chọn trình độ] → [Xem lộ trình] → 
[Chọn Part] → [Kiểm tra điều kiện mở khóa] → 
{Mở khóa?}
  ├─ Yes → [Bắt đầu làm bài] → [Làm câu hỏi] → [Auto-save] → 
  │        [Hoàn thành?] → {Hoàn thành?}
  │        │           ├─ No → [Làm tiếp] → [Auto-save] → [Lặp]
  │        │           └─ Yes → [Nộp bài] → [Tính điểm] → 
  │        │                [Lưu kết quả] → [Xem kết quả] → [Kết thúc]
  └─ No → [Hiển thị thông báo khóa] → [Yêu cầu hoàn thành trước] → [Kết thúc]
```

#### Activity: Quy trình quản lý đề thi (Admin)
```
[Bắt đầu] → [Đăng nhập Admin] → [Vào Dashboard] → 
[Chọn Quản lý đề thi] → {Hành động?}
  ├─ Tạo mới → [Nhập thông tin] → [Thêm câu hỏi] → [Lưu] → [Kết thúc]
  ├─ Chỉnh sửa → [Chọn đề thi] → [Sửa thông tin] → [Lưu] → [Kết thúc]
  ├─ Xóa → [Chọn đề thi] → [Xác nhận] → [Xóa] → [Kết thúc]
  └─ Xem → [Chọn đề thi] → [Hiển thị chi tiết] → [Kết thúc]
```

### 1.2.3. Sơ đồ tuần tự (Sequence Diagram)

#### Sequence: User làm bài kiểm tra
```
Actor: Student
Objects: [Frontend] [AuthController] [TestController] [TestModel] [ResultModel]

Student → Frontend: Click "Bắt đầu làm"
Frontend → AuthController: checkAuth()
AuthController → Frontend: return user

Frontend → TestController: show(testId)
TestController → TestModel: find(testId)
TestModel → TestController: return test
TestController → Frontend: return test + questions

Student → Frontend: Select answer
Frontend → Frontend: saveToLocalStorage()
Frontend → Frontend: startAutoSaveTimer()

Student → Frontend: Submit test
Frontend → TestController: store(answers)
TestController → ResultModel: create()
TestController → TestModel: incrementAttempts()
TestController → Frontend: return result

Frontend → Student: Display result
```

#### Sequence: Admin quản lý đề thi
```
Actor: Admin
Objects: [Frontend] [AdminController] [TestController] [TestModel] [QuestionModel]

Admin → Frontend: Click "Tạo đề thi mới"
Frontend → AdminController: checkAdminRole()
AdminController → Frontend: return admin

Frontend → TestController: create()
TestController → Frontend: return create form

Admin → Frontend: Fill test form
Frontend → TestController: store(testData)
TestController → TestModel: create(testData)

Admin → Frontend: Add questions
Frontend → QuestionModel: create(questionData)
QuestionModel → Frontend: return question

Frontend → Admin: "Đề thi đã tạo thành công"
```

### 1.2.4. Biểu đồ lớp hệ thống (Class Diagram)

#### Core Classes

**User Class**
```
+ id: int
+ name: string
+ email: string
+ current_level: string
+ target_level: string
+ role: string
+ created_at: datetime
+ updated_at: datetime

+ register(userData): User
+ login(credentials): boolean
+ updateProfile(data): boolean
+ getProgress(): Progress[]
+ getResults(): Result[]
```

**Test Class**
```
+ id: int
+ title: string
+ description: text
+ duration: int
+ level: string
+ part: int
+ total_questions: int
+ attempts: int
+ is_active: boolean

+ getQuestions(): Question[]
+ calculateScore(answers): int
+ incrementAttempts(): void
+ checkUnlocked(user): boolean
```

**Question Class**
```
+ id: int
+ test_id: int
+ question_text: text
+ question_type: string
+ order: int
+ translation: text
+ explanation: text

+ getAnswers(): Answer[]
+ getCorrectAnswer(): Answer
+ checkAnswer(selected): boolean
```

**Answer Class**
```
+ id: int
+ question_id: int
+ answer_text: text
+ is_correct: boolean

+ isCorrect(): boolean
```

**Result Class**
```
+ id: int
+ user_id: int
+ test_id: int
+ answers: json
+ score: int
+ correct: int
+ total: int
+ completed_at: datetime

+ calculateScore(): int
+ getDetailedResults(): array
```

**Progress Class**
```
+ id: int
+ user_id: int
+ level: string
+ part: int
+ score: int
+ attempts: int
+ completed: boolean

+ updateProgress(score): void
+ isUnlocked(): boolean
+ getPercentage(): float
```

#### Controller Classes

**AuthController**
```
+ showLogin(): View
+ login(Request): Redirect
+ register(Request): Redirect
+ logout(): Redirect
+ updateProfile(Request): Redirect
```

**TestController**
```
+ index(): View
+ show(Test): View
+ store(Request): Redirect
+ create(): View
+ update(Test, Request): Redirect
+ destroy(Test): Redirect
+ canAccessTest(User, Test): boolean
```

**PathController**
```
+ index(): View
+ show(level): View
+ update(Request): Redirect
+ getPartProgress(User, level, part): array
+ isPartUnlocked(User, level, part): boolean
```

**ResultController**
```
+ index(): View
+ store(Request): Redirect
+ show(Result): View
+ calculateScore(answers): int
```

### 1.2.5. Thiết kế cơ sở dữ liệu

#### Database Schema

**Users Table**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    current_level VARCHAR(10) DEFAULT 'A1' COMMENT 'Current CEFR level',
    target_level VARCHAR(10) NULL COMMENT 'Target CEFR level',
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    target_part_id BIGINT NULL REFERENCES levels(id),
    is_high_quality BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Tests Table**
```sql
CREATE TABLE tests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    duration INT DEFAULT 15 COMMENT 'Duration in minutes',
    level VARCHAR(10) NOT NULL COMMENT 'CEFR level: A1, A2, B1, B2, C1, C2',
    part INT DEFAULT 1 COMMENT 'Part number within level',
    total_questions INT DEFAULT 0,
    attempts INT DEFAULT 0 COMMENT 'Number of attempts',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Test_Questions Table**
```sql
CREATE TABLE test_questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    test_id BIGINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'fill_blank') DEFAULT 'multiple_choice',
    `order` INT NOT NULL,
    translation TEXT NULL COMMENT 'Translation for learning',
    explanation TEXT NULL COMMENT 'Explanation for correct answer',
    detailed_explanation TEXT NULL COMMENT 'Detailed explanation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Answers Table**
```sql
CREATE TABLE answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_id BIGINT NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Test_Results Table**
```sql
CREATE TABLE test_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_id BIGINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    answers JSON NULL COMMENT 'User answers as JSON',
    score INT NOT NULL DEFAULT 0,
    correct INT NOT NULL DEFAULT 0,
    total INT NOT NULL DEFAULT 0,
    part_number INT NULL COMMENT 'Part number for multi-part tests',
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Levels Table**
```sql
CREATE TABLE levels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    level_name VARCHAR(10) NOT NULL UNIQUE COMMENT 'A1, A2, B1, B2, C1, C2',
    description TEXT NULL,
    total_parts INT DEFAULT 3 COMMENT 'Number of parts in this level',
    pass_score DECIMAL(5,2) DEFAULT 60.00 COMMENT 'Passing score percentage',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**User_Progress Table**
```sql
CREATE TABLE user_progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level VARCHAR(10) NOT NULL COMMENT 'CEFR level',
    part INT NOT NULL COMMENT 'Part number',
    score DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Best score achieved',
    attempts INT DEFAULT 0 COMMENT 'Number of attempts',
    completed BOOLEAN DEFAULT FALSE COMMENT 'Is this part completed',
    unlocked BOOLEAN DEFAULT TRUE COMMENT 'Is this part unlocked',
    last_attempt_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_level_part (user_id, level, part)
);
```

**Test_Sessions Table**
```sql
CREATE TABLE test_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_id BIGINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    session_data JSON NULL COMMENT 'Current session state',
    current_question INT DEFAULT 1 COMMENT 'Current question number',
    time_left INT DEFAULT 0 COMMENT 'Time remaining in seconds',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Database Relationships

**One-to-Many Relationships:**
- User → Test_Results (1:N)
- User → User_Progress (1:N)
- User → Test_Sessions (1:N)
- Test → Test_Questions (1:N)
- Test_Question → Answers (1:N)

**Many-to-Many Relationships:**
- User ↔ Test (through Test_Results)
- User ↔ Level (through User_Progress)

**Constraints & Indexes:**
- Unique constraints on email, user_level_part combinations
- Foreign key constraints with cascade delete
- Indexes on frequently queried columns (user_id, test_id, level, part)

#### Data Flow

**Test Taking Flow:**
1. User selects test → Test_Sessions created
2. User answers questions → Session data updated
3. Auto-save every 10 seconds → Session persisted
4. User submits → Test_Results created
5. User_Progress updated → Progress tracked

**Progress Tracking Flow:**
1. User completes test → Score calculated
2. User_Progress updated → Best score saved
3. Next part unlocked → If pass score achieved
4. Overall progress → Aggregated across levels

---

## Kết luận

Hệ thống Lingo Learning Platform được thiết kế với kiến trúc MVC hiện đại, sử dụng Laravel backend và React frontend. Cơ sở dữ liệu được thiết kế chuẩn hóa với các mối quan hệ rõ ràng, hỗ trợ đầy đủ các chức năng từ quản lý người dùng, hệ thống học tập theo CEFR, kiểm tra tự động đến báo cáo và phân tích.

Hệ thống đáp ứng đầy đủ các yêu cầu chức năng và phi chức năng, có khả năng mở rộng và bảo trì tốt, phù hợp cho việc triển khai thực tế.

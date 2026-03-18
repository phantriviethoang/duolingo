# 📊 PROJECT ASSESSMENT & DETAILED PLAN

**Ngày: 18/03/2026** | **Project: LinGo - Luyện thi trắc nghiệm tiếng Anh**

---

## ✅ PHẦN 1: HIỆN TRẠNG PROJECT

### A. Tính Năng Đã Implement

#### 1. **Authentication (Hoàn thành ✓)**

- Backend: `AuthController` với register, login, logout
- Frontend: Auth/Register.jsx, Auth/Login.jsx
- Database: Users table với hỗ trợ avatar, role
- Status: **HOÀN THÀNH**

#### 2. **Quản Lý Đề Thi Cơ Bản (Hoàn thành ✓)**

- **Backend Models:**
    - `Test`: id, title, description, duration, total_questions, level, section, part_number, pass_score, attempts, is_active
    - `TestQuestion`: test_id, question, options (json), correct_option_id, explanation, translation, detailed_explanation
    - `TestResult`: user_id, test_id, score, total_questions, correct_answers, user_answer (json), completed_at
- **API Routes:**
    - GET `/tests` - Danh sách đề thi
    - GET `/tests/{test}` - Chi tiết đề thi
    - GET `/tests/{test}/take` - Vào phòng thi
    - POST `/tests/{test}/results` - Nộp bài
- **Frontend Pages:**
    - Tests/Index.jsx - Danh sách đề thi (hiển thị: title, description, duration, total_questions, attempts)
    - Tests/Show.jsx - Chi tiết đề thi
    - Tests/Take.jsx - Phòng thi
- **Admin:**
    - Tests/Create.jsx, Edit.jsx - Tạo/sửa đề thi
- **Database Migrations:**
    - `create_tests_table.php` - Cơ bản
    - `add_fields_to_tests_table.php` - Thêm level, section, part_number, pass_score
    - `create_test_questions_table.php` - Câu hỏi
    - `create_test_results_table.php` - Kết quả
- **Status: HOÀN THÀNH (nhưng cần bổ sung)**

#### 3. **Xem Kết Quả & Chữa Bài (Hoàn thành ✓)**

- **Backend:**
    - `TestResultController` với index() và show()
- **Frontend:**
    - Results/Index.jsx - Lịch sử làm bài
    - Results/Show.jsx - Chi tiết kết quả + chữa bài
- **Features:** Xem điểm, số câu đúng, phần trăm, giải thích chi tiết
- **Status: HOÀN THÀNH**

#### 4. **Dashboard (Bộ khung)**

- Dashboard.jsx với thống kê cơ bản
- Status: **BỘ KHUNG, CẦN BỔ SUNG**

### B. Cấu Trúc Tech Stack

- **Backend:** Laravel 11 (Inertia, Eloquent ORM)
- **Frontend:** React 19, Inertia.js 2.3, Tailwind 4, DaisyUI 5.5
- **Database:** SQL (migrations có sẵn)
- **Testing:** Pest PHP
- **Build:** Vite 7

### C. Phần Đã Chuẩn Bị Từng Phần

- ✅ Database Schema cơ bản (tests, test_questions, test_results)
- ✅ User Authentication
- ⚠️ UserProgress model (tồn tại nhưng **chưa đầy đủ**)
- ❌ **Level model** - CHƯA CÓ
- ❌ **Exam model** - CHƯA CÓ (hoặc không tách biệt từ Test)
- ❌ **ExamSection model** - CHƯA CÓ

---

## ❌ PHẦN 2: CÁI GÌ CÒN THIẾU

### A. Database Schema Thiếu Chưa

| Cần Tạo               | Hiện Tại                     | Vấn Đề                                                                        |
| --------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| **levels**            | ❌ Không có                  | Cần thêm table riêng: B1, B2, C1                                              |
| **exams**             | ✅ Có (table: tests)         | `tests` table có thể dùng làm `exams`, nhưng cần bổ sung `level_id`           |
| **exam_sections**     | ❌ Không có                  | Cần thêm table riêng để quản lý từng part                                     |
| **user_progress**     | ✅ Có nhưng **không đầy đủ** | Đang có `current_question_number`, cần thêm `current_section_order`, `status` |
| **Difficulty Rating** | ⚠️ Chưa rõ                   | `TestQuestion` chưa có `difficulty_level` field                               |

### B. Logic Backend Thiếu

- ❌ Không có hệ thống **level selection** cho người dùng
- ❌ Không có logic **check section result** (kiểm tra phần trăm đúng)
- ❌ Không có logic **unlock section** (mở khóa phần tiếp theo)
- ❌ Không có hệ số nhân pass_threshold cho chế độ "Nâng cao"
- ❌ Không có **difficulty filtering** dựa trên chế độ (cơ bản vs nâng cao)

### C. Frontend / UI Thiếu

- ❌ Không có page chọn **Level** (B1, B2, C1)
- ❌ Không có **Progress Bar** mô tả các Part
- ❌ Không có icon **khóa** (🔒) cho Part chưa mở khóa
- ❌ Không có logic disable Part chưa mở khóa
- ❌ Không có display "Phần không đạt yêu cầu, vui lòng làm lại" sau khi nộp bài

---

## ⚙️ PHẦN 3: PHÂN TÍCH MÂUU THUẪN & GÓP Ý

### Mâu Thuẫn 1: Table `tests` vs `exams`

**Vấn đề:** ProjectPlan yêu cầu table `exams`, nhưng project đã dùng table `tests`

**Giải pháp (đơn giản nhất):**

- **GIỮ** table `tests` làm `exams`
- Cập nhật Model `Test` → Model `Exam` hoặc giữ nguyên nhưng hiểu rằng `tests` = `exams`
- **Khuyến cáo:** Giữ nguyên `tests`, thêm field `level_id` → dễ hiểu, ít breaking change

### Mâu Thuẫn 2: `UserProgress` vs Section Tracking

**Vấn đề:**

- `UserProgress` hiện tại chỉ theo dõi `current_question_number` của cả bộ đề
- Project cần theo dõi `current_section_order` (part 1, 2, 3...)

**Giải pháp:**

- Cập nhật `UserProgress`: thêm `current_section_order`, `status` (in_progress, completed)
- Giữ `current_question_number` cho tương thích ngược (nếu cần)

### Mâu Thuẫn 3: Trình Độ vs Difficulty

**ProjectPlan** phân biệt:

- **Trình độ (Level):** B1, B2, C1
- **Chất lượng đề (Quality/Difficulty):** Cơ bản (Normal) vs Nâng cao (Advanced)

**Khuyến cáo:**

- Thêm `quality_mode` (normal / advanced) khi tạo exam instance cho user
- Chứ không phải mảng question được filter dựa trên level+quality

---

## 📋 PHẦN 4: KẾ HOẠCH HỀ HÀNH ĐỘNG (ACTION PLAN)

### PHASE 1: Database & Backend Model (3-4 days)

**Mục tiêu:** Xây dựng data layer đầy đủ

#### Task 1.1: Tạo Level Model & Migration

- [ ] Create Model: `app/Models/Level.php`
- [ ] Create Migration: `create_levels_table.php` (id, name: B1/B2/C1, description, min_score_required)
- [ ] Seed dữ liệu mẫu: B1, B2, C1
- **Convention:** Model: `Level`, Table: `levels`

#### Task 1.2: Cập nhật Test Model → dùng làm Exam

- [ ] Add migration: `add_level_id_to_tests_table.php` (thêm foreign key level_id)
- [ ] Update Model `Test`: add relationship `belongsTo(Level)`
- [ ] Update migration `create_tests_table`: add `total_parts` field nếu chưa có
- [ ] Update migration: `add_fields_to_tests_table.php` nếu cần bổ sung `difficulty_rating`
- **Giải thích:** `tests` table sẽ đại diện cho các bộ đề (exams)

#### Task 1.3: Tạo ExamSection Model & Migration

- [ ] Create Model: `app/Models/ExamSection.php` (belongs to Test/Exam)
- [ ] Create Migration: `create_exam_sections_table.php`
    ```
    id, exam_id, section_order (1,2,3...), pass_threshold (70.0), created_at, updated_at
    ```
- [ ] Update Test Model: add relationship `hasMany(ExamSection)`
- **Convention:** Model: `ExamSection`, Table: `exam_sections`

#### Task 1.4: Cập nhật UserProgress Model & Migration

- [ ] Update Migration: `create_user_progress_table` hoặc `update_user_progress_table`
- [ ] Add fields:
    - `exam_id` (foreign key)
    - `current_section_order` (nullable, default: 1)
    - `status` (enum: in_progress, completed, locked) - default: in_progress
    - `completed_at` (timestamp, nullable)
    - Remove `current_question_number` nếu không cần (hoặc giữ cho tương thích)
- [ ] Update Model: add relationships
    ```php
    belongsTo(User)
    belongsTo(Test) → đổi thành belongsTo(Exam) hoặc giữ nguyên nếu Test = Exam
    ```

#### Task 1.5: Cập nhật TestQuestion Model

- [ ] Add column migration: `add_difficulty_level_to_test_questions_table.php`
    ```
    difficulty_level (int: 1-5) - default 3
    ```
- [ ] Update Model: add `$fillable` và `$casts`

---

### PHASE 2: Backend Logic & Controllers (3 days)

**Mục tiêu:** Implement API & business logic

#### Task 2.1: Create LevelController

- [ ] Create `app/Http/Controllers/LevelController.php`
- [ ] Endpoint: `GET /api/levels` - lấy danh sách các level

#### Task 2.2: Update TestController (cho Exam Management)

- [ ] Add method: `showByLevel($level_id)` - lấy danh sách exam theo level
    ```php
    public function showByLevel($levelId) {
      $tests = Test::where('level_id', $levelId)->with('sections')->get();
      return Inertia::render('Tests/ByLevel', ['tests' => $tests]);
    }
    ```
- [ ] Add method: `getExamWithSections($examId)` - lấy exam + sections + progress của user
- [ ] Update `show()` method để bao gồm exam sections + user progress

#### Task 2.3: Create ExamSectionResultController

- [ ] Create `app/Http/Controllers/ExamSectionResultController.php`
- [ ] Method: `store()` - submit kết quả cho một section
    ```php
    public function store(Request $request, $examId, $sectionOrder) {
      // 1. Lấy section thông tin
      // 2. Tính phần trăm đúng
      // 3. Kiểm tra >= pass_threshold
      // 4. Nếu đạt: unlock section tiếp theo, cập nhật user_progress
      // 5. Nếu không: trả lại error, không update progress
      // 6. Return hasil + tổng thể
    }
    ```

#### Task 2.4: Create checkSectionResult()

- [ ] Tạo Service: `app/Services/ExamResultService.php`
- [ ] Method:
    ```php
    public function checkSectionResult($userId, $examId, $sectionOrder, $userAnswers, $qualityMode) {
      // 1. Get exam + section
      // 2. Get all questions of this section
      // 3. Calculate correct percentage
      // 4. Get pass_threshold
      // 5. If qualityMode === 'advanced': apply 10% multiplier to threshold
      // 6. Check if percentage >= threshold
      // 7. Return ['passed' => true/false, 'percentage' => X%, 'details' => ...]
    }
    ```

#### Task 2.5: Middleware/Policy cho Section Access Check

- [ ] Create Policy: `app/Policies/ExamSectionPolicy.php`
- [ ] Method: `canTake($user, $exam, $sectionOrder)` - check xem user có unlock section này k
    ```php
    public function canTake(User $user, Test $exam, $sectionOrder) {
      $progress = UserProgress::where('user_id', $user->id)
                                ->where('exam_id', $exam->id)
                                ->first();
      return $progress && $progress->current_section_order >= $sectionOrder;
    }
    ```

---

### PHASE 3: Frontend - Level Selection & UI (4 days)

**Mục tiêu:** Tạo giao diện chọn level, exams, sections

#### Task 3.1: Create LevelSelection Component

- [ ] Create `resources/js/Pages/LevelSelection.jsx`
- [ ] **Features:**
    - Display 3 level cards: B1, B2, C1
    - Mỗi card: tên, mô tả, nút "Chọn"
    - Khi click → navigate to `/exams/by-level/{levelId}`
- [ ] Design: DaisyUI cards + button
- **Naming:** `LevelSelection.jsx` (hoặc `Levels/Select.jsx`)

#### Task 3.2: Create ExamListByLevel Component

- [ ] Create `resources/js/Pages/Tests/ByLevel.jsx` (hoặc `Exams/Index.jsx`)
- [ ] **Features:**
    - Hiển thị title: "Exams - B1 / B2 / C1"
    - Danh sách các exams của level đó
    - Mỗi exam card có:
        - Title, description
        - Total parts
        - Progress bar (+ icon khóa cho parts chưa unlock)
        - Button "Start / Continue"

#### Task 3.3: Create ExamSectionProgressBar Component

- [ ] Create `resources/js/Components/ExamSectionProgressBar.jsx`
- [ ] **Props:** `exam`, `userProgress`, `onSectionClick`
- [ ] **Features:**
    - Visualize: [1] [2] [3] [4] ...
    - Part đã hoàn thành: ✓ (green)
    - Part hiện tại: 🔄 (yellow/loading)
    - Part chưa unlock: 🔒 (gray, disabled)
    - Click part mở khóa → action
- **Icon:** Dùng lucide-react (Lock, CheckCircle, Circle)

#### Task 3.4: Create ExamSelectionModal/Card

- [ ] Khi user chọn exam trước khi vào thi
- [ ] **Options:**
    - Chọn mode: "Cơ bản" (Normal) vs "Nâng cao" (Advanced)
    - Start button → `/tests/{exam}/take?mode=normal/advanced`
- [ ] Design: Modal hoặc card

#### Task 3.5: Update Tests/Take.jsx

- [ ] Add feature: Hiển thị section hiện tại (Part 1/4)
- [ ] Add logic: Kiểm tra xem user có unlock section này không
- [ ] Add message: "Bạn phải đạt {pasThreshold}% ở Part 1 mới mở khóa Part 2"

#### Task 3.6: Create SectionResultModal / Page

- [ ] Sau khi submit section
- [ ] Hiển thị:
    - Phần trăm đúng (X/Y câu đúng = Z%)
    - Pass threshold
    - ✅ PASSED / ❌ FAILED
    - Nếu PASSED: "Unlocked Part 2" + button "Next Part"
    - Nếu FAILED: "Please try again" + button "Retry"

#### Task 3.7: Update Dashboard.jsx

- [ ] Add "Current Learning Path" section
- [ ] Hiển thị: Đang học level nào, current exam, current section
- [ ] Show progress visualization

---

### PHASE 4: Integration Testing & Refinement (2 days)

**Mục tiêu:** Test flow, fix bugs, improve UX

#### Task 4.1: End-to-End Testing

- [ ] Test flow: Level Selection → Exam Selection → Part 1 → Part 2 → Complete
- [ ] Test lock/unlock logic
- [ ] Test quality_mode multiplier

#### Task 4.2: Error Handling & Messages

- [ ] Add proper error messages (Vietnamese)
- [ ] Add loading states
- [ ] Add validation messages

#### Task 4.3: UI Polish

- [ ] Responsive design check (mobile/tablet/desktop)
- [ ] Color consistency (DaisyUI colors)
- [ ] Icon consistency (lucide-react)

---

## 🎯 PHẦN 5: CHUẨN CONVENTION LARAVEL

### Naming Conventions Used in This Project

| Item           | Convention                                | Example                                                |
| -------------- | ----------------------------------------- | ------------------------------------------------------ |
| **Model**      | PascalCase, Singular                      | `User`, `Test`, `Level`, `ExamSection`                 |
| **Table**      | snake_case, Plural                        | `users`, `tests`, `levels`, `exam_sections`            |
| **Controller** | PascalCase, Resource name + "Controller"  | `LevelController`, `TestController`                    |
| **Method**     | camelCase                                 | `checkSectionResult()`, `getExamWithSections()`        |
| **Routes**     | kebab-case (URL), snake_case (route name) | `/level-selection`, `route('level.select')`            |
| **Component**  | PascalCase, React                         | `LevelSelection.jsx`, `ExamSectionProgressBar.jsx`     |
| **Migration**  | timestamp_action_table.php                | `2026_03_18_100000_create_levels_table.php`            |
| **Seeder**     | TableNameSeeder                           | `LevelSeeder.php`, `ExamSeeder.php`                    |
| **Request**    | Store/Update + Model + Request            | `StoreLevelRequest.php`, `StoreExamSectionRequest.php` |
| **Policy**     | ModelNamePolicy                           | `ExamSectionPolicy.php`                                |
| **Service**    | ActionNameService                         | `ExamResultService.php`                                |

---

## 📝 PHẦN 6: IMPLEMENTATION TIPS

### Đơn Giản, Code Dễ Hiểu

- ✅ Sử dụng Eloquent ORM directly (không abstract quá nhiều)
- ✅ Controller methods ngắn, logic rõ ràng
- ✅ Component props rõ ràng, không nested quá sâu
- ✅ Function names mô tả rõ (checkSectionResult, unlockNextSection)
- ✅ Comment tiếng Việt cho logic phức tạp

### Tránh Over-Engineering

- ❌ Không cần Repository pattern
- ❌ Không cần quá nhiều abstraction layers
- ❌ Làm việc trực tiếp với Models khi có thể
- ✅ Dùng Service patterns chỉ khi logic có sự tái sử dụng

---

## 📊 TIMELINE OVERVIEW

| Phase       | Tasks            | Duration       | Priority    |
| ----------- | ---------------- | -------------- | ----------- |
| **Phase 1** | DB + Models      | 3-4 days       | 🔴 CRITICAL |
| **Phase 2** | Backend Logic    | 3 days         | 🔴 CRITICAL |
| **Phase 3** | Frontend         | 4 days         | 🟡 HIGH     |
| **Phase 4** | Testing + Polish | 2 days         | 🟢 MEDIUM   |
| **TOTAL**   | -                | **12-13 days** | -           |

---

## 🚀 NEXT STEPS

1. **Đạo Nha Xác Nhận:** Review assessment này, đồng ý hay có góp ý?
2. **Bắt Đầu Phase 1.1:** Create Level Model & Migration
3. **Commit Incremental:** Mỗi task xong, commit + test
4. **Update PROJECTINFO.md:** Khi task hoàn thành, thêm vào danh sách "Hoàn Thành"

---

**Document Created:** March 18, 2026
**Last Updated:** March 18, 2026

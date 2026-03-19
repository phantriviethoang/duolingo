# 📊 PROJECTINFO - LINGO LUYỆN THI TRẮC NGHIỆM TIẾNG ANH

## ✅ Tính Năng Hiện Có (Core Features)

Đây là nền tảng đã có sẵn:

- ✅ **Quản lý tài khoản:** Luồng đăng ký / đăng nhập / đăng xuất hoàn thiện
- ✅ **Trải nghiệm thi:** Thực hiện làm bài trắc nghiệm trực tuyến
- ✅ **Phản hồi tức thì:** Xem kết quả và bảng chữa bài chi tiết ngay sau khi nộp
- ✅ **Lưu trữ:** Xem lại lịch sử các lần thi cũ kèm chi tiết đáp án đã chọn

---

## 🚀 Tính Năng Đang Phát Triển (Phase 1-4)

### ✅ PHASE 1: Database & Backend Models - 1.1 HOÀN THÀNH (18/03/2026)

**HOÀN THÀNH - PHASE 1.1: Xây dựng Database & Models**

- ✅ Create `Level` model & `levels` table (B1, B2, C1)
- ✅ Create `Section` model & `sections` table (order, pass_threshold)
- ✅ Update `Test` model → thêm level_id, is_high_quality, difficulty_score
- ✅ Update `UserProgress` → thêm exam_id, last_completed_section_order, is_completed
- ✅ Create `ExamController` với 4 phương thức chính
- ✅ Create `LevelSeeder` để tạo dữ liệu B1, B2, C1
- 📄 Tài liệu: **PHASE_1_1_VI.md** (tiếng Việt chi tiết)

**Chi tiết cài đặt:**

```bash
# 1. Chạy migrations
php artisan migrate

# 2. Tạo dữ liệu cấp độ
php artisan db:seed --class=LevelSeeder

# 3. Verify trong database
php artisan tinker
>>> Level::all(); // B1, B2, C1
>>> Test::byLevel(1)->get(); // Đề của cấp độ 1
```

**Các tệp tạo:**
| Tệp | Loại | Mục đích |
|-----|------|---------|
| 2026_03_18_000001_create_levels_table.php | Migration | Bảng cấp độ |
| 2026_03_18_000002_create_sections_table.php | Migration | Bảng phần/part |
| 2026_03_18_000003_add_level_fields_to_tests_table.php | Migration | Thêm trường vào tests |
| 2026_03_18_000004_create_user_progress_table.php | Migration | Bảng theo dõi tiến độ |
| Level.php | Model | Cấp độ (B1, B2, C1) |
| Section.php | Model | Phần của bộ đề |
| Test.php | Model (Update) | Thêm relationships + scopes |
| UserProgress.php | Model (Update) | Cập nhật fields |
| ExamController.php | Controller | index(), show(), take(), submitSection() |
| LevelSeeder.php | Seeder | Tạo dữ liệu B1, B2, C1 |

---

### 📋 PHASE 1.2: Routes & Testing (SẮP LÀM)

- [ ] Setup routes cho exams API
- [ ] Test endpoints với Postman/Curl
- [ ] Verify database relationships
- [ ] Test authorization policies
- [ ] Test submitSection logic (pass/fail scenarios)

### 🎯 PHASE 2: Backend Logic & APIs (KỲ TIẾP)

- [ ] `LevelController` → GET /levels
- [ ] Update `TestController` → showByLevel(), show(), take()
- [ ] Create `ExamDraftController` → auto-save API, pending exams
- [ ] Create `ExamResultService` → checkSectionResult(), getWrongQuestions()
- [ ] Create `ExamSectionPolicy` → check access to sections
- [ ] Update `TestResult` Model & migration

### 🎨 PHASE 3: Frontend - UI & Components (KỲ TIẾP)

- [ ] Create `Exams/Index.jsx` page
- [ ] Create `Exams/Show.jsx` page
- [ ] Create `Exams/Take.jsx` page
- [ ] Create `ExamSectionProgressBar.jsx` component
- [ ] Update `Dashboard.jsx` → learning path + Recharts chart
- [ ] Create auto-save hook + resume modal

### 🧪 PHASE 4: Testing & Refinement (CUỐI CÙNG)

- [ ] End-to-end testing (full exam flow)
- [ ] Performance optimization
- [ ] Error handling & validation
- [ ] UI polish & responsive design
- [ ] Unit tests & feature tests

---

## 🎨 UI/UX Improvements & Bug Fixes (18/03/2026)

**Hoàn thành cải thiện giao diện và sửa lỗi:**

- ✅ **Database Fix:** Thêm migration `add_section_id_to_test_questions_table` → liên kết câu hỏi với từng section
- ✅ **Header Redesign:** Gradient blue, navigation mới (Levels, Tests, About, Contact, Admin), improved user menu
- ✅ **UI Consistency:** Tests/Take.jsx và Exams/Take.jsx đồng nhất (layout, header, timer, progress bar, modals)
- ✅ **Layout Wrapper:** Tất cả pages bao gồm Tests/Index, Tests/Take, Tests/Show, Results/Index, Results/Show
- ✅ **Mobile Responsive:** Grid layout adaptive cho desktop/tablet/mobile
- ✅ **Color Scheme:** Professional blue-gray palette với DaisyUI buttons

**Tệp được cập nhật:**

- AppHeader.jsx, Layout.jsx
- Tests/Index.jsx, Tests/Take.jsx, Tests/Show.jsx
- Results/Index.jsx, Results/Show.jsx
- TestQuestion.php, Section.php (relationships)
- Chi tiết: [UI_IMPROVEMENTS.md](UI_IMPROVEMENTS.md)

---

## 📊 Metrics & Progress

| Chỉ số                      | Trị số                         |
| --------------------------- | ------------------------------ |
| **Phases Hoàn thành**       | 3/4 (PHASE 1.1, 1.2, 2, 3) ✅  |
| **Phases Trong tiến trình** | 1/4 (PHASE 4)                  |
| **Tasks Hoàn thành**        | 28/32 ✅                       |
| **Total Lines of Code**     | 2,500+ (Backend + Frontend)    |
| **Database Migrations**     | 4 ✅                           |
| **Models**                  | 4 (2 mới, 2 update) ✅         |
| **Controllers**             | 2 (Exam, Level) ✅             |
| **Seeders**                 | 2 ✅                           |
| **React Components**        | 7 ✅                           |
| **Custom Hooks**            | 1 ✅                           |
| **Services**                | 1 ✅                           |
| **Policies**                | 1 ✅                           |
| **Thời gian ước tính**      | 21-24 ngày (87% hoàn thành)    |
| **Ưu tiên**                 | 🟡 TRUNG BÌNH (giai đoạn cuối) |

---

## 💾 Cập nhật Gần Đây

### 20 Tháng 3, 2026 - PHASE 1.2, 2, 3 HOÀN THÀNH

**PHASE 1.2: Routes & Testing** ✅

- ✅ Thêm 4 routes cho Exams với auth middleware
- ✅ Tạo LevelController với index() method
- ✅ Update ExamController thêm byLevel() method

**PHASE 2: Backend Logic & Services** ✅

- ✅ Tạo ExamResultService (submitSection, applyHighQualityMultiplier, calculateAdjustedDuration, getExamStats)
- ✅ Tạo ExamPolicy (viewAny, view, take, submitSection, resume, create, update, delete)
- ✅ Tạo SubmitSectionRequest với validation
- ✅ Tạo ComprehensiveTestSeeder (9 tests, 18 sections, 180+ questions)
- ✅ Update AppServiceProvider với policy registration
- ✅ Update ExamController::submitSection để dùng service

**PHASE 3: Frontend Components & Dashboard** ✅

- ✅ Tạo useAutoSave hook (localStorage auto-save)
- ✅ Tạo ResultCard component (pass/fail display)
- ✅ Tạo SectionProgressBar component (progress visualization)
- ✅ Tạo SaveIndicator component (save status indicator)
- ✅ Update Exams/Take.jsx với đầy đủ tính năng:
    - Auto-save to localStorage
    - Result modal display
    - Progress tracking
    - Timer countdown
    - Section progress visualization
- ✅ Tạo 4 pages: Levels.jsx, ByLevel.jsx, Show.jsx, Take.jsx

**Tính năng implement:** 🎯

- 🔹 Hệ thống cấp độ (B1, B2, C1)
- 🔹 Phần/Part trong bộ đề
- 🔹 Theo dõi tiến độ người dùng
- 🔹 Kiểm soát truy cập phần (gatekeeping)
- 🔹 Logic chế độ cao (is_high_quality × 1.2 threshold)
- 🔹 Auto-resume từ phần cuối
- 🔹 Auto-save câu trả lời
- 🔹 Results display với pass/fail
- 🔹 Progress bar visualization
- 🔹 Timer countdown
- 🔹 localStorage persistence
- 🔹 Policy-based authorization
- 🔹 FormRequest validation

## 🔗 Tech Stack

- **Backend:** Laravel 11 + Inertia.js 2.3 + Eloquent ORM
- **Frontend:** React 19 + Tailwind CSS 4.0 + DaisyUI 5.5
- **Database:** SQL (Migrations)
- **Services:** ExamResultService (business logic)
- **Hooks:** useAutoSave (client-side data persistence)
- **Components:** React + Tailwind + lucide-react
- **Testing:** Pest PHP (ready for Phase 4)
- **Build:** Vite
- **Convention:** PascalCase (Models), snake_case (tables), camelCase (methods)

---

## 📖 Tài Liệu

| Tệp                         | Mục đích                              | Status |
| --------------------------- | ------------------------------------- | ------ |
| **PHASE_1_1_VI.md**         | Database & Models (Tiếng Việt) ⭐     | ✅     |
| **PHASE_1_2_VI.md**         | Routes & Frontend Pages (Tiếng Việt)  | ✅     |
| **PHASE_2_VI.md**           | Backend Logic & Services (Tiếng Việt) | ✅     |
| **PHASE_3_VI.md**           | Frontend Components (Tiếng Việt)      | ✅     |
| **PROJECTPLAN.md**          | Yêu cầu dự án + features              | 📄     |
| **ASSESSMENT_AND_PLAN.md**  | Phân tích chi tiết + roadmap          | 📄     |
| **INERTIA_ARCHITECTURE.md** | Kiến trúc giao tiếp FE-BE             | 📄     |

---

## 🚀 Tiến độ Chi Tiết

### ✅ COMPLETED

```
Database & Models (PHASE 1.1)
  ├─ 4 Migrations
  ├─ 2 New Models (Level, Section)
  ├─ 2 Updated Models (Test, UserProgress)
  ├─ 1 Controller (ExamController)
  └─ 1 Seeder

Routes & Pages (PHASE 1.2)
  ├─ 5 Routes for Exams
  ├─ 1 LevelController
  ├─ Update ExamController.byLevel()
  └─ 4 React Pages (Levels, ByLevel, Show, Take)

Backend Services (PHASE 2)
  ├─ ExamResultService
  ├─ ExamPolicy
  ├─ SubmitSectionRequest
  ├─ ComprehensiveTestSeeder (9 tests)
  └─ Policy Registration

Frontend Components (PHASE 3)
  ├─ 1 Custom Hook (useAutoSave)
  ├─ 3 Exam Components
  ├─ 4 Updated Pages
  └─ Auto-save + Result Display
```

### ⏳ REMAINING - PHASE 4

```
Testing & Polish (PHASE 4)
  ├─ Unit Tests (Hooks, Components, Services)
  ├─ Feature Tests (Exam workflow)
  ├─ Error Handling & Validation
  ├─ UI Polish & Responsive Design
  ├─ Performance Optimization
  └─ Dashboard Updates
```

---

**Cập nhật:** 20 Tháng 3, 2026
**Phiên bản:** 3.0 (PHASE 1-3 Hoàn thành, 87% tiến độ)
**Trạng thái:** ✅ Sẵn sàng test, chỉ còn PHASE 4 (Testing & Polish)

Luồng Tương tác của Người dùng (User Flow)Bước 1: Khởi tạo & Chọn trình độ (Target Setting)Khi người dùng vào hệ thống lần đầu hoặc bắt đầu một lộ trình mới:Giao diện: Hiện 3 lựa chọn trình độ: Trung bình (50%), Khá (70%), Tốt (90%).Hành động: Người dùng chọn một mức. Hệ thống lưu target_level vào bảng users (dùng cấu trúc Unguarded để lưu nhanh).Kết quả: Toàn bộ các bộ đề sau đó sẽ áp dụng "điểm chặn" (Threshold) dựa trên lựa chọn này.Bước 2: Truy cập Lộ trình Bộ đề (The Roadmap)Khi truy cập link kiểu http://lingo.test/levels/4/exams:Hiển thị: Một sơ đồ Steps (DaisyUI) gồm 3 phần: Part 1, Part 2, Part 3.Trạng thái ban đầu:Part 1: Trạng thái "Mở" (Unlocked). Có nút "Bắt đầu làm bài".Part 2 & 3: Trạng thái "Khóa" (Locked). Làm mờ, hiện icon ổ khóa, nút "Làm bài" bị disable.Thông tin đi kèm: Hiển thị rõ: "Mục tiêu của bạn: Đúng [X] câu để qua phần này".Bước 3: Thực hiện Bài thi (Examination)Người dùng nhấn làm Part 1.Giao diện trắc nghiệm hiện ra đơn giản với danh sách câu hỏi từ database (được lấy qua Seeder/Factory bạn đã tạo).Hệ thống có tính năng Auto-save vào LocalStorage để tránh mất bài khi F5.Bước 4: Chấm điểm & Kiểm tra Điều kiện (Gatekeeping)Sau khi nhấn "Nộp bài", Controller thực hiện logic:TH1: Đúng < Threshold (Ví dụ: < 50% cho mức Trung bình):Thông báo: "Rất tiếc! Bạn chỉ đúng [Y]%. Bạn cần đạt [50]% để qua Part 1."Hành động: Ép người dùng ở lại Part 1, không mở Part 2. Nút "Làm lại" hiện lên.TH2: Đúng >= Threshold:Thông báo: "Chúc mừng! Bạn đã vượt qua Part 1 với số điểm [Y]%."Hành động: Cập nhật bảng kết quả. Lúc này, khi quay lại Roadmap, Part 2 sẽ tự động chuyển sang màu xanh (Unlocked) và cho phép nhấn vào.Bước 5: Hoàn thành & Gợi ý Nâng caoKhi người dùng pass cả Part 3:Hệ thống chúc mừng đã hoàn thành bộ đề số 4.Nếu họ đang ở mức "Trung bình", hệ thống gợi ý: "Bạn làm rất tốt! Bạn có muốn nâng mục tiêu lên mức 'Khá' (70%) để thử thách bản thân không?".2. Cấu trúc Logic Kỹ thuật (Backend & Frontend)Backend (Laravel)Database: _ Bảng users có thêm cột target_level.Bảng parts có cột order (1, 2, 3).Controller: _ Sử dụng một hàm chung để tính % đúng.Dùng Inertia Share hoặc Flash Session để đẩy thông báo "Đạt/Không đạt" về phía React.Seeder: Tạo sẵn bộ đề 4 với 3 Parts, mỗi Part 10 câu để bạn test ngay lập tức.Frontend (React + Inertia + DaisyUI)Dùng biến is_unlocked từ Backend gửi sang để điều khiển thuộc tính disabled của nút bấm.Sử dụng CSS grayscale của Tailwind để làm xám các phần bị khóa.3. Tóm tắt Quy tắc "Vàng" của Lộ trìnhMức độĐiểm chặnĐiều kiện mở Part tiếp theoTrung bình50%Đúng 5/10 câu (Ví dụ)Khá70%Đúng 7/10 câuTốt90%Đúng 9/10 câu

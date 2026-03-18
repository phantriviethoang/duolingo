# ✅ PHASE 1.1 - XÂY DỰNG DATABASE & MODELS HOÀN THÀNH

**Ngày:** 18 Tháng 3, 2026
**Trạng thái:** 🎯 Sẵn sàng chạy migrations
**Tệp tạo:** 4 Migrations, 2 Models, 1 Controller, 1 Seeder

---

## 📋 CÁC TỆP ĐÃ TẠO / CẬP NHẬT

### Migrations (4 tệp)

| Tệp                                                     | Mục đích                             | Các trường                                                                    |
| ------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| `2026_03_18_000001_create_levels_table.php`             | Tạo bảng cấp độ                      | id, name (B1/B2/C1), description                                              |
| `2026_03_18_000002_create_sections_table.php`           | Tạo bảng phần/part                   | id, test_id (FK), order (thứ tự), pass_threshold (điểm chặn)                  |
| `2026_03_18_000003_add_level_fields_to_tests_table.php` | Thêm trường vào bảng tests           | level_id (FK liên kết), is_high_quality (chế độ cao), difficulty_score        |
| `2026_03_18_000004_create_user_progress_table.php`      | Tạo bảng theo dõi tiến độ người dùng | user_id, exam_id (FK), last_completed_section_order, is_completed, timestamps |

### Models (2 mới + 2 cập nhật)

| Model                | Loại        | Thay đổi                                                                                                  |
| -------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| **Level.php**        | ✨ MỚI      | hasMany(exams), scope:byName()                                                                            |
| **Section.php**      | ✨ MỚI      | belongsTo(exam), scopes: ordered(), byOrder()                                                             |
| **Test.php**         | 🔧 CẬP NHẬT | Thêm: level_id, is_high_quality, difficulty_score + relationships + scopes                                |
| **UserProgress.php** | 🔧 CẬP NHẬT | Đổi: exam_id (trước là test_id), last_completed_section_order (trước là current_question_number) + scopes |

### Controllers (1 tệp)

| Tệp                    | Mục đích | Các phương thức                          |
| ---------------------- | -------- | ---------------------------------------- |
| **ExamController.php** | ✨ MỚI   | index(), show(), take(), submitSection() |

### Seeders (1 tệp)

| Tệp                 | Mục đích                       |
| ------------------- | ------------------------------ |
| **LevelSeeder.php** | Tạo dữ liệu cấp độ: B1, B2, C1 |

---

## 🔗 QUAN HỆ GIỮA CÁC BẢNG DỮ LIỆU

```
Level (1) ──────────── (Many) Test/Exam (Đề thi)
  ├─ id                ├─ id
  ├─ name (B1/B2/C1)   ├─ level_id (FK liên kết)
  └─ description       └─ ...

Test/Exam (1) ────────── (Many) Section (Phần/Part)
  ├─ id                ├─ id
  ├─ level_id          ├─ test_id (FK liên kết)
  └─ is_high_quality   ├─ order (1, 2, 3...)
                       └─ pass_threshold (0.7 = 70%)

User (1) ────────── (Many) UserProgress (Tiến độ người dùng)
  ├─ id                ├─ id
  └─ ...               ├─ user_id (FK liên kết)
                       ├─ exam_id (FK liên kết)
                       ├─ last_completed_section_order
                       └─ is_completed

UserProgress (Many) ──── (1) Test/Exam
  └─ exam_id (FK) ──── Test.id
```

---

## 🎯 CÁC TÍNH NĂNG CHÍNH ĐÃ IMPLEMENT

### 1. Hệ thống Cấp độ (B1, B2, C1)

- Model Level với tên + mô tả
- Scope Test.byLevel() để lọc đề theo cấp độ (ID hoặc tên)
- LevelSeeder để tạo dữ liệu cấp độ ban đầu

### 2. Đề thi theo Phần (Section-Based Exams)

- Model Section liên kết tới Test/Exam
- Mỗi bộ đề có nhiều phần (parts)
- pass_threshold cho mỗi phần (mặc định 0.7 = 70%)
- Các phần được sắp xếp theo trường `order`

### 3. Theo dõi Tiến độ của Người dùng

- UserProgress theo dõi tiến độ của người dùng trong mỗi bộ đề
- last_completed_section_order: phần cuối cùng đã hoàn thành
- is_completed: liệu toàn bộ bộ đề đã hoàn thành chưa
- started_at, completed_at: dấu thời gian

### 4. ExamController - Logic Cốt lõi

**Các phương thức:**

- `index()` - Liệt kê tất cả đề thi cho người dùng (với info cấp độ, độ khó)
- `show()` - Hiển thị chi tiết đề thi + các phần + tiến độ của người dùng
- `take()` - Vào phòng thi, hiển thị các câu hỏi của một phần
    - Hỗ trợ query param `?section=X`
    - Hỗ trợ `?resume=true` để tiếp tục từ phần cuối
    - Tạo UserProgress nếu chưa tồn tại

- `submitSection()` - **Logic chính ở đây:**
    1. Kiểm tra phần thi & đáp án hợp lệ
    2. Kiểm tra quyền truy cập của người dùng (không được bỏ qua phần)
    3. Đếm số câu trả lời đúng
    4. Tính phần trăm: số câu đúng / tổng số câu
    5. Lấy pass_threshold từ phần thi
    6. **CHẾ độ CAO**: Nếu exam.is_high_quality, nhân threshold với 1.2 (khó hơn 20%)
    7. Nếu phần trăm >= threshold → ĐẠT
        - Cập nhật: last_completed_section_order
        - Nếu phần cuối → đánh dấu is_completed = true + set completed_at
        - Trả về: redirect()->back()->with('success', [...])
    8. Nếu phần trăm < threshold → KHÔNG ĐẠT
        - Không cập nhật tiến độ
        - Trả về: redirect()->back()->with('error', [...])

---

## 📊 LUỒNG LOGIC: submitSection()

```
POST /exams/{exam}/sections/submit
├─ Xác thực: section_order, answers
├─ Lấy phần thi theo thứ tự
├─ Lấy bản ghi tiến độ của người dùng
├─ Kiểm tra quyền: user_order <= last_completed + 1
│
├─ Đếm câu trả lời đúng (vòng lặp qua các câu hỏi)
├─ Tính: percentage = correct / total
├─ Lấy pass_threshold = section.pass_threshold
│
├─ Nếu is_high_quality:
│  └─ pass_threshold *= 1.2 (tăng lên 20%)
│
├─ Nếu percentage >= pass_threshold:
│  ├─ Cập nhật user_progress.last_completed_section_order = section_order
│  ├─ Nếu section_order == total_sections:
│  │  └─ Đánh dấu is_completed = true, completed_at = bây giờ
│  └─ Trả lại: redirect()->back()->with('success', [
│      'message' => '🎉 Chúc mừng!',
│      'percentage' => 85.5,
│      'correct_count' => 17,
│      'total' => 20,
│      'passed' => true,
│      'next_section_unlocked' => true
│    ])
│
└─ Nếu không (failed):
   └─ Không cập nhật tiến độ
   └─ Trả lại: redirect()->back()->with('error', [
       'message' => '❌ Chưa đạt yêu cầu',
       'percentage' => 65,
       'required_percentage' => 70,
       'correct_count' => 13,
       'total' => 20,
       'passed' => false
     ])
```

---

## 🛠️ CÁCH CHẠY

### Bước 1: Chạy Migrations

```bash
php artisan migrate
```

Điều này sẽ tạo:

- Bảng `levels`
- Bảng `sections`
- Thêm cột vào bảng `tests`
- Bảng `user_progress`

### Bước 2: Tạo dữ liệu Cấp độ

```bash
php artisan db:seed --class=LevelSeeder
```

Hoặc chạy toàn bộ seeders:

```bash
php artisan db:seed
```

### Bước 3: (Tùy chọn) Kiểm tra trong Database

```sql
-- Kiểm tra các cấp độ
SELECT * FROM levels;
-- Nên có B1, B2, C1

-- Kiểm tra cấu trúc
DESCRIBE tests; -- Nên có level_id, is_high_quality, difficulty_score
DESCRIBE sections; -- Nên tồn tại
DESCRIBE user_progress; -- Nên tồn tại
```

---

## 📝 SCOPES (PHẠM VI TRUY VẤN)

### Model Level

```php
Level::byName('B1')->get() // Lấy cấp độ theo tên
```

### Model Section

```php
$exam->sections()->ordered()->get() // Lấy các phần theo thứ tự
Section::byOrder(1)->get() // Lấy phần với thứ tự 1
```

### Model Test

```php
Test::byLevel(1)->get() // Lọc theo ID cấp độ
Test::byLevel('B1')->get() // Lọc theo tên cấp độ
Test::highQuality()->get() // Lọc đề cao cấp chế độ cao
Test::highQuality(false)->get() // Lọc đề chế độ bình thường
```

### Model UserProgress

```php
$user->progress()->inProgress()->get() // Các bộ đề đang làm
$user->progress()->completed()->get() // Các bộ đề đã hoàn thành
```

---

## 🎬 VÍ DỤ SỬ DỤNG

### 1. Người dùng chọn Cấp độ B1

```php
$exams = Level::byName('B1')->exams()->get();
// Trả về tất cả đề thi cho cấp độ B1
```

### 2. Người dùng bắt đầu bộ đề #1

```php
// GET /exams/1/take
// Tạo UserProgress nếu chưa tồn tại
// Hiển thị câu hỏi của phần 1
```

### 3. Người dùng nộp bài Phần 1

```
// POST /exams/1/sections/submit
// {
//   "section_order": 1,
//   "answers": {
//     "1": "A",
//     "2": "B",
//     ...
//   }
// }
```

### 4. Hệ thống kiểm tra kết quả

```php
// Đếm câu đúng: ví dụ 17/20 = 85%
// pass_threshold = 0.7 (70%)
// is_high_quality = false
// 85% >= 70% → ĐẠT
// Cập nhật: last_completed_section_order = 1
// Trả lại thông báo thành công + mở khóa phần tiếp theo
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Bảng tests được gọi là "tests" nhưng được dùng làm "exams"** - Chúng là cùng một bảng. Model Test đại diện cho các bộ đề (exams) trong hệ thống.

2. **Bảng UserProgress sử dụng "exam_id"** - Đây là FK tới `tests.id` (đại diện cho các bộ đề).

3. **Logic Chế độ Cao (High-Quality):**
    - Nếu `exam.is_high_quality = true`, pass_threshold tăng thêm 20%
    - Ví dụ: Threshold bình thường 0.7 → Chế độ cao yêu cầu 0.84 (70% × 1.2)
    - Điều này làm cho các phần khó hơn

4. **Kiểm soát Truy cập Phần:**
    - Người dùng chỉ có thể làm phần có thứ tự == user_progress.last_completed_section_order + 1
    - Điều này ngăn bỏ qua các phần

5. **Giới hạn Thời gian Logic:**
    - Yêu cầu nói "giảm time_limit xuống 20% ở chế độ cao"
    - Điều này nên được xử lý ở Frontend (Tests/Take.jsx)
    - Khi `is_high_quality = true`, nhân duration với 0.8 ở client side

---

## 🔄 CÁC BƯỚC TIẾP THEO

### Frontend cần implement:

1. Tạo trang `Exams/Index.jsx` (liệt kê đề theo cấp độ)
2. Tạo trang `Exams/Show.jsx` (hiển thị các phần + tiến độ)
3. Tạo trang `Exams/Take.jsx` (hiển thị câu hỏi + nộp bài)
4. Xử lý tham số `?resume=true`
5. Xử lý giảm thời gian ở chế độ cao (0.8x duration)
6. Hiển thị flash messages từ submitSection()

### Tạo dữ liệu Database:

1. Tạo các bộ đề mẫu với level_id
2. Tạo sections cho các bộ đề
3. Test toàn bộ luồng

---

## ✅ DANH SÁCH KIỂM TRA VERIFICATION

- [ ] Migrations được tạo trong database/migrations/
- [ ] Models được tạo trong app/Models/
- [ ] Controller được tạo trong app/Http/Controllers/
- [ ] LevelSeeder được tạo
- [ ] Chạy: php artisan migrate
- [ ] Chạy: php artisan db:seed --class=LevelSeeder
- [ ] Kiểm tra các bảng trong database
- [ ] Test relationships trong tinker: Level::first()->exams
- [ ] Test scopes trong tinker: Test::byLevel(1)->get()

---

**Viết bởi:** GitHub Copilot
**Ngày:** 18 Tháng 3, 2026
**Trạng thái:** ✅ Hoàn thành & Sẵn sàng chạy Migrations

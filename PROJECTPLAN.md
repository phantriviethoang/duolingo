Bạn là một Senior Fullstack Developer (Laravel + React/Inertia).

Tôi đã có một project luyện thi trắc nghiệm tiếng Anh **đã có sẵn code base**.
Yêu cầu của bạn là **KHÔNG build lại từ đầu**, mà:

👉 **Refactor + chỉnh sửa trên code hiện có**
👉 **Tận dụng tối đa file, model, controller, migration, page đang có**
👉 Tránh tạo file mới không cần thiết

---

# 🎯 1. Mục tiêu

* Chuẩn hóa naming
* Chuẩn hóa route prefix
* Làm rõ logic: Path → Part → Test → Result → Progress
* Code clean, dễ đọc
* Không dư thừa

---

# ⚠️ 2. NGUYÊN TẮC QUAN TRỌNG

## ❌ KHÔNG làm:

* Không tạo lại project mới
* Không duplicate model/controller
* Không tạo thêm file nếu file cũ có thể sửa
* Không over-engineering

---

## ✅ PHẢI làm:

* Refactor trực tiếp trên file hiện có
* Rename hợp lý (nếu cần)
* Xóa code thừa
* Gộp logic nếu bị trùng

---

# 🧭 3. Domain chuẩn

| Concept  | Vai trò       |
| -------- | ------------- |
| User     | người dùng    |
| Path     | chọn level    |
| Part     | stage (1,2,3) |
| Test     | bộ đề         |
| Question | câu hỏi       |
| Answer   | đáp án        |
| Result   | kết quả       |
| Progress | tiến độ       |

---

# 🌐 4. Route prefix (refactor lại)

## User

```bash
/path
/path/{level}

/tests
/tests/{test}

/results
/results/{result}

/progress
/profile
```

---

## Admin

```bash
/admin
/admin/users
/admin/tests
/admin/questions
/admin/results
```

---

# 🧠 5. Refactor Controller

👉 Nếu controller đã tồn tại:

* Sửa lại method cho đúng:

  * index()
  * show()
  * store()

👉 Nếu controller bị trùng logic:

* Gộp lại (KHÔNG tạo controller mới)

---

# 🧱 6. Refactor Model & Migration

## Model:

* Giữ nguyên nếu đã có
* Chỉ thêm field nếu thiếu:

  * tests: level, part
  * users: current_level, is_admin

---

## Migration:

* Nếu chưa có:
  → thêm field bằng migration mới (không sửa file cũ đã migrate)

* Không tạo bảng mới nếu có thể reuse:

  * progress (nếu có table tương tự thì tận dụng)

---

# 🔗 7. Quan hệ cần đảm bảo

* Test → questions
* Question → answers
* User → results
* User → progress

---

# 🔄 8. Logic cần thêm/sửa

## Unlock Part

* Nếu đã có logic tương tự:
  → sửa lại cho đúng rule

* Không viết lại từ đầu

---

## Submit bài

* Dùng controller hiện có
* Chỉ thêm:

  * tính percentage
  * update progress

---

# 🖥 9. Frontend (React + Inertia)

## NGUYÊN TẮC

* Không tạo page mới nếu đã có page tương tự
* Rename file nếu tên sai
* Tái sử dụng component

---

## Pages cần có (reuse nếu có)

```bash
Path/Index.jsx
Path/Show.jsx

Tests/Index.jsx
Tests/Show.jsx

Results/Show.jsx
Progress/Index.jsx

Admin/*
```

---

## UI

* Chỉ dùng Tailwind + DaisyUI
* Không thêm lib mới
* Không animation phức tạp

---

# 🛠 10. Admin Dashboard

* Dùng controller/admin đã có nếu tồn tại
* Nếu thiếu:
  → thêm method vào controller hiện có (KHÔNG tạo controller mới nếu không cần)

---

# 🧹 11. Cleanup

* Xóa:

  * route dư
  * controller không dùng
  * code duplicate

---

# 🎯 Output mong muốn

* Refactor trực tiếp code hiện có
* Không tạo file thừa
* Naming consistent
* Route clean
* Code dễ đọc

---

Hãy thực hiện theo thứ tự:

1. Scan codebase hiện tại
2. Refactor routes
3. Refactor controller
4. Refactor model/migration
5. Refactor frontend
6. Cleanup

---

Ưu tiên:
👉 Ít thay đổi nhất nhưng hiệu quả cao nhất
👉 Không phá vỡ structure hiện tại

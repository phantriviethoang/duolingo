Các chức năng Nâng cấp với laravel backend, inertia trung gian( ko dùng api), react fe với tailwindcss, daisyui

A. Cá nhân hóa Lộ trình (Adaptive Learning)
Phân tầng trình độ: Người dùng chọn trình độ mục tiêu (B1, B2, C1).

Mở khóa theo điều kiện (Gatekeeping): * Bộ đề chia thành các Part nhỏ.

Thiết lập pass_threshold (điểm chặn). Phải đạt mức điểm này ở Part hiện tại mới được phép làm Part tiếp theo.

Chế độ High-Quality: Người dùng có yêu cầu cao sẽ được trải nghiệm bộ đề khó hơn, thời gian khắt khe hơn và điểm chặn cao hơn.

B. Cơ chế Chống mất dữ liệu (Reliability)
Auto-save (Drafting): Sử dụng useForm của Inertia để tự động gửi đáp án về server/local mỗi khi người dùng click chọn.

Resume Session: Nếu F5, sập nguồn hoặc mất mạng, hệ thống tự động khôi phục đúng câu hỏi và Section đang làm dở từ Database.

C. Dashboard Phân tích & Luyện tập lại (Analytics & Retake)
Dashboard Tiến độ: Hiển thị % hoàn thành lộ trình (ví dụ: Lộ trình B1 đạt 60%).

Lịch sử thông minh: Bảng lịch sử có tính năng Sắp xếp (Sort) theo số câu sai (từ nhiều đến ít) để nhận diện lỗ hổng kiến thức.

Chế độ "Làm lại câu sai": Một tính năng tách biệt giúp người dùng chỉ tập trung giải lại những câu đã sai trong bộ đề đó cho đến khi đúng hoàn toàn.

## 🎯 TÍNH NĂNG NÂNG CẤP - Project Luyện Thi Trắc Nghiệm Tiếng Anh

### Yêu Cầu Tổng Quát

Thêm chức năng cho người dùng:

1. **Chọn lộ trình học (Learning Path Selection):**
    - Chọn trình độ: B1, B2, C1
    - Hiển thị các bộ đề tương ứng trình độ

2. **Làm đề theo từng phần (Section-Based Exam):**
    - Mỗi bộ đề chia thành nhiều phần/parts (ví dụ: Part 1, 2, 3, 4)
    - Người dùng phải làm từng phần tuần tự
    - Mỗi phần có mốc điểm (pass_threshold), phải đạt mới mở khóa phần tiếp theo
    - Nếu không đạt: yêu cầu làm lại

3. **Chất Lượng Đề (Quality Mode):**
    - Chế độ cơ bản (Normal): Câu hỏi độ khó trung bình
    - Chế độ nâng cao (Advanced): Câu hỏi độ khó cao, pass_threshold cao hơn
    - Tính điểm: Độ khó cao → điểm đánh giá cao hơn

### 🔍 GHI CHÚ & CHỈNH SỬA MÂU THUẪN

- **[Chỉnh sửa]** Dùng một `quality_mode` parameter khi tạo instance (không load lại questions)
- **[Chỉnh sửa]** Tidak tách `exams` model riêng - dùng `tests` table làm exams, thêm `level_id`
- **[Chỉnh sửa]** Giữ `UserProgress.current_question_number` cho tương thích ngược

*

- Cấu trúc Cơ sở Dữ liệu (Database Schema)
  Để quản lý lộ trình và điều kiện mở khóa, bạn cần bổ sung các trường sau:

Table levels: id, name (B1, B2, C1), description, min_score_required.

Table exams: id, title, level_id, total_parts, difficulty_rating (1-5).

Table exam_sections: id, exam_id, section_order (1, 2, 3...), pass_threshold (ví dụ: 70%).

Table user_progress: id, user_id, exam_id, current_section_order, status (in_progress, completed).

- Logic Luồng Hoạt Động (Backend Logic)
  Hệ thống sẽ kiểm tra kết quả của section vừa làm:

Nếu % câu đúng >= pass_threshold của phần đó -> Cập nhật current_section_order lên +1.

Nếu là phần cuối cùng -> Đánh giá hoàn thành bộ đề và tính tổng điểm.

Nếu yêu cầu của người dùng là "Chất lượng cao/Nâng cao", bạn sẽ lọc các câu hỏi có difficulty_level cao hơn từ ngân hàng câu hỏi.

- Prompt 1: Thiết kế Database (Laravel Migration)
  "Viết các tệp Migration trong Laravel cho hệ thống luyện thi tiếng Anh theo trình độ (B1, B2, C1). Cần có bảng levels, bảng exams (liên kết với level), và bảng exam_sections. Mỗi exam_sections phải có trường pass_threshold (double) để quy định tỷ lệ đúng tối thiểu. Thêm bảng user_progress để lưu vết người dùng đang ở Part nào của bộ đề."

Prompt 2: Logic Kiểm tra Điều kiện (Laravel Controller)
"Viết một hàm checkSectionResult trong Laravel Controller. Khi người dùng nộp bài cho một Part, tính toán phần trăm câu đúng. Nếu lớn hơn pass_threshold, hãy cho phép người dùng tiếp tục Part tiếp theo bằng cách cập nhật bảng user_progress. Nếu không đạt, trả về thông báo lỗi yêu cầu làm lại phần này. Lưu ý: Nếu người dùng chọn chế độ 'Nâng cao', hãy áp dụng hệ số nhân cho pass_threshold khó hơn 10%."

Prompt 3: Giao diện Chọn Lộ trình (React + Tailwind)
"Viết một Component React sử dụng Tailwind CSS để hiển thị màn hình chọn trình độ (B1, B2, C1). Mỗi trình độ hiển thị dưới dạng Card. Sau khi chọn, hiển thị danh sách các bộ đề tương ứng. Với mỗi bộ đề, hiển thị một Progress Bar mô tả các Part (Phần) bên trong; phần nào chưa được mở khóa (do chưa qua phần trước) thì hiển thị biểu tượng ổ khóa và làm mờ (disabled)."

Prompt cho Backend (:

"Viết trong Laravel để lưu tạm đáp án của người dùng (Draft Answer). sẽ nhận user_id, exam_id, section_id, question_id và selected_option. Thay vì lưu vào bảng kết quả chính thức, hãy lưu vào một bảng exam_drafts để tối ưu tốc độ. Nếu người dùng đã có bản nháp cho câu hỏi đó, hãy cập nhật (update) thay vì tạo mới."

Prompt cho Frontend (Sync & Resume):

"Trong React, hãy viết một Hook hoặc Logic để:

Mỗi khi người dùng chọn đáp án, tự động gửi request đến API 'save-draft' và đồng thời lưu vào localStorage.

Khi trang được Refresh (F5) hoặc người dùng quay lại sau khi sập nguồn, hệ thống sẽ kiểm tra trong localStorage hoặc để lấy lại trạng thái bài làm cũ.

Tự động đưa người dùng đến đúng Section và câu hỏi mà họ đang làm dở trước đó."

Prompt cho UI/UX Feedback:

"Viết code React (Tailwind CSS) để hiển thị một thông báo nhỏ (Toast notification) ở góc màn hình mỗi khi hệ thống tự động lưu bài (ví dụ: 'Đã tự động lưu lúc 14:02'). Ngoài ra, nếu người dùng quay lại một bài thi đang làm dở, hãy hiển thị một Modal xác nhận: 'Bạn có một bài thi chưa hoàn thành, bạn có muốn tiếp tục từ phần đang làm dở không?' kèm nút 'Tiếp tục' và 'Làm mới từ đầu'."

Prompt cho Logic Validation:

"Viết logic xử lý khi kết thúc một Part:

Tính toán số câu đúng / tổng số câu của Part đó.

So sánh với pass_threshold của trình độ đã chọn (ví dụ C1 yêu cầu 80% đúng).

Nếu đạt: Hiển thị hiệu ứng chúc mừng (Confetti) và mở khóa nút 'Làm tiếp Phần tiếp theo'.

Nếu không đạt: Hiển thị bảng phân tích những câu sai và yêu cầu người dùng 'Luyện tập lại Phần này' trước khi được phép thi lại để qua môn."

Prompt cho Dashboard Tổng quan (React + Tailwind)
"Viết một Component Dashboard cho người dùng trong React. Dashboard bao gồm:

Tiến độ lộ trình: Một thanh Progress Bar lớn hiển thị tổng phần trăm hoàn thành của lộ trình đã chọn (ví dụ: 'Lộ trình C1: 45%').

Thống kê nhanh: 3 thẻ Card hiển thị: 'Số đề đã đạt', 'Số đề chưa đạt', và 'Trung bình điểm'.

Biểu đồ xu hướng: Sử dụng thư viện Recharts để vẽ biểu đồ đường (Line Chart) thể hiện điểm số của 10 bài thi gần nhất để người dùng thấy sự tiến bộ."

2. Prompt cho Lịch sử làm bài & Bộ lọc (Sorting/Filtering)
"Viết một bảng (Table) hiển thị lịch sử làm bài thi. Các cột bao gồm: Tên bộ đề, Trình độ, Ngày làm, Kết quả (Đạt/Không đạt - màu xanh/đỏ), Số câu sai.

Tính năng Sort: Cho phép người dùng nhấn vào tiêu đề cột 'Số câu sai' để sắp xếp từ nhiều đến ít hoặc ngược lại.

Action: Mỗi dòng có nút 'Xem chi tiết' để xem lại bài làm và nút 'Làm lại câu sai'."

3. Prompt cho Logic "Làm lại câu sai" (Backend & Frontend)
Đây là tính năng cực kỳ hữu ích giúp người dùng tập trung vào điểm yếu:

Phía Backend (Laravel):

"Viết một getWrongQuestions nhận vào attempt_id (ID của lần làm bài đó). API này sẽ truy vấn bảng exam_drafts hoặc exam_results để lọc ra danh sách các câu hỏi mà người dùng đã chọn sai đáp án. Trả về cấu hình y hệt một bộ đề thi nhưng chỉ chứa các câu hỏi bị sai này."

Phía Frontend (React):

"Tạo một chế độ thi gọi là 'Review Mode'. Khi người dùng nhấn 'Làm lại câu sai', App sẽ fetch danh sách câu hỏi từ trên. Sau khi người dùng trả lời lại đúng, hãy cập nhật trạng thái trong database là 'Đã sửa lỗi' (Fixed) để người dùng theo dõi được mình đã xóa bỏ được bao nhiêu câu sai trong tổng số câu lỗi."

4. Prompt cho Phần Đánh giá & Phân tích sau khi thi (Post-Exam Review)
"Thiết kế giao diện Review sau khi hoàn thành bài thi:

Tổng kết: Hiển thị số câu đúng/sai, thời gian hoàn thành và đánh giá (Ví dụ: 'Bạn rất giỏi phần Reading nhưng cần cải thiện Vocabulary').

Phân tích chi tiết: Liệt kê danh sách câu hỏi. Câu đúng hiển thị nền xanh, câu sai hiển thị nền đỏ.

Giải thích: Dưới mỗi câu sai, hiển thị 'Đáp án đúng là A', kèm theo mục 'Giải thích chi tiết' (Explanation) để người dùng hiểu tại sao mình sai."

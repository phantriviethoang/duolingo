- Tính năng muốn nâng cấp
về project luyện thi trắc nghiệm tiếng anh,

thêm cho tôi chức năng về cho người dùng chọn lộ trình, chọn trình độ của bản thân như trình đọ C1 b1 b2

rồi tạo bộ đề tương ứng theo trình độ người dùng chọn
kế tiếp yêu cầu người dùng làm đề, theo từng phần của bộ đề tương ứng đó, từng phần có mốc điểm nhất định mới đạt, nếu đạt mới cho làm phần tiếp theo của bộ đề đó, ứng yêu cầu bộ đề là chất lượng cao, người dùng yêu cầu cao thì bộ đề điểm đánh giá cao hơn, phần trăm câu đúng từng phần và toàn bộ cũng cao hơn,

*
+ Cấu trúc Cơ sở Dữ liệu (Database Schema)
Để quản lý lộ trình và điều kiện mở khóa, bạn cần bổ sung các trường sau:

Table levels: id, name (B1, B2, C1), description, min_score_required.

Table exams: id, title, level_id, total_parts, difficulty_rating (1-5).

Table exam_sections: id, exam_id, section_order (1, 2, 3...), pass_threshold (ví dụ: 70%).

Table user_progress: id, user_id, exam_id, current_section_order, status (in_progress, completed).

*
Logic Luồng Hoạt Động (Backend Logic)
Hệ thống sẽ kiểm tra kết quả của section vừa làm:

Nếu % câu đúng >= pass_threshold của phần đó -> Cập nhật current_section_order lên +1.

Nếu là phần cuối cùng -> Đánh giá hoàn thành bộ đề và tính tổng điểm.

Nếu yêu cầu của người dùng là "Chất lượng cao/Nâng cao", bạn sẽ lọc các câu hỏi có difficulty_level cao hơn từ ngân hàng câu hỏi.

* Prompt 1: Thiết kế Database (Laravel Migration)
"Viết các tệp Migration trong Laravel cho hệ thống luyện thi tiếng Anh theo trình độ (B1, B2, C1). Cần có bảng levels, bảng exams (liên kết với level), và bảng exam_sections. Mỗi exam_sections phải có trường pass_threshold (double) để quy định tỷ lệ đúng tối thiểu. Thêm bảng user_progress để lưu vết người dùng đang ở Part nào của bộ đề."

Prompt 2: Logic Kiểm tra Điều kiện (Laravel Controller)
"Viết một hàm checkSectionResult trong Laravel Controller. Khi người dùng nộp bài cho một Part, tính toán phần trăm câu đúng. Nếu lớn hơn pass_threshold, hãy cho phép người dùng tiếp tục Part tiếp theo bằng cách cập nhật bảng user_progress. Nếu không đạt, trả về thông báo lỗi yêu cầu làm lại phần này. Lưu ý: Nếu người dùng chọn chế độ 'Nâng cao', hãy áp dụng hệ số nhân cho pass_threshold khó hơn 10%."

Prompt 3: Giao diện Chọn Lộ trình (React + Tailwind)
"Viết một Component React sử dụng Tailwind CSS để hiển thị màn hình chọn trình độ (B1, B2, C1). Mỗi trình độ hiển thị dưới dạng Card. Sau khi chọn, hiển thị danh sách các bộ đề tương ứng. Với mỗi bộ đề, hiển thị một Progress Bar mô tả các Part (Phần) bên trong; phần nào chưa được mở khóa (do chưa qua phần trước) thì hiển thị biểu tượng ổ khóa và làm mờ (disabled)."

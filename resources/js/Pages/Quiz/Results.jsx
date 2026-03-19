// /**
//  * ⭐ Results Component - Kết quả nộp bài
//  *
//  * 📋 Hiển thị điểm số + Xác định pass/fail
//  *
//  * Props từ flash message (ExamController@submitSection):
//  * - message: "Chúc mừng" hoặc "Chưa đạt"
//  * - percentage: Điểm bạn đạt (0-100)
//  * - required_percentage: Điểm yêu cầu (60/75/90)
//  * - correct_count: Số câu đúng
//  * - total: Tổng câu hỏi
//  * - passed: true | false
//  * - exam_completed: Hoàn thành toàn bộ exam?
//  * - next_section_unlocked: Mở khóa section tiếp theo?
//  *
//  * Logic Pass/Fail:
//  * - Nếu percentage >= required_percentage → PASS ✅
//  *   - Update users_progress.last_completed_section_order
//  *   - Unlock section tiếp theo
//  * - Nếu < required_percentage → FAIL ❌
//  *   - Cho phép làm lại (reset localStorage)
//  *
//  * Action:
//  * - PASS: "Quay lại danh sách" → /levels/{level_id}/exams
//  * - FAIL: "Làm lại" → F5 reset quiz | "Quay lại" → /levels/{level_id}/exams
//  */

// import { Head, router, usePage } from "@inertiajs/react";
// import { CheckCircle, XCircle } from "lucide-react";
// import Layout from "@/Layouts/Layout";
// import React, { useEffect } from "react";

// export default function Results() {
//     const { flash } = usePage().props;

//     // ⭐ FIX: Lấy kết quả từ flash message (success hoặc error)
//     const result = flash?.success || flash?.error || {};
//     const {
//         message = "Chưa có kết quả",
//         percentage = 0,
//         correct_count = 0,
//         total = 0,
//         required_percentage = 50,
//         passed = false,
//         exam_completed = false,
//         next_section_unlocked = false,
//         questions_review = [],
//     } = result;

//     // Debug: Log flash message
//     useEffect(() => {
//         console.log("Flash message:", flash);
//         console.log("Result data:", result);
//     }, [flash, result]);

//     const handleRetry = () => {
//         // Quay lại trang trước để làm lại
//         window.history.back();
//     };

//     const handleBack = () => {
//         router.visit("/exams");
//     };

//     return (
//         <Layout>
//             <Head title={passed ? "Kết quả tốt!" : "Kết quả bài thi"} />
//             <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
//                     {/* Icon & Status */}
//                     <div className="text-center mb-8">
//                         {passed ? (
//                             <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-bounce" />
//                         ) : (
//                             <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
//                         )}
//                         <h1 className={`text-3xl font-bold mb-2 ${passed ? "text-green-600" : "text-red-600"}`}>
//                             {passed ? "🎉 Chúc mừng!" : "❌ Kết quả"}
//                         </h1>
//                     </div>

//                     {/* Message */}
//                     <p className="text-center text-gray-700 text-lg mb-8">{message}</p>

//                     {/* Score Card */}
//                     <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-8 text-white mb-8">
//                         <div className="grid grid-cols-2 gap-8 text-center">
//                             {/* Percentage */}
//                             <div>
//                                 <p className="text-sm font-semibold opacity-90 mb-2">ĐIỂM CỦA BẠN</p>
//                                 <p className="text-5xl font-bold">{percentage.toFixed(1)}%</p>
//                             </div>

//                             {/* Required Score */}
//                             <div>
//                                 <p className="text-sm font-semibold opacity-90 mb-2">YÊU CẦU</p>
//                                 <p className="text-5xl font-bold">{required_percentage}%</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Question Stats */}
//                     <div className="grid grid-cols-2 gap-4 mb-8">
//                         <div className="bg-gray-50 rounded-lg p-6 text-center border-l-4 border-green-500">
//                             <p className="text-sm text-gray-600 mb-2">Câu trả lời đúng</p>
//                             <p className="text-3xl font-bold text-green-600">
//                                 {correct_count}/{total}
//                             </p>
//                         </div>

//                         <div className="bg-gray-50 rounded-lg p-6 text-center border-l-4 border-red-500">
//                             <p className="text-sm text-gray-600 mb-2">Câu trả lời sai</p>
//                             <p className="text-3xl font-bold text-red-600">
//                                 {total - correct_count}/{total}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Status Messages */}
//                     {exam_completed && (
//                         <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-8">
//                             <p className="text-green-700 font-semibold">
//                                 ✅ Bạn đã hoàn thành toàn bộ đề thi!
//                             </p>
//                         </div>
//                     )}

//                     {next_section_unlocked && !exam_completed && (
//                         <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
//                             <p className="text-blue-700 font-semibold">
//                                 🔓 Phần tiếp theo đã được mở khóa!
//                             </p>
//                         </div>
//                     )}

//                     {!passed && (
//                         <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-8">
//                             <p className="text-yellow-700 font-semibold">
//                                 ⚠️ Bạn cần đạt {required_percentage}% để vượt qua. Hãy cố gắng lại!
//                             </p>
//                         </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="flex gap-4 flex-col sm:flex-row">
//                         {!passed ? (
//                             <button
//                                 onClick={handleRetry}
//                                 className="btn btn-primary flex-1"
//                             >
//                                 🔄 Làm lại
//                             </button>
//                         ) : null}

//                         <button
//                             onClick={handleBack}
//                             className={`btn ${passed ? "btn-primary" : "btn-outline"} flex-1`}
//                         >
//                             ← Quay lại danh sách
//                         </button>
//                     </div>
//                 </div>

//                 {/* Questions Review */}
//                 {questions_review && questions_review.length > 0 && (
//                     <div className="mt-12">
//                         <h2 className="text-2xl font-bold text-gray-900 mb-6">Đáp án chi tiết</h2>
//                         <div className="space-y-4">
//                             {questions_review.map((q, index) => {
//                                 const userAnswerValue = Object.entries(q.options || {}).find(
//                                     ([key]) => String(key) === String(q.user_answer)
//                                 )?.[1];

//                                 const correctAnswerValue = Object.entries(q.options || {}).find(
//                                     ([key]) => String(key) === String(q.correct_answer)
//                                 )?.[1];

//                                 return (
//                                     <div
//                                         key={q.id}
//                                         className={`p-4 rounded-lg border-l-4 ${q.is_correct
//                                                 ? "bg-green-50 border-green-500"
//                                                 : "bg-red-50 border-red-500"
//                                             }`}
//                                     >
//                                         <p className="font-semibold text-gray-900 mb-2">
//                                             Câu {index + 1}: {q.question}
//                                         </p>

//                                         <div className="space-y-2 text-sm">
//                                             <p className="text-gray-700">
//                                                 <span className="font-medium">Đáp án của bạn:</span>{" "}
//                                                 <span className={q.is_correct ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
//                                                     {userAnswerValue || "Không trả lời"}
//                                                 </span>
//                                             </p>
//                                             {!q.is_correct && (
//                                                 <p className="text-gray-700">
//                                                     <span className="font-medium">Đáp án đúng:</span>{" "}
//                                                     <span className="text-green-600 font-semibold">{correctAnswerValue}</span>
//                                                 </p>
//                                             )}
//                                             {q.explanation && (
//                                                 <p className="text-gray-700 bg-white/50 p-2 rounded">
//                                                     <span className="font-medium">Giải thích:</span> {q.explanation}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </Layout>
//     );
// }

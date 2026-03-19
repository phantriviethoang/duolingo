import { Head, router, usePage } from "@inertiajs/react";
import { CheckCircle, XCircle } from "lucide-react";
import Layout from "@/Layouts/Layout";

export default function Results() {
    const { flash } = usePage().props;

    // Lấy kết quả từ flash message (success hoặc error)
    const result = flash.success || flash.error || {};
    const {
        message = "Chưa có kết quả",
        percentage = 0,
        correct_count = 0,
        total = 0,
        required_percentage = 50,
        passed = false,
        exam_completed = false,
        next_section_unlocked = false,
    } = result;

    const handleRetry = () => {
        // Quay lại trang trước (sẽ reset quiz state)
        router.get(window.history.back());
    };

    const handleBack = () => {
        router.visit("/exams");
    };

    return (
        <Layout>
            <Head title={passed ? "Kết quả tốt!" : "Kết quả bài thi"} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                    {/* Icon & Status */}
                    <div className="text-center mb-8">
                        {passed ? (
                            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-bounce" />
                        ) : (
                            <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
                        )}
                        <h1 className={`text-3xl font-bold mb-2 ${passed ? "text-green-600" : "text-red-600"}`}>
                            {passed ? "🎉 Chúc mừng!" : "❌ Kết quả"}
                        </h1>
                    </div>

                    {/* Message */}
                    <p className="text-center text-gray-700 text-lg mb-8">{message}</p>

                    {/* Score Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-8 text-white mb-8">
                        <div className="grid grid-cols-2 gap-8 text-center">
                            {/* Percentage */}
                            <div>
                                <p className="text-sm font-semibold opacity-90 mb-2">ĐIỂM CỦA BẠN</p>
                                <p className="text-5xl font-bold">{percentage.toFixed(1)}%</p>
                            </div>

                            {/* Required Score */}
                            <div>
                                <p className="text-sm font-semibold opacity-90 mb-2">YÊU CẦU</p>
                                <p className="text-5xl font-bold">{required_percentage}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Question Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-lg p-6 text-center border-l-4 border-green-500">
                            <p className="text-sm text-gray-600 mb-2">Câu trả lời đúng</p>
                            <p className="text-3xl font-bold text-green-600">
                                {correct_count}/{total}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 text-center border-l-4 border-red-500">
                            <p className="text-sm text-gray-600 mb-2">Câu trả lời sai</p>
                            <p className="text-3xl font-bold text-red-600">
                                {total - correct_count}/{total}
                            </p>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {exam_completed && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-8">
                            <p className="text-green-700 font-semibold">
                                ✅ Bạn đã hoàn thành toàn bộ đề thi!
                            </p>
                        </div>
                    )}

                    {next_section_unlocked && !exam_completed && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
                            <p className="text-blue-700 font-semibold">
                                🔓 Phần tiếp theo đã được mở khóa!
                            </p>
                        </div>
                    )}

                    {!passed && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-8">
                            <p className="text-yellow-700 font-semibold">
                                ⚠️ Bạn cần đạt {required_percentage}% để vượt qua. Hãy cố gắng lại!
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 flex-col sm:flex-row">
                        {!passed ? (
                            <button
                                onClick={handleRetry}
                                className="btn btn-primary flex-1"
                            >
                                🔄 Làm lại
                            </button>
                        ) : null}

                        <button
                            onClick={handleBack}
                            className={`btn ${passed ? "btn-primary" : "btn-outline"} flex-1`}
                        >
                            ← Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

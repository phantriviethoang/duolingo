/**
 * SelectTargetLevel
 *
 * 📋 Trang chọn trình độ của người dùng
 * - 3 lựa chọn: Trung bình (60%), Khá (75%), Tốt (90%)
 * - POST /select-target-level → LevelSelectionController@store
 * - Redirect → /roadmap
 */

import { Head, router } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { CheckCircle } from "lucide-react";

export default function SelectTargetLevel() {
    const levels = [
        {
            id: 1,
            name: "Trung bình",
            value: "Trung bình",
            threshold: 60,
            description: "Bạn có thể trả lời đúng ít nhất 60% câu hỏi",
            icon: "📚",
            color: "from-blue-500 to-blue-600",
        },
        {
            id: 2,
            name: "Khá",
            value: "Khá",
            threshold: 75,
            description: "Bạn có thể trả lời đúng ít nhất 75% câu hỏi",
            icon: "🎯",
            color: "from-purple-500 to-purple-600",
        },
        {
            id: 3,
            name: "Tốt",
            value: "Tốt",
            threshold: 90,
            description: "Bạn có thể trả lời đúng ít nhất 90% câu hỏi",
            icon: "⭐",
            color: "from-amber-500 to-amber-600",
        },
    ];

    const handleSelect = (levelValue) => {
        router.post("/select-target-level", {
            target_level: levelValue,
        });
    };

    return (
        <Layout>
            <Head title="Chọn trình độ" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Chọn trình độ của bạn
                        </h1>
                        <p className="text-xl text-gray-600">
                            Hãy chọn mục tiêu học tập để có được lộ trình phù hợp
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {levels.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => handleSelect(level.value)}
                                className="group relative h-full"
                            >
                                <div
                                    className={`bg-gradient-to-br ${level.color} rounded-2xl shadow-lg p-8 text-white h-full transform transition duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer`}
                                >
                                    {/* Icon */}
                                    <div className="text-6xl mb-4">{level.icon}</div>

                                    {/* Title */}
                                    <h2 className="text-3xl font-bold mb-2">
                                        {level.name}
                                    </h2>

                                    {/* Threshold */}
                                    <div className="inline-block bg-white/20 rounded-full px-4 py-2 mb-4">
                                        <p className="text-lg font-semibold">
                                            {level.threshold}% điểm
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-lg opacity-90 mb-6 text-left">
                                        {level.description}
                                    </p>

                                    {/* Button */}
                                    <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-1 transition">
                                        <span>Chọn</span>
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Info */}
                    <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 max-w-3xl mx-auto">
                        <h3 className="font-bold text-blue-900 mb-2">
                            💡 Bạn có thể thay đổi lựa chọn sau
                        </h3>
                        <p className="text-blue-800">
                            Trình độ bạn chọn sẽ ảnh hưởng đến yêu cầu điểm số để vượt qua mỗi phần. Đừng lo lắng, bạn luôn có thể quay lại và thay đổi nếu cảm thấy không phù hợp.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

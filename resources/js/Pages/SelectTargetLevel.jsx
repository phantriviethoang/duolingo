/**
 * SelectTargetLevel
 *
 * 📋 Trang chọn trình độ của người dùng
 * - 6 lựa chọn (CEFR: A1, A2, B1, B2, C1, C2)
 * - POST /select-target-level → LevelSelectionController@store
 * - Redirect → /roadmap
 */

import { Head, router } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { CheckCircle, Info } from "lucide-react";

export default function SelectTargetLevel() {
    const levels = [
        {
            id: 1,
            value: "A1",
            name: "A1 – Beginner",
            description: "Phù hợp nếu bạn mới bắt đầu học tiếng Anh hoặc mất gốc.",
            icon: "🌱",
            color: "from-slate-500 to-slate-600",
        },
        {
            id: 2,
            value: "A2",
            name: "A2 – Elementary",
            description: "Bạn có thể giao tiếp cơ bản trong các tình huống quen thuộc.",
            icon: "🌿",
            color: "from-emerald-500 to-emerald-600",
        },
        {
            id: 3,
            value: "B1",
            name: "B1 – Intermediate",
            description: "Bạn hiểu được nội dung chính và có thể giao tiếp ở mức trung bình.",
            icon: "📘",
            color: "from-blue-500 to-blue-600",
        },
        {
            id: 4,
            value: "B2",
            name: "B2 – Upper Intermediate",
            description: "Bạn có thể giao tiếp khá tự nhiên và hiểu các nội dung phức tạp hơn.",
            icon: "🚀",
            color: "from-indigo-500 to-indigo-600",
        },
        {
            id: 5,
            value: "C1",
            name: "C1 – Advanced",
            description: "Bạn sử dụng tiếng Anh linh hoạt trong học tập và công việc.",
            icon: "🧠",
            color: "from-purple-500 to-purple-600",
        },
        {
            id: 6,
            value: "C2",
            name: "C2 – Proficient",
            description: "Bạn gần như thành thạo và sử dụng tiếng Anh như người bản xứ.",
            icon: "👑",
            color: "from-rose-500 to-rose-600",
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
            <div className="min-h-screen bg-base-200 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-base-content mb-4">
                            Chọn lộ trình luyện thi
                        </h1>
                        <p className="text-lg text-base-content/70">
                            Hãy chọn trình độ phù hợp để có một lộ trình luyện thi hiệu quả nhất.
                        </p>
                    </div>

                    {/* Banner Thông tin cá nhân hóa */}
                    <div className="alert shadow-sm max-w-3xl mx-auto mb-10 rounded-2xl bg-blue-50 border-blue-200 text-blue-900 justify-start items-start p-6">
                        <Info className="w-6 h-6 shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-xl mb-2">Lộ trình của bạn sẽ được cá nhân hóa</h3>
                            <p className="text-base mb-2">Hệ thống sẽ điều chỉnh bài tập và phân bổ độ khó dựa trên:</p>
                            <ul className="list-disc list-inside mt-2 text-base font-semibold space-y-1 ml-2">
                                <li>Trình độ hiện tại</li>
                                <li>Kết quả bài làm</li>
                                <li>Điểm mạnh và điểm yếu của bạn</li>
                            </ul>
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {levels.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => handleSelect(level.value)}
                                className="group relative text-left h-full focus:outline-none"
                            >
                                <div
                                    className={`bg-gradient-to-br ${level.color} rounded-2xl shadow-md p-6 text-white h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer flex flex-col`}
                                >
                                    {/* Icon & Title row */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-4xl bg-white/20 p-3 rounded-xl">{level.icon}</div>
                                        <h2 className="text-2xl font-bold leading-tight">
                                            {level.name}
                                        </h2>
                                    </div>

                                    {/* Description */}
                                    <p className="text-base opacity-95 mb-6 flex-grow">
                                        {level.description}
                                    </p>

                                    {/* Button */}
                                    <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform mt-auto bg-black/10 px-4 py-2 rounded-lg w-max">
                                        <span>Chọn lộ trình này</span>
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 text-center text-sm text-base-content/60">
                        <p>💡 Đừng lo lắng, bạn luôn có thể quay lại và thay đổi mục tiêu nếu cảm thấy không phù hợp.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

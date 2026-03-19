import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Lock,
    TrendingUp,
    BookOpen,
    Target,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ChevronRight,
    Award,
    HelpCircle
} from 'lucide-react';

export default function ProgressDashboard({ stats }) {
    const {
        current_level,
        level_progress,
        wrong_questions,
        weak_areas,
        recommended_level,
        recent_results
    } = stats;

    const CUSTOM_PASS_THRESHOLDS = {
        1: 60,
        2: 70,
        3: 80
    };

    const processedParts = level_progress.parts.map((part, index) => {
        const partNum = part.part;

        const requiredScore = CUSTOM_PASS_THRESHOLDS[partNum] ?? part.pass_threshold;

        const userPercentage = part.percentage || 0;
        const isPassed = userPercentage >= requiredScore;

        let isLocked = false;
        if (partNum > 1) {
            const previousPart = level_progress.parts.find(p => p.part === partNum - 1);
            if (previousPart) {
                const prevRequired = CUSTOM_PASS_THRESHOLDS[partNum - 1];
                const prevPercentage = previousPart.percentage || 0;
                isLocked = prevPercentage < prevRequired;
            }
        }

        return {
            ...part,
            pass_threshold: requiredScore,
            is_passed: isPassed,
            is_locked: isLocked,
            lock_message: isLocked ? `Hoàn thành Phần ${partNum - 1} với tối thiểu ${CUSTOM_PASS_THRESHOLDS[partNum - 1]}% để mở khóa.` : ''
        };
    });

    const processedLevelProgress = {
        ...level_progress,
        parts: processedParts
    };

    return (
        <AuthenticatedLayout fullWidth={true}>
            <Head title="Tiến độ học tập" />

            <div className="max-w-full mx-auto px-4 py-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Tiến độ học tập</h1>
                    <p className="mt-2 text-lg text-gray-600">Phân tích chi tiết quá trình rèn luyện của bạn</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <div className="card bg-slate-700 text-white shadow-lg">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-indigo-100 font-medium">Trình độ hiện tại</p>
                                        <h2 className="text-5xl font-black mt-1">{current_level}</h2>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Tiến độ Level {current_level}</span>
                                        <span>{Math.round(level_progress.parts.filter(p => p.is_passed).length / 3 * 100)}%</span>
                                    </div>
                                    <progress
                                        className="progress progress-secondary w-full bg-white/20"
                                        value={level_progress.parts.filter(p => p.is_passed).length}
                                        max="3"
                                    ></progress>
                                    <p className="text-xs text-indigo-100 italic">
                                        Đang ở: Phần {level_progress.current_part}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Trình độ đề xuất */}
                        <div className="card bg-base-100 shadow-xl border border-indigo-50">
                            <div className="card-body">
                                <h3 className="card-title text-gray-800 flex items-center">
                                    <Target className="w-5 h-5 text-indigo-500 mr-2" />
                                    Trình độ đề xuất
                                </h3>
                                <div className="flex items-center mt-4">
                                    <div className="text-4xl font-bold text-indigo-500 mr-4">{recommended_level}</div>
                                    <div className="text-sm text-gray-500">
                                        Dựa trên kết quả học tập, chúng tôi đề xuất bạn nên rèn luyện ở trình độ này.
                                    </div>
                                </div>
                                <div className="card-actions mt-6">
                                    <Link
                                        href="/path/level"
                                        className="btn btn-neutral btn-block text-white border-none font-bold"
                                    >
                                        Chuyển lộ trình ngay
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Phần đang yếu */}
                        <div className="card bg-base-100 shadow-xl border border-red-50">
                            <div className="card-body">
                                <h3 className="card-title text-gray-800 flex items-center">
                                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                                    Phần cần cải thiện
                                </h3>
                                <div className="mt-4 space-y-4">
                                    {weak_areas.map((area, idx) => (
                                        <div key={idx} className="p-3 bg-red-50 rounded-xl border border-red-100">
                                            <p className="font-bold text-red-800 text-sm">{area.area}</p>
                                            <p className="text-xs text-red-600 mt-1">{area.message}</p>
                                            <div className="mt-2 flex items-center">
                                                <span className="text-xs font-semibold text-red-700">Điểm TB: {area.avg_score}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-gray-800 mb-6">Chi tiết Level {current_level}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {processedLevelProgress.parts.map((part) => (
                                        <Link
                                            key={part.part}
                                            href={`/path/${current_level}/part-${part.part}`}
                                            className="block no-underline"
                                        >
                                            <div
                                                className={`p-5 rounded-2xl border-2 transition-all h-full ${part.is_passed
                                                    ? 'border-green-100 bg-green-50/30 hover:bg-green-100/40'
                                                    : part.is_locked
                                                        ? 'border-gray-100 bg-gray-50/50 hover:bg-gray-100/60 opacity-80'
                                                        : 'border-indigo-100 bg-indigo-50/30 ring-2 ring-indigo-500 ring-offset-2 hover:bg-indigo-100/40 cursor-pointer'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="font-bold text-gray-900 text-lg">Phần {part.part}</span>
                                                    {part.is_passed ? (
                                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                                    ) : part.is_locked ? (
                                                        <Lock className="w-6 h-6 text-gray-400" />
                                                    ) : (
                                                        <TrendingUp className="w-6 h-6 text-indigo-500 animate-pulse" />
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Trạng thái</span>
                                                        <span className={`font-semibold ${part.is_passed ? 'text-green-600' : 'text-gray-600'}`}>
                                                            {part.is_passed ? 'Đã đạt' : part.is_locked ? 'Đang khóa' : 'Đang làm'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Điểm cao nhất</span>
                                                        <span className="font-semibold text-gray-900">{part.percentage}%</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Yêu cầu đạt</span>
                                                        <span className="font-semibold text-gray-900">{part.pass_threshold}%</span>
                                                    </div>
                                                    {part.is_locked && (
                                                        <p className="text-[10px] text-red-500 leading-tight mt-2 font-medium">
                                                            {part.lock_message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Câu hỏi hay sai */}
                        <div className="card bg-base-100 shadow-xl overflow-hidden">
                            <div className="card-header bg-gray-50/50 px-8 py-4 border-b">
                                <h3 className="card-title text-gray-800 flex items-center">
                                    <HelpCircle className="w-5 h-5 text-orange-500 mr-2" />
                                    Câu hỏi hay làm sai
                                </h3>
                            </div>
                            <div className="card-body p-0">
                                {wrong_questions.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {wrong_questions.map((q, idx) => (
                                            <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="badge badge-outline badge-sm text-gray-500">{q.test_title}</span>
                                                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                                        Sai {q.wrong_count} lần
                                                    </span>
                                                </div>
                                                <p className="text-gray-900 font-medium leading-relaxed">{q.question}</p>
                                                <div className="mt-4 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                                                    <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Giải thích:</p>
                                                    <p className="text-sm text-orange-700 leading-relaxed">{q.explanation || 'Chưa có giải thích cho câu hỏi này.'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-10 text-center">
                                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-20" />
                                        <p className="text-gray-500">Bạn chưa có câu hỏi nào làm sai nhiều lần.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Kết quả gần đây */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="card-title text-gray-800">Kết quả gần đây</h3>
                                    <Link href="/results" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                                        Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr className="text-gray-400 text-xs uppercase tracking-wider">
                                                <th className="bg-transparent">Bài thi</th>
                                                <th className="bg-transparent">Kết quả</th>
                                                <th className="bg-transparent text-right">Ngày thực hiện</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recent_results.map((result, idx) => (
                                                <tr key={idx} className="hover">
                                                    <td className="font-semibold text-gray-700">{result.test_title}</td>
                                                    <td>
                                                        <div className={`badge ${result.is_passed ? 'badge-success text-white' : 'badge-error text-white'} font-bold`}>
                                                            {result.score}%
                                                        </div>
                                                    </td>
                                                    <td className="text-right text-gray-500 text-sm">{result.completed_at}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CheckCircle, Lock, Play, Clock, FileQuestion } from 'lucide-react';

export default function PathShow({ level, parts, selectedPart = null }) {
    // Định nghĩa mức điểm đạt tùy chỉnh (Bạn có thể thay đổi các giá trị này để điều chỉnh độ khó)
    const CUSTOM_PASS_THRESHOLDS = {
        1: 60, // Phần 1: Cần 60% để mở Phần 2
        2: 70, // Phần 2: Cần 70% để mở Phần 3 (Ví dụ thay đổi từ 75 xuống 70)
        3: 80, // Phần 3: Cần 80% để hoàn thành Level (Ví dụ thay đổi từ 90 xuống 80)
    };

    // Xử lý lại dữ liệu parts dựa trên mức điểm tùy chỉnh
    const processedParts = {};
    const partKeys = Object.keys(parts).map(Number).sort((a, b) => a - b);

    partKeys.forEach((partKey) => {
        const originalPart = parts[partKey];
        const userScore = originalPart.progress.score || 0;
        const requiredScore = CUSTOM_PASS_THRESHOLDS[partKey];

        // Trạng thái hoàn thành dựa trên điểm tùy chỉnh
        const isCompleted = userScore >= requiredScore;

        let isUnlocked = false;
        if (partKey === 1) {
            isUnlocked = true;
        } else {
            const previousPartKey = partKey - 1;
            const previousPart = parts[previousPartKey];
            const previousScore = previousPart.progress.score || 0;
            const previousRequired = CUSTOM_PASS_THRESHOLDS[previousPartKey];
            isUnlocked = previousScore >= previousRequired;
        }

        processedParts[partKey] = {
            ...originalPart,
            pass_score: requiredScore,
            unlocked: isUnlocked,
            progress: {
                ...originalPart.progress,
                completed: isCompleted
            }
        };
    });

    const partEntries = Object.entries(processedParts);
    const visiblePartEntries = selectedPart
        ? partEntries.filter(([partKey]) => Number(partKey) === Number(selectedPart))
        : partEntries;

    const getPartTakeHref = (part) => {
        if (!part?.tests?.length) {
            return null;
        }

        return route('path.test.take', { level, test: part.tests[0].id });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Lộ trình học: ${level}`} />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href={route('path.levels')}>
                        <button className="btn btn-outline btn-sm mb-4">
                            ← Quay lại
                        </button>
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Trình độ {level}</h1>
                    <p className="text-gray-600 font-medium">
                        {level === 'A1'
                            ? 'Hoàn thành phần này để mở khóa trình độ tiếp theo'
                            : 'Vượt qua cả 3 phần để chinh phục trình độ này'
                        }
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {partEntries.map(([partKey, part]) => (
                        <div key={part.name} className={`card bg-base-100 shadow-xl border border-gray-100 ${!part.unlocked ? 'opacity-75' : ''}`}>
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="card-title font-bold">Phần {partKey}</h2>
                                    {part.progress.completed ? (
                                        <span className="badge badge-success text-white font-bold">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Đã đạt
                                        </span>
                                    ) : part.unlocked ? (
                                        <span className="badge badge-primary text-white font-bold">Sẵn sàng</span>
                                    ) : (
                                        <span className="badge badge-neutral font-bold">
                                            <Lock className="w-3 h-3 mr-1" />
                                            Đang khóa
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span className="text-gray-500">Điểm cao nhất</span>
                                        <span className="text-gray-900 font-bold">{part.progress.score}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span className="text-gray-500">Yêu cầu</span>
                                        <span className="text-blue-600 font-bold">{part.pass_score}%</span>
                                    </div>
                                    <progress className="progress progress-primary w-full" value={part.progress.score} max="100"></progress>
                                </div>

                                <div className="text-sm text-gray-600 mb-6 space-y-2 font-medium">
                                    <div className="flex items-center">
                                        <FileQuestion className="w-4 h-4 mr-2 text-gray-400" />
                                        {part.tests.length} bài tập có sẵn
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                        {part.tests.reduce((acc, test) => acc + test.duration, 0)} phút tổng cộng
                                    </div>
                                </div>

                                <div className="card-actions">
                                    {part.unlocked ? (
                                        <Link
                                            href={getPartTakeHref(part) || route('path.tests', { level, part: Number(partKey) })}
                                            className="w-full"
                                        >
                                            <button className="btn btn-primary w-full font-bold">
                                                <Play className="w-4 h-4 mr-2 fill-current" />
                                                Bắt đầu ngay
                                            </button>
                                        </Link>
                                    ) : (
                                        <button className="btn btn-disabled w-full font-bold" disabled>
                                            <Lock className="w-4 h-4 mr-2" />
                                            Đang khóa
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

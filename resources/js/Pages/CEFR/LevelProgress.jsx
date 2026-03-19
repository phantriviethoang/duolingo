import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Lock, CheckCircle, BookOpen, Trophy, AlertCircle, ArrowLeft } from 'lucide-react';
import Layout from '@/Layouts/Layout';

const CEFRLevelProgress = ({ level, levelProgress, overallProgress, nextLevel }) => {
    const [processing, setProcessing] = useState(false);

    const handleStartPart = (part) => {
        if (part.is_locked) {
            return;
        }

        setProcessing(true);
        router.get(
            route('cefr.start-part', { level, part: part.part }),
            {},
            {
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: () => {
                    setProcessing(false);
                },
            }
        );
    };

    const getPartStatusColor = (part) => {
        if (part.is_passed) return 'bg-green-100 text-green-800 border-green-300';
        if (part.is_locked) return 'bg-red-100 text-red-800 border-red-300';
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    };

    const getPartStatusText = (part) => {
        if (part.is_passed) return `Đạt yêu cầu (${part.percentage}%)`;
        if (part.is_locked) return 'Bị khóa';
        if (part.percentage > 0) return `Chưa đạt (${part.percentage}%)`;
        return 'Chưa làm';
    };

    const getPartIcon = (part) => {
        if (part.is_passed) return <CheckCircle className="w-5 h-5" />;
        if (part.is_locked) return <Lock className="w-5 h-5" />;
        if (part.percentage > 0) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
        return <BookOpen className="w-5 h-5" />;
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'A1': return 'bg-green-500';
            case 'A2': return 'bg-lime-500';
            case 'B1': return 'bg-yellow-500';
            case 'B2': return 'bg-orange-500';
            case 'C1': return 'bg-red-500';
            case 'C2': return 'bg-purple-500';
            default: return 'bg-blue-500';
        }
    };

    const completedParts = levelProgress.parts.filter(p => p.is_passed).length;
    const overallPercentage = (completedParts / 3) * 100;

    return (
        <Layout>
            <Head title={`Trình độ ${level} - Lộ trình học`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            Trình độ {level}
                                        </h1>
                                        <p className="text-gray-600">
                                            Lộ trình học tập gồm 3 phần với yêu cầu ngày càng cao
                                        </p>
                                    </div>
                                    <Link href={route('cefr.select-level')}>
                                        <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Chọn trình độ khác
                                        </button>
                                    </Link>
                                </div>

                                {/* Overall Progress */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Tiến độ tổng thể
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {completedParts}/3 phần hoàn thành
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className={`${getLevelColor(level)} h-4 rounded-full transition-all duration-300`}
                                            style={{ width: `${overallPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {levelProgress.is_level_completed && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center">
                                            <Trophy className="w-8 h-8 text-green-600 mr-3" />
                                            <div>
                                                <h4 className="font-bold text-green-800">
                                                    Chúc mừng! Bạn đã hoàn thành trình độ {level}
                                                </h4>
                                                <p className="text-green-700">
                                                    {nextLevel ?
                                                        `Bạn có thể tiếp tục với trình độ ${nextLevel}` :
                                                        'Bạn đã đạt trình độ cao nhất!'}
                                                </p>
                                                {nextLevel && (
                                                    <Link href={route('cefr.level', { level: nextLevel })}>
                                                        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                            Tiếp tục với {nextLevel}
                                                        </button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Parts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {levelProgress.parts.map((part) => (
                                    <div
                                        key={part.part}
                                        className={`relative border-2 rounded-lg transition-all duration-300 ${part.is_locked
                                            ? 'opacity-60'
                                            : 'hover:shadow-lg'
                                            } ${getPartStatusColor(part)}`}
                                    >
                                        <div className="p-6">
                                            {/* Part Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    {getPartIcon(part)}
                                                    <h3 className="text-xl font-bold ml-2">
                                                        Phần {part.part}
                                                    </h3>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${part.is_passed ? 'bg-green-200 text-green-800' :
                                                    part.is_locked ? 'bg-red-200 text-red-800' :
                                                        'bg-yellow-200 text-yellow-800'
                                                    }`}>
                                                    {getPartStatusText(part)}
                                                </span>
                                            </div>

                                            {/* Requirements */}
                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">
                                                    Yêu cầu: <span className="font-bold text-red-600">{part.pass_threshold}%</span>
                                                </p>
                                            </div>

                                            {/* Score Display */}
                                            {part.percentage > 0 && (
                                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-gray-600">Điểm của bạn:</span>
                                                        <span className={`text-sm font-bold ${part.is_passed ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {part.percentage}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-300 ${part.is_passed ? 'bg-green-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${part.percentage}%` }}
                                                        />
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        {part.is_passed ?
                                                            `✅ Đạt yêu cầu (cần ≥${part.pass_threshold}%)` :
                                                            `❌ Chưa đạt yêu cầu (cần ≥${part.pass_threshold}%)`
                                                        }
                                                    </div>
                                                </div>
                                            )}

                                            {/* No Score Display */}
                                            {part.percentage === 0 && (
                                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                    <div className="text-sm text-gray-500 text-center">
                                                        Chưa có điểm số
                                                    </div>
                                                    <div className="text-xs text-gray-400 text-center mt-1">
                                                        Yêu cầu: ≥{part.pass_threshold}%
                                                    </div>
                                                </div>
                                            )}

                                            {/* Lock Message */}
                                            {part.is_locked && part.lock_message && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <div className="flex items-start">
                                                        <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 shrink-0" />
                                                        <p className="text-sm text-red-800">{part.lock_message}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Button */}
                                            <button
                                                disabled={part.is_locked || processing}
                                                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${part.is_passed ? 'bg-green-600 text-white hover:bg-green-700' :
                                                        part.is_locked ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                                                            part.percentage > 0 ? 'bg-orange-600 text-white hover:bg-orange-700' :
                                                                'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                                onClick={() => handleStartPart(part)}
                                            >
                                                {part.is_passed ? 'Làm lại' :
                                                    part.is_locked ? 'Bị khóa' :
                                                        part.percentage > 0 ? 'Tiếp tục làm' : 'Bắt đầu làm'}
                                            </button>

                                            {/* Completed At */}
                                            {part.completed_at && (
                                                <p className="text-xs text-gray-500 mt-2 text-center">
                                                    Hoàn thành: {new Date(part.completed_at).toLocaleDateString('vi-VN')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Overall Progress Summary */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4">Tiến độ tất cả trình độ</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {overallProgress.map((progress) => (
                                        <Link
                                            key={progress.level}
                                            href={route('cefr.level', { level: progress.level })}
                                            className={`block p-4 rounded-lg border-2 transition-all ${progress.level === level
                                                ? 'border-blue-500 bg-blue-50'
                                                : progress.is_completed
                                                    ? 'border-green-300 bg-green-50 hover:border-green-400'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <div className="text-center">
                                                <div className="font-bold text-lg mb-1">
                                                    {progress.level}
                                                </div>
                                                <div className="text-xs text-gray-600 mb-2">
                                                    {progress.completed_parts}/{progress.total_parts}
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${progress.is_completed ? 'bg-green-500' : 'bg-gray-400'
                                                            }`}
                                                        style={{ width: `${(progress.completed_parts / progress.total_parts) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CEFRLevelProgress;

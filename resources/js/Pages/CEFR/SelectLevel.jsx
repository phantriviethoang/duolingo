import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Lock, CheckCircle, BookOpen, Trophy } from 'lucide-react';
import Layout from '@/Layouts/Layout';

const CEFRSelectLevel = ({ levels, currentLevel }) => {
    const [processing, setProcessing] = useState(false);

    const handleSelectLevel = (level) => {
        if (!level.can_access) {
            return;
        }

        setProcessing(true);
        router.post(
            route('cefr.store-level'),
            { level: level.level },
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

    const getLevelColor = (level) => {
        switch (level.level) {
            case 'A1': return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
            case 'A2': return 'bg-lime-100 border-lime-300 text-lime-800 hover:bg-lime-200';
            case 'B1': return 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200';
            case 'B2': return 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200';
            case 'C1': return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200';
            case 'C2': return 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200';
            default: return 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200';
        }
    };

    const getLevelDescription = (level) => {
        switch (level.level) {
            case 'A1': return 'Người mới bắt đầu - Cơ bản';
            case 'A2': return 'Người mới bắt đầu - Cải thiện';
            case 'B1': return 'Trung cấp - Tự chủ';
            case 'B2': return 'Trung cấp - Nâng cao';
            case 'C1': return 'Nâng cao - Thành thạo';
            case 'C2': return 'Nâng cao - Gần như bản ngữ';
            default: return '';
        }
    };

    return (
        <Layout>
            <Head title="Chọn trình độ CEFR" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Chọn trình độ học tập
                                </h1>
                                <p className="text-gray-600">
                                    Chọn trình độ phù hợp với khả năng của bạn. Mỗi trình độ gồm 3 phần với yêu cầu ngày càng cao.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {levels.map((level) => (
                                    <div
                                        key={level.level}
                                        className={`relative border-2 rounded-lg transition-all duration-300 ${level.can_access
                                                ? 'cursor-pointer hover:shadow-lg'
                                                : 'opacity-60 cursor-not-allowed'
                                            } ${currentLevel === level.level
                                                ? 'ring-2 ring-blue-500'
                                                : ''
                                            } ${getLevelColor(level)}`}
                                        onClick={() => level.can_access && handleSelectLevel(level)}
                                    >
                                        <div className="p-6">
                                            <div className="text-center mb-4">
                                                <h3 className="text-2xl font-bold mb-2">
                                                    {level.level}
                                                </h3>
                                                <p className="text-sm opacity-80">
                                                    {getLevelDescription(level)}
                                                </p>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Phần 1:</span>
                                                    <span className="font-semibold">60%</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Phần 2:</span>
                                                    <span className="font-semibold">75%</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Phần 3:</span>
                                                    <span className="font-semibold">90%</span>
                                                </div>
                                            </div>

                                            {level.is_completed && (
                                                <div className="flex items-center justify-center p-2 bg-green-50 rounded-lg mb-4">
                                                    <Trophy className="w-4 h-4 text-green-600 mr-2" />
                                                    <span className="text-green-800 text-sm font-semibold">
                                                        Đã hoàn thành
                                                    </span>
                                                </div>
                                            )}

                                            {!level.can_access && (
                                                <div className="flex items-center justify-center p-2 bg-red-50 rounded-lg mb-4">
                                                    <Lock className="w-4 h-4 text-red-600 mr-2" />
                                                    <span className="text-red-800 text-sm">
                                                        Cần hoàn thành trình độ trước
                                                    </span>
                                                </div>
                                            )}

                                            <button
                                                disabled={!level.can_access || processing}
                                                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${currentLevel === level.level
                                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                                        : level.is_completed
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                            : level.can_access
                                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectLevel(level);
                                                }}
                                            >
                                                {currentLevel === level.level ? 'Đang học' :
                                                    level.is_completed ? 'Xem lại' :
                                                        level.can_access ? 'Bắt đầu' : 'Bị khóa'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Hướng dẫn:
                                </h3>
                                <ul className="text-blue-800 text-sm space-y-1">
                                    <li>• Mỗi trình độ gồm 3 phần với yêu cầu điểm tăng dần (60% → 75% → 90%)</li>
                                    <li>• Bạn phải hoàn thành phần trước đó để mở phần tiếp theo</li>
                                    <li>• Hoàn thành trình độ hiện tại để mở trình độ cao hơn</li>
                                    <li>• A1 luôn sẵn có cho người mới bắt đầu</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CEFRSelectLevel;

import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Lock, CheckCircle, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import Layout from '@/Layouts/Layout';

const CEFRProgress = ({ currentLevel, levelProgress, overallProgress, availableLevels }) => {
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

    const getLevelDescription = (level) => {
        switch (level) {
            case 'A1': return 'Người mới bắt đầu';
            case 'A2': return 'Sơ cấp';
            case 'B1': return 'Trung cấp';
            case 'B2': return 'Trung cấp cao';
            case 'C1': return 'Cao cấp';
            case 'C2': return 'Thành thạo';
            default: return '';
        }
    };

    const completedParts = levelProgress.parts.filter(p => p.is_passed).length;
    const overallPercentage = (completedParts / 3) * 100;

    return (
        <Layout>
            <Head title="Tiến độ học tập CEFR" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Tiến độ học tập CEFR
                                </h1>
                                <p className="text-gray-600">
                                    Theo dõi tiến độ học tập của bạn qua các trình độ CEFR
                                </p>
                            </div>

                            {/* Current Level Summary */}
                            <div className="mb-8">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                                Trình độ hiện tại: {currentLevel}
                                            </h2>
                                            <p className="text-gray-600">
                                                {getLevelDescription(currentLevel)}
                                            </p>
                                        </div>
                                        <Link href={route('cefr.level', { level: currentLevel })}>
                                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                                Tiếp tục học
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Current Level Progress */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Tiến độ {currentLevel}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700">
                                                {completedParts}/3 phần
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className={`${getLevelColor(currentLevel)} h-4 rounded-full transition-all duration-300`}
                                                style={{ width: `${overallPercentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Parts Status */}
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {levelProgress.parts.map((part) => (
                                            <div
                                                key={part.part}
                                                className={`text-center p-3 rounded-lg ${part.is_passed
                                                        ? 'bg-green-100 text-green-800'
                                                        : part.is_locked
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                <div className="text-lg font-bold mb-1 flex items-center justify-center">
                                                    {part.is_passed ? <CheckCircle className="w-5 h-5 mr-1" /> :
                                                        part.is_locked ? <Lock className="w-5 h-5 mr-1" /> :
                                                            <BookOpen className="w-5 h-5 mr-1" />}
                                                    Phần {part.part}
                                                </div>
                                                <div className="text-sm">
                                                    {part.is_passed ? 'Hoàn thành' :
                                                        part.is_locked ? 'Bị khóa' : 'Chưa làm'}
                                                </div>
                                                {part.percentage > 0 && (
                                                    <div className="text-xs mt-1">
                                                        {part.percentage}%
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* All Levels Overview */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Tất cả trình độ
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {overallProgress.map((progress) => (
                                        <Link
                                            key={progress.level}
                                            href={route('cefr.level', { level: progress.level })}
                                            className="block"
                                        >
                                            <div
                                                className={`border-2 rounded-lg transition-all duration-300 hover:shadow-lg ${progress.level === currentLevel
                                                        ? 'ring-2 ring-blue-500'
                                                        : ''
                                                    }`}
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-xl font-bold">
                                                            {progress.level}
                                                        </h3>
                                                        {progress.is_completed && (
                                                            <Trophy className="w-5 h-5 text-green-500" />
                                                        )}
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-4">
                                                        {getLevelDescription(progress.level)}
                                                    </p>

                                                    <div className="mb-4">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs text-gray-600">
                                                                Tiến độ
                                                            </span>
                                                            <span className="text-xs font-medium text-gray-700">
                                                                {progress.completed_parts}/{progress.total_parts}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full transition-all duration-300 ${progress.is_completed ? 'bg-green-500' : 'bg-gray-400'
                                                                    }`}
                                                                style={{ width: `${(progress.completed_parts / progress.total_parts) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <span className={`text-sm font-medium ${progress.level === currentLevel
                                                                ? 'text-blue-600'
                                                                : progress.is_completed
                                                                    ? 'text-green-600'
                                                                    : 'text-gray-600'
                                                            }`}>
                                                            {progress.level === currentLevel ? 'Đang học' :
                                                                progress.is_completed ? 'Đã hoàn thành' : 'Chưa bắt đầu'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-4">
                                <Link href={route('cefr.select-level')}>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        Chọn trình độ khác
                                    </button>
                                </Link>
                                {levelProgress.parts.find(p => !p.is_locked && !p.is_passed) && (
                                    <Link href={route('cefr.level', { level: currentLevel })}>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                                            Tiếp tục phần tiếp theo
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CEFRProgress;

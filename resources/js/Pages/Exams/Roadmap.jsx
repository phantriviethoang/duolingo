

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { Lock, Zap, CheckCircle2, Award } from 'lucide-react';

export default function Levels({ levels, user_is_high_quality, user_target_part }) {
    return (
        <Layout>
            <Head title="Lộ trình học tập" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            🎯 Lộ Trình Học Tập Cá Nhân
                        </h1>
                        <p className="text-lg text-gray-600">
                            Từ {levels[0]?.name || 'A1'} → {levels[levels.length - 1]?.name || 'C2'}
                        </p>
                        {user_is_high_quality && (
                            <div className="mt-3 inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                ⭐ Chế độ cao cấp (Threshold +10%)
                            </div>
                        )}
                    </div>

                    {/* Roadmap Steps - DaisyUI */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex flex-col gap-3">
                            {levels.map((part, idx) => {
                                const isLocked = part.is_locked;
                                const isCompleted = part.status === 'completed';
                                const isInProgress = part.status === 'in-progress';

                                return (
                                    <React.Fragment key={part.id}>
                                        <div className="flex items-center">
                                            {/* Step indicator */}
                                            <div className="flex items-center flex-1">
                                                {/* Circle */}
                                                <div
                                                    className={`
                                                        w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                                                        transition-all duration-300
                                                        ${isLocked
                                                            ? 'bg-gray-200 text-gray-500'
                                                            : isCompleted
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-blue-500 text-white'
                                                        }
                                                    `}
                                                >
                                                    {isLocked ? (
                                                        <Lock className="w-6 h-6" />
                                                    ) : isCompleted ? (
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    ) : (
                                                        <Zap className="w-6 h-6" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="ml-6 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {part.name} - {part.description}
                                                        </h3>
                                                        {user_target_part === part.id && (
                                                            <span className="badge badge-primary">Mục tiêu</span>
                                                        )}
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                                                    }`}
                                                                style={{ width: `${part.progress_percent}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                            {part.completed_exams}/{part.total_exams}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 text-sm text-gray-600">
                                                        Yêu cầu: {part.pass_threshold}%
                                                        {isLocked && (
                                                            <span className="ml-3 text-red-600 font-semibold">
                                                                Hoàn thành phần {part.order - 1} để mở khóa
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Button */}
                                                {!isLocked && (
                                                    <div className="ml-4">
                                                        <Link
                                                            href={`/levels/${part.id}/exams`}
                                                            className={`btn btn-sm ${isCompleted
                                                                ? 'btn-outline btn-success'
                                                                : 'btn-primary'
                                                                }`}
                                                        >
                                                            {isCompleted ? 'Làm lại' : 'Làm bài'}
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Connecting line */}
                                        {idx < levels.length - 1 && (
                                            <div className="ml-6 w-1 h-6 bg-gradient-to-b from-gray-300 to-gray-200" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12">
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                                <p className="text-3xl font-bold text-gray-900">
                                    {levels.filter(l => l.status === 'completed').length}
                                </p>
                                <p className="text-gray-600">Phần hoàn thành</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <Zap className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                <p className="text-3xl font-bold text-gray-900">
                                    {levels.filter(l => l.status === 'in-progress').length}
                                </p>
                                <p className="text-gray-600">Phần đang làm</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-3xl font-bold text-gray-900">
                                    {levels.filter(l => l.is_locked).length}
                                </p>
                                <p className="text-gray-600">Phần bị khóa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

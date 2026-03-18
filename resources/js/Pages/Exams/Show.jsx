import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { ArrowLeft, BookOpen, Zap, Trophy, Clock, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export default function Show({ exam, userProgress }) {
    // Tính phần trăm hoàn thành
    const completedSections = userProgress?.last_completed_section_order || 0;
    const totalSections = exam.sections.length;
    const progressPercent = Math.round((completedSections / totalSections) * 100);

    return (
        <Layout>
            <Head title={`${exam.title} - LinGo`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href={route('exams.by-level', exam.level_id)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-semibold">
                            <ArrowLeft className="w-5 h-5" />
                            Quay lại
                        </Link>

                        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-600">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {exam.title}
                                        </h1>
                                        {exam.is_high_quality && (
                                            <span className="badge badge-lg badge-warning">
                                                ⭐ HIGH QUALITY
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-lg mb-4">{exam.description}</p>

                                    {/* Meta Info */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Thời gian</p>
                                                <p className="font-semibold">{exam.duration} phút</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <BookOpen className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Câu hỏi</p>
                                                <p className="font-semibold">{exam.total_questions}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <AlertCircle className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Phần</p>
                                                <p className="font-semibold">{exam.sections.length}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Zap className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Độ khó</p>
                                                <p className="font-semibold">{exam.difficulty_score}/10</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Status */}
                                {userProgress && (
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 min-w-fit">
                                        {userProgress.is_completed ? (
                                            <div className="text-center">
                                                <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                                <p className="font-bold text-green-600">Đã hoàn thành</p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {userProgress.completed_at}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                                <p className="font-bold text-yellow-600">Đang làm</p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Phần {userProgress.last_completed_section_order + 1} / {exam.sections.length}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {userProgress && (
                        <div className="bg-white rounded-lg shadow p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Tiến độ làm bài</h3>
                                <span className="text-2xl font-bold text-blue-600">{progressPercent}%</span>
                            </div>
                            <div className="flex gap-2 items-end">
                                {/* Progress bar segments */}
                                <div className="flex-1">
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-600">
                                    {completedSections}/{totalSections}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Sections */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Các phần trong bài thi
                            </h2>
                        </div>

                        <div className="divide-y">
                            {exam.sections.map((section, index) => {
                                const isCompleted = userProgress && index < userProgress.last_completed_section_order;
                                const isCurrentSection = userProgress && index === userProgress.last_completed_section_order;
                                const isLocked = userProgress && index > userProgress.last_completed_section_order;
                                const isNotStarted = !userProgress && index > 0;

                                let bgColor = 'bg-slate-50';
                                let iconColor = 'text-gray-400';
                                let statusText = 'Chưa mở khóa';
                                let statusColor = 'text-gray-600';

                                if (isCompleted) {
                                    bgColor = 'bg-green-50';
                                    iconColor = 'text-green-500';
                                    statusText = 'Hoàn thành';
                                    statusColor = 'text-green-600';
                                } else if (isCurrentSection) {
                                    bgColor = 'bg-blue-50';
                                    iconColor = 'text-blue-500';
                                    statusText = 'Đang làm';
                                    statusColor = 'text-blue-600';
                                } else if (isLocked || isNotStarted) {
                                    bgColor = 'bg-slate-50';
                                    iconColor = 'text-gray-400';
                                    statusText = 'Chưa mở khóa';
                                    statusColor = 'text-gray-600';
                                }

                                return (
                                    <div key={section.id} className={`${bgColor} p-6 hover:bg-opacity-75 transition-colors`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                {/* Icon */}
                                                <div className={`${iconColor}`}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-8 h-8" />
                                                    ) : isLocked || isNotStarted ? (
                                                        <Lock className="w-8 h-8" />
                                                    ) : (
                                                        <Zap className="w-8 h-8" />
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        Phần {section.order}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {section.question_count} câu • Yêu cầu {Math.round(section.pass_threshold * 100)}%
                                                    </p>
                                                    <p className={`text-sm font-semibold ${statusColor} mt-1`}>
                                                        {statusText}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {(isCurrentSection || (isNotStarted && index === 0) || isCompleted) && (
                                                <Link
                                                    href={route('exams.take', {
                                                        exam: exam.id,
                                                        section: section.order,
                                                    })}
                                                    className={`btn btn-sm ${isCompleted
                                                            ? 'btn-outline'
                                                            : 'btn-primary'
                                                        }`}
                                                >
                                                    {isCompleted ? 'Làm lại' : 'Bắt đầu'}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Start Button */}
                    {!userProgress && (
                        <div className="mt-8 flex justify-center">
                            <Link
                                href={route('exams.take', {
                                    exam: exam.id,
                                    section: 1,
                                })}
                                className="btn btn-lg btn-primary"
                            >
                                <Zap className="w-5 h-5" />
                                Bắt đầu làm bài
                            </Link>
                        </div>
                    )}

                    {/* Resume Button */}
                    {userProgress && !userProgress.is_completed && (
                        <div className="mt-8 flex justify-center">
                            <Link
                                href={route('exams.take', {
                                    exam: exam.id,
                                    resume: 'true',
                                })}
                                className="btn btn-lg btn-primary"
                            >
                                <Zap className="w-5 h-5" />
                                Tiếp tục từ nơi để dở
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

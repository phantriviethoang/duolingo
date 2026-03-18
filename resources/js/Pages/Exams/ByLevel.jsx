import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { Clock, BookOpen, ArrowLeft, Trophy, AlertCircle } from 'lucide-react';

export default function ByLevel({ exams, level_id }) {
    const [sortBy, setSortBy] = useState('created_at');

    // Sắp xếp danh sách đề
    const sortedExams = React.useMemo(() => {
        const sorted = [...exams.data];
        if (sortBy === 'difficulty_score') {
            return sorted.sort((a, b) => b.difficulty_score - a.difficulty_score);
        }
        if (sortBy === 'title') {
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        }
        return sorted;
    }, [exams.data, sortBy]);

    return (
        <Layout>
            <Head title="Danh sách đề thi - LinGo" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header with Back Button */}
                    <div className="mb-8">
                        <Link href={route('levels.index')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-semibold">
                            <ArrowLeft className="w-5 h-5" />
                            Quay lại
                        </Link>

                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <h1 className="text-4xl font-bold text-gray-900">
                                Danh sách đề thi
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600">
                            Chọn một đề thi và bắt đầu làm bài
                        </p>
                    </div>

                    {/* Sort Control */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Sắp xếp theo:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy('created_at')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${sortBy === 'created_at'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Mới nhất
                            </button>
                            <button
                                onClick={() => setSortBy('difficulty_score')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${sortBy === 'difficulty_score'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Độ khó
                            </button>
                            <button
                                onClick={() => setSortBy('title')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${sortBy === 'title'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Tên A-Z
                            </button>
                        </div>
                    </div>

                    {/* Exams List */}
                    {sortedExams.length > 0 ? (
                        <div className="space-y-4">
                            {sortedExams.map((exam) => (
                                <div key={exam.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-slate-200">
                                    <Link href={route('exams.show', exam.id)} className="block p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            {/* Left: Exam Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-2xl font-bold text-gray-900">
                                                        {exam.title}
                                                    </h3>
                                                    {exam.is_high_quality && (
                                                        <span className="badge badge-warning text-xs font-bold">
                                                            🌟 HIGH QUALITY
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mb-4">{exam.description}</p>

                                                {/* Meta Info */}
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{exam.duration} phút</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <BookOpen className="w-4 h-4" />
                                                        <span>{exam.total_questions} câu</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>{exam.sections_count} phần</span>
                                                    </div>
                                                    <div className="badge badge-lg bg-blue-50 text-blue-700 font-semibold">
                                                        Độ khó: {exam.difficulty_score}/10
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Status & Button */}
                                            <div className="flex flex-col gap-3 md:items-end">
                                                {exam.user_progress ? (
                                                    <div className="text-right">
                                                        {exam.user_progress.is_completed ? (
                                                            <div className="flex items-center gap-2 text-green-600 font-bold">
                                                                <Trophy className="w-5 h-5" />
                                                                <span>Đã hoàn thành</span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-yellow-600 font-semibold">
                                                                Đang làm (Phần {exam.user_progress.last_completed_section_order + 1})
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Bắt đầu: {exam.user_progress.started_at}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Chưa bắt đầu</span>
                                                )}
                                                <button className="btn btn-primary btn-sm">
                                                    {exam.user_progress?.is_completed ? 'Làm lại' : 'Bắt đầu'}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Chưa có đề thi nào</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {exams.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {Array.from({ length: exams.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={route('exams.by-level', {
                                        level: level_id,
                                        page,
                                    })}
                                    className={`px-3 py-2 rounded-lg font-medium transition-all ${page === exams.current_page
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                                        }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

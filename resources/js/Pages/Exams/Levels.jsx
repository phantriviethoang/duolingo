import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { BarChart3, BookOpen, TrendingUp } from 'lucide-react';

export default function Levels({ levels }) {
    return (
        <Layout>
            <Head title="Chọn cấp độ - LinGo" />

            <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <h1 className="text-4xl font-bold text-gray-900">
                                Chọn cấp độ học
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600">
                            Hãy chọn cấp độ phù hợp với năng lực của bạn và bắt đầu hành trình học tiếng Anh
                        </p>
                    </div>

                    {/* Levels Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {levels.map((level) => (
                            <div key={level.id} className="group">
                                <Link href={route('exams.by-level', level.id)} className="block">
                                    <div className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-400 h-full cursor-pointer">
                                        {/* Level Badge */}
                                        <div className="relative h-32 bg-linear-to-br from-blue-500 to-blue-600 p-6 flex flex-col justify-between rounded-t-2xl">
                                            <div>
                                                <div className="text-4xl font-black text-white mb-2">
                                                    {level.name}
                                                </div>
                                                <p className="text-blue-100 text-sm font-medium">
                                                    {level.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="card-body">
                                            {/* Stats */}
                                            <div className="space-y-3 mb-4">
                                                {/* Total Exams */}
                                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-5 h-5 text-blue-500" />
                                                        <span className="text-sm text-gray-700">Tổng đề</span>
                                                    </div>
                                                    <span className="font-bold text-lg text-gray-900">
                                                        {level.total_exams}
                                                    </span>
                                                </div>

                                                {/* Completed */}
                                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                                        <span className="text-sm text-gray-700">Hoàn thành</span>
                                                    </div>
                                                    <span className="font-bold text-lg text-green-600">
                                                        {level.completed_exams}
                                                    </span>
                                                </div>

                                                {/* In Progress */}
                                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <BarChart3 className="w-5 h-5 text-yellow-500" />
                                                        <span className="text-sm text-gray-700">Đang làm</span>
                                                    </div>
                                                    <span className="font-bold text-lg text-yellow-600">
                                                        {level.in_progress_exams}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-semibold text-gray-600 uppercase">
                                                        Tiến độ
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-900">
                                                        {level.progress_percent}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-linear-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${level.progress_percent}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* CTA Button */}
                                            <div className="card-actions justify-end mt-4 pt-4 border-t border-slate-200">
                                                <button className="btn btn-primary btn-block group-hover:btn-accent">
                                                    Xem đề
                                                    <svg
                                                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Features Section */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <h3 className="font-bold text-gray-900 mb-2">🎯 Độc lập</h3>
                            <p className="text-sm text-gray-600">
                                Mỗi cấp độ được thiết kế độc lập để phù hợp với trình độ của bạn
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <h3 className="font-bold text-gray-900 mb-2">⏱️ Linh hoạt</h3>
                            <p className="text-sm text-gray-600">
                                Học theo tốc độ của bạn. Hệ thống tự động lưu tiến độ
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <h3 className="font-bold text-gray-900 mb-2">📈 Tăng dần</h3>
                            <p className="text-sm text-gray-600">
                                Độ khó tăng dần để giúp bạn tiến bộ từng bước
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

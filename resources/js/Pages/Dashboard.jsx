import { Head, Link, usePage } from "@inertiajs/react";
import { Trophy, TrendingUp, Award, Zap, Target, CheckCircle2, Lock } from "lucide-react";
import Layout from "@/Layouts/Layout";

export default function Dashboard({ levels, stats, recent_results }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <Layout>
            <Head title="Dashboard Tiến độ - LingGo" />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-b-2xl">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">Dashboard Tiến độ</h1>
                                <p className="text-blue-100">Xin chào, <span className="font-semibold">{user?.name}</span>! Theo dõi hành trình học tập của bạn</p>
                            </div>
                            <div className="hidden md:block">
                                <Trophy className="w-16 h-16 text-yellow-300 opacity-80" />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-sm text-blue-100">Hoàn thành</span>
                                </div>
                                <p className="text-3xl font-bold">{stats.total_completed}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-5 h-5" />
                                    <span className="text-sm text-blue-100">Đạt điểm</span>
                                </div>
                                <p className="text-3xl font-bold">{stats.total_passed}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="text-sm text-blue-100">Tiến độ</span>
                                </div>
                                <p className="text-3xl font-bold">{stats.average_progress}%</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Levels Progress */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lộ trình học của bạn</h2>
                            <div className="space-y-4">
                                {levels.map((level) => (
                                    <div
                                        key={level.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="p-6">
                                            {/* Level Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <Link
                                                        href={`/levels/${level.id}/exams`}
                                                        className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                                    >
                                                        {level.name}
                                                    </Link>
                                                    <p className="text-gray-600 text-sm mt-1">{level.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-4xl font-bold text-blue-600">{level.progress_percent}%</p>
                                                    <p className="text-sm text-gray-500">Hoàn thành</p>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${level.progress_percent}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                                    <p className="text-sm text-gray-600">Tổng đề</p>
                                                    <p className="text-2xl font-bold text-blue-600">{level.total_exams}</p>
                                                </div>
                                                <div className="bg-green-50 rounded-lg p-3 text-center">
                                                    <p className="text-sm text-gray-600">Hoàn thành</p>
                                                    <p className="text-2xl font-bold text-green-600">{level.completed_exams}</p>
                                                </div>
                                                <div className="bg-purple-50 rounded-lg p-3 text-center">
                                                    <p className="text-sm text-gray-600">Đạt ≥70%</p>
                                                    <p className="text-2xl font-bold text-purple-600">{level.passed_exams}</p>
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <Link
                                                    href={`/levels/${level.id}/exams`}
                                                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                                >
                                                    Xem các bài thi
                                                    <span>→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Results Sidebar */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hoạt động gần đây</h2>
                            <div className="space-y-3">
                                {recent_results.map((result) => (
                                    <Link
                                        key={result.id}
                                        href={`/results/${result.id}`}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow block"
                                    >
                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                            {result.test_title}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">{result.completed_at}</span>
                                            <span className={`text-sm font-bold px-2 py-1 rounded ${result.score >= 70
                                                ? "text-green-700 bg-green-100"
                                                : "text-orange-700 bg-orange-100"
                                                }`}>
                                                {result.score}%
                                            </span>
                                        </div>
                                    </Link>
                                ))}

                                {recent_results.length === 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                                        <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-600 text-sm">Chưa có kết quả nào</p>
                                        <Link
                                            href="/levels"
                                            className="mt-4 inline-block text-blue-600 font-semibold text-sm hover:text-blue-700"
                                        >
                                            Bắt đầu học
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

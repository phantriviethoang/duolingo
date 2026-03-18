import { Head, Link } from "@inertiajs/react";
import { Calendar, Trophy, ArrowLeft, BookOpen } from "lucide-react";
import Layout from "@/Layouts/Layout";

export default function Index({ results }) {
    return (
        <Layout>
            <Head title="Lịch sử làm bài - LingGo" />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Trophy className="w-8 h-8" />
                            <h1 className="text-4xl font-bold">Lịch sử làm bài</h1>
                        </div>
                        <p className="text-lg text-purple-100 mt-4">
                            Xem lại kết quả và tiến độ học tập của bạn
                        </p>
                    </div>
                </section>

                {/* Results Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {results.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                            <Trophy
                                size={48}
                                className="mx-auto text-gray-300 mb-4"
                            />
                            <p className="text-lg text-gray-600 mb-6">
                                Bạn chưa hoàn thành bài thi nào
                            </p>
                            <Link
                                href="/levels"
                                className="btn btn-primary"
                            >
                                🎓 Bắt đầu lộ trình học
                            </Link>
                            <Link
                                href="/tests"
                                className="btn btn-outline ml-2"
                            >
                                📝 Làm đề thi cơ bản
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {results.map((result) => (
                                <div
                                    key={result.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
                                >
                                    <div className="p-6 flex items-center justify-between flex-wrap gap-4">
                                        {/* Left: Test Info */}
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                                {result.test_title}
                                            </h2>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={16} className="text-blue-600" />
                                                    <span>{result.completed_at}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle: Score */}
                                        <div className="text-center">
                                            <div
                                                className={`text-3xl font-bold mb-1 ${result.score >= 70
                                                    ? "text-green-600"
                                                    : result.score >= 50
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                                    }`}
                                            >
                                                {result.score}%
                                            </div>
                                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${result.score >= 70
                                                ? "bg-green-100 text-green-700"
                                                : result.score >= 50
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {result.score >= 70
                                                    ? "✅ Đạt"
                                                    : "❌ Chưa đạt"}
                                            </span>
                                        </div>

                                        {/* Right: Action Button */}
                                        <Link
                                            href={`/results/${result.id}`}
                                            className="btn btn-sm btn-primary"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

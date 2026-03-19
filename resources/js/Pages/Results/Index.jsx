import { Head, Link } from "@inertiajs/react";
import { Calendar, Trophy, ArrowLeft, BookOpen, TrendingDown, SortDesc, Filter } from "lucide-react";
import Layout from "@/Layouts/Layout";
import { useState, useMemo } from "react";

export default function Index({ results }) {
    const [sortBy, setSortBy] = useState("date"); // date, wrong-most, wrong-least, score
    const [filterScore, setFilterScore] = useState("all"); // all, passed, failed

    // Sắp xếp và lọc kết quả
    const processedResults = useMemo(() => {
        let filtered = results;

        // Lọc theo điểm
        if (filterScore === "passed") {
            filtered = results.filter(r => r.score >= 70);
        } else if (filterScore === "failed") {
            filtered = results.filter(r => r.score < 70);
        }

        // Sắp xếp
        const sorted = [...filtered];
        if (sortBy === "wrong-most") {
            sorted.sort((a, b) => b.wrong_count - a.wrong_count);
        } else if (sortBy === "wrong-least") {
            sorted.sort((a, b) => a.wrong_count - b.wrong_count);
        } else if (sortBy === "score") {
            sorted.sort((a, b) => b.score - a.score);
        } else {
            // date (mặc định)
            sorted.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
        }

        return sorted;
    }, [results, sortBy, filterScore]);

    const stats = useMemo(() => {
        const total = results.length;
        const passed = results.filter(r => r.score >= 70).length;
        const avgWrong = results.length > 0
            ? Math.round(results.reduce((sum, r) => sum + r.wrong_count, 0) / results.length)
            : 0;

        return { total, passed, avgWrong };
    }, [results]);

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
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <p className="text-sm text-gray-600 mb-1">Tổng bài thi</p>
                                    <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <p className="text-sm text-gray-600 mb-1">Đạt (≥70%)</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.passed}</p>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <p className="text-sm text-gray-600 mb-1">Trung bình câu sai</p>
                                    <p className="text-3xl font-bold text-orange-600">{stats.avgWrong}</p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Sort */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <SortDesc className="w-4 h-4" />
                                                Sắp xếp theo
                                            </div>
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="select select-bordered w-full bg-white"
                                        >
                                            <option value="date">📅 Ngày (Mới nhất)</option>
                                            <option value="wrong-most">❌ Câu sai (Nhiều nhất) - Phát hiện lỗ hổng</option>
                                            <option value="wrong-least">✅ Câu sai (Ít nhất) - Tốt nhất</option>
                                            <option value="score">🏆 Điểm (Cao nhất)</option>
                                        </select>
                                    </div>

                                    {/* Filter */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4" />
                                                Lọc kết quả
                                            </div>
                                        </label>
                                        <select
                                            value={filterScore}
                                            onChange={(e) => setFilterScore(e.target.value)}
                                            className="select select-bordered w-full bg-white"
                                        >
                                            <option value="all">Tất cả bài thi</option>
                                            <option value="passed">✅ Đạt (≥70%)</option>
                                            <option value="failed">❌ Chưa đạt</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Results List */}
                            <div className="space-y-4">
                                {processedResults.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                        <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-600">Không tìm thấy kết quả phù hợp</p>
                                    </div>
                                ) : (
                                    processedResults.map((result) => (
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
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={16} className="text-blue-600" />
                                                            <span>{result.completed_at}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen size={16} className="text-gray-600" />
                                                            <span>{result.total_questions} câu hỏi</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
                                                            <TrendingDown size={16} className="text-orange-600" />
                                                            <span className="text-orange-700 font-semibold">{result.wrong_count} câu sai</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                                                            <span className="text-green-700 font-semibold">{result.correct_count} câu đúng</span>
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
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/results/${result.id}`}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        📋 Chi tiết
                                                    </Link>
                                                    {result.wrong_count > 0 && (
                                                        <Link
                                                            href={`/results/${result.id}/retake-wrong`}
                                                            className="btn btn-sm btn-outline"
                                                            title="Làm lại các câu sai"
                                                        >
                                                            🔄 Làm lại ({result.wrong_count})
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}

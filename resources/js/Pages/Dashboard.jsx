import { Head, Link, usePage } from "@inertiajs/react";
import { 
    FileText, 
    Trophy, 
    Clock, 
    Target, 
    TrendingUp, 
    Users, 
    Calendar,
    Brain,
    BarChart3,
    Award,
    Play
} from "lucide-react";

export default function Dashboard({ 
    recentTests, 
    stats, 
    upcomingTests,
    achievements 
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Xin chào, {user?.name}!</h1>
                                <p className="text-blue-100">Tiếp tục hành trình học ngôn ngữ của bạn</p>
                            </div>
                            <div className="hidden md:flex items-center space-x-4">
                                <Link 
                                    href="/tests" 
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Làm đề thi
                                </Link>
                                <Link 
                                    href="/results" 
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Trophy className="w-4 h-4" />
                                    Xem kết quả
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-sm text-gray-500">Tuần này</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.weeklyTests}</div>
                            <div className="text-sm text-gray-600">bài thi đã làm</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="text-sm text-gray-500">Hiệu suất</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.averageScore}%</div>
                            <div className="text-sm text-gray-600">điểm trung bình</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <Award className="w-6 h-6 text-orange-600" />
                                </div>
                                <span className="text-sm text-gray-500">Thành tích</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.achievements}</div>
                            <div className="text-sm text-gray-600">đạt được</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Tests */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-800">Bài thi gần đây</h2>
                                        <Link 
                                            href="/results" 
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            Xem tất cả
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {recentTests.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">Chưa có bài thi nào</p>
                                            <Link 
                                                href="/tests" 
                                                className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                <Play className="w-4 h-4" />
                                                Bắt đầu làm bài thi
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recentTests.map((test) => (
                                                <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-800">{test.title}</h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{test.completed_at}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{test.duration} phút</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-lg font-bold ${
                                                            test.score >= 80 ? 'text-green-600' :
                                                            test.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>
                                                            {test.score}%
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {test.score >= 60 ? 'Đạt' : 'Chưa đạt'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions & Progress */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
                                <div className="space-y-3">
                                    <Link 
                                        href="/tests" 
                                        className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 font-medium"
                                    >
                                        <FileText className="w-5 h-5" />
                                        Làm đề thi mới
                                    </Link>
                                    <Link 
                                        href="/results" 
                                        className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-green-700 font-medium"
                                    >
                                        <Trophy className="w-5 h-5" />
                                        Xem kết quả
                                    </Link>
                                </div>
                            </div>

                            {/* Progress Chart */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Tiến độ học tập</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Mục tiêu tuần</span>
                                            <span className="font-medium text-gray-800">5/7 bài</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-full rounded-full" style={{ width: '71%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Achievements */}
                            {achievements && achievements.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Thành tích gần đây</h2>
                                    <div className="space-y-3">
                                        {achievements.slice(0, 3).map((achievement, index) => (
                                            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                                <div className="bg-yellow-200 p-2 rounded-full">
                                                    <Award className="w-4 h-4 text-yellow-700" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 text-sm">{achievement.title}</p>
                                                    <p className="text-xs text-gray-600">{achievement.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

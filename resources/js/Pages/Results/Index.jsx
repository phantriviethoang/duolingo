import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Eye, Calendar, TrendingUp, Award, ArrowUp, ArrowDown, ArrowUpDown, Clock } from 'lucide-react';

export default function ResultsIndex({ results, filters }) {
    const { sort_by, sort_order } = filters;

    const handleSort = (field) => {
        let order = 'desc';
        if (sort_by === field && sort_order === 'desc') {
            order = 'asc';
        }

        router.get(route('results.index'), {
            sort_by: field,
            sort_order: order,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const SortIcon = ({ field }) => {
        if (sort_by !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
        return sort_order === 'asc'
            ? <ArrowUp className="w-3 h-3 ml-1 text-blue-600" />
            : <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />;
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadge = (score) => {
        if (score >= 90) return 'bg-green-100 text-green-800';
        if (score >= 75) return 'bg-blue-100 text-blue-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const formatTimeSpent = (seconds) => {
        if (!seconds) return 'Chưa cập nhật';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <AuthenticatedLayout fullWidth={true}>
            <Head title="Kết quả luyện tập" />

            <div className="max-w-full mx-auto px-4 py-8">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Lịch sử luyện tập</h1>
                    <p className="text-gray-500 font-medium text-lg">Xem lại và phân tích kết quả các bài thi bạn đã hoàn thành</p>
                </div>

                {results.data?.length > 0 ? (
                    <div className="bg-white rounded-4xl border-2 border-gray-50 shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Bài luyện tập
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                        Trình độ
                                    </th>
                                    <th
                                        className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => handleSort('score')}
                                    >
                                        <div className="flex items-center justify-center">
                                            Kết quả
                                            <SortIcon field="score" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => handleSort('time_spent')}
                                    >
                                        <div className="flex items-center justify-center">
                                            Thời gian
                                            <SortIcon field="time_spent" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center justify-center">
                                            Hoàn thành
                                            <SortIcon field="created_at" />
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {results.data.map(result => (
                                    <tr key={result.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="max-w-md">
                                                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{result.test?.title}</p>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-medium">{result.test?.description || 'Bài luyện tập kỹ năng ngoại ngữ.'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                                                    Trình độ {result.test?.level}
                                                </span>
                                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-indigo-100">
                                                    Phần {result.test?.part}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`text-xl font-black ${getScoreColor(result.score)}`}>
                                                    {result.score}%
                                                </div>
                                                <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${result.score >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                                                        style={{ width: `${result.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                                                <Clock className="w-4 h-4 text-gray-300" />
                                                {formatTimeSpent(result.time_spent)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                                                {new Date(result.completed_at).toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                                <Calendar className="w-4 h-4 text-gray-300" />
                                                {new Date(result.completed_at).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link href={route('results.show', result.id)}>
                                                <button className="btn btn-sm btn-ghost hover:bg-blue-50 text-blue-600 font-bold gap-2 rounded-xl">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {results.links && (
                            <div className="bg-gray-50/50 px-8 py-6 flex items-center justify-center border-t border-gray-100">
                                <div className="flex gap-2">
                                    {results.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${link.active
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                    : link.url
                                                        ? 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
                                                        : 'bg-transparent text-gray-300 cursor-not-allowed'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-4xl border-2 border-gray-50 p-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                <Award className="w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900">Chưa có kết quả luyện tập</h2>
                            <p className="text-gray-500 max-w-sm font-medium">Bạn chưa hoàn thành bài thi nào. Hãy bắt đầu luyện tập ngay để theo dõi tiến độ của mình!</p>
                            <Link href="/path/level" className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none rounded-2xl px-8 mt-4 shadow-lg shadow-blue-500/20 font-bold">
                                Bắt đầu học ngay
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

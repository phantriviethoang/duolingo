import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Lock, Play, FileQuestion, Clock, ArrowLeft } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PathShow({ level, parts, selectedPart = null }) {
    const partEntries = Object.entries(parts || {});
    const visiblePartEntries = selectedPart
        ? partEntries.filter(([partKey]) => Number(partKey) === Number(selectedPart))
        : partEntries;

        console.log(parts)

    return (
        <AuthenticatedLayout>
            <Head title={`Lộ trình học: ${level}`} />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/path/level">
                        <button className="btn btn-outline btn-sm mb-4 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl px-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại lộ trình
                        </button>
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Trình độ {level}</h1>
                    <p className="text-gray-500 font-medium text-lg">
                        {level === 'A1'
                            ? 'Hoàn thành các phần để chinh phục những bước đầu tiên.'
                            : `Vượt qua thử thách tại trình độ ${level} để nâng cao kỹ năng.`
                        }
                    </p>
                </div>

                {/* Parts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {partEntries.map(([partKey, part]) => {
                        const isUnlocked = part.unlocked;
                        const isCompleted = part.progress.completed;
                        const startHref = part.first_test_id
                            ? route('path.test.take', { level, test: part.first_test_id })
                            : route('path.tests', { level, part: Number(partKey) });

                        return (
                            <div
                                key={partKey}
                                className={`card bg-white rounded-[2rem] border-2 transition-all duration-300 overflow-hidden group ${
                                    isCompleted
                                        ? 'border-green-100 shadow-lg shadow-green-500/5'
                                        : isUnlocked
                                            ? 'border-blue-100 shadow-xl shadow-blue-500/5 hover:scale-[1.02] hover:border-blue-200'
                                            : 'border-gray-100 opacity-75 grayscale bg-gray-50/50 cursor-not-allowed'
                                }`}
                            >
                                <div className="card-body p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                                                isCompleted ? 'bg-green-500 text-white' : isUnlocked ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                                            }`}>
                                                {partKey}
                                            </div>
                                            <h2 className="text-xl font-black text-gray-900">Phần {partKey}</h2>
                                        </div>
                                        {isCompleted ? (
                                            <div className="bg-green-50 text-green-600 p-2 rounded-full border border-green-100">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                        ) : !isUnlocked && (
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>

                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                <span>Tiến độ của bạn</span>
                                                <span className={isCompleted ? 'text-green-600' : 'text-blue-600'}>{part.progress.score}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                                        isCompleted ? 'bg-green-500' : 'bg-blue-600'
                                                    }`}
                                                    style={{ width: `${part.progress.score}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-[10px] text-gray-400 font-bold italic uppercase">
                                                    Yêu cầu đạt: {part.pass_score}%
                                                </p>
                                                {!isUnlocked && (
                                                     <p className="text-[9px] text-red-400 font-bold uppercase tracking-tighter">
                                                         {Number(partKey) === 1
                                                            ? `Cần hoàn thành cấp độ trước`
                                                            : `Cần hoàn thành Phần ${Number(partKey) - 1}`
                                                         }
                                                     </p>
                                                 )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center text-xs font-bold text-gray-500">
                                                <FileQuestion className="w-4 h-4 mr-2 text-gray-300" />
                                                {part.tests.length} bài tập
                                            </div>
                                            <div className="flex items-center text-xs font-bold text-gray-500">
                                                <Clock className="w-4 h-4 mr-2 text-gray-300" />
                                                {part.tests.reduce((acc, test) => acc + test.duration, 0)} phút
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        {isUnlocked ? (
                                            <Link href={startHref} className="w-full">
                                                <button className={`btn w-full rounded-2xl h-14 font-black transition-all ${
                                                    isCompleted
                                                        ? 'btn-ghost bg-green-50 text-green-700 hover:bg-green-100 border-none'
                                                        : 'btn-primary bg-blue-600 border-none hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                                                }`}>
                                                    <Play className={`w-5 h-5 mr-2 ${isCompleted ? 'fill-green-700' : 'fill-white'}`} />
                                                    {isCompleted ? 'Luyện tập lại' : 'Bắt đầu ngay'}
                                                </button>
                                            </Link>
                                        ) : (
                                            <button className="btn btn-disabled w-full rounded-2xl h-14 font-black bg-gray-100 text-gray-400 border-none" disabled>
                                                <Lock className="w-5 h-5 mr-2" />
                                                Đang khóa
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Detailed Tests List */}
                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Danh sách bài tập chi tiết</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {visiblePartEntries.flatMap(([partKey, part]) =>
                            part.tests.map(test => {
                                const isUnlocked = part.unlocked;
                                return (
                                    <div
                                        key={test.id}
                                        className={`group bg-white rounded-3xl border-2 border-gray-50 p-8 shadow-sm transition-all duration-300 ${
                                            isUnlocked
                                                ? 'hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5'
                                                : 'opacity-60 grayscale bg-gray-50/50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{test.title}</h3>
                                                <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">Phần {partKey}</span>
                                            </div>
                                            {!isUnlocked && <Lock className="w-5 h-5 text-gray-300" />}
                                        </div>

                                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2 font-medium">{test.description || 'Bài luyện tập kỹ năng ngoại ngữ theo khung tham chiếu CEFR.'}</p>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <div className="flex gap-6">
                                                <div className="flex items-center text-xs font-black text-gray-700">
                                                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                                    {test.duration} PHÚT
                                                </div>
                                                <div className="flex items-center text-xs font-black text-gray-700">
                                                    <FileQuestion className="w-4 h-4 mr-2 text-indigo-500" />
                                                    {test.total_questions} CÂU HỎI
                                                </div>
                                            </div>

                                            {isUnlocked ? (
                                                <Link href={route('path.test.take', { level, test: test.id })}>
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                        <Play className="w-5 h-5 fill-current" />
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-300 flex items-center justify-center">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

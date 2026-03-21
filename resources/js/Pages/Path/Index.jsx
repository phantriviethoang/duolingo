import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { useState } from 'react';

export default function PathIndex({ levels, progressData }) {
    const [selectedLevel, setSelectedLevel] = useState('all');

    const getPartNumbers = (level) => {
        const parts = progressData[level] || {};

        return Object.keys(parts)
            .map((key) => {
                const matched = key.match(/^part(\d+)$/);
                return matched ? Number(matched[1]) : null;
            })
            .filter((value) => Number.isInteger(value))
            .sort((a, b) => a - b);
    };

    const handleLevelChange = (level) => {
        setSelectedLevel(level);
    };

    const getLevelProgress = (level) => {
        const parts = progressData[level] || {};
        const partNumbers = getPartNumbers(level);
        const totalParts = partNumbers.length || 1;
        const completedCount = partNumbers
            .filter(num => parts[`part${num}`]?.completed).length;
        return Math.round((completedCount / totalParts) * 100);
    };

    const filteredLevels = selectedLevel === 'all'
        ? levels
        : levels.filter(level => level === selectedLevel);

    return (
        <AuthenticatedLayout fullWidth={true}>
            <Head title="Lộ trình học tập" />

            <div className="max-w-full mx-auto px-4 py-8">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Lộ trình học tập</h1>
                    <p className="text-gray-500 font-medium text-lg">Theo dõi tiến trình chinh phục các cấp độ CEFR của bạn</p>
                </div>

                {/* Level Selector Dropdown */}
                <div className="card bg-white shadow-xl mb-10 border border-gray-100 rounded-3xl overflow-hidden">
                    <div className="card-body p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tất cả trình độ đều khả dụng</p>
                                    <h2 className="text-2xl font-black text-gray-900">Chọn level bạn muốn học</h2>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => handleLevelChange(e.target.value)}
                                    className="px-6 py-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer min-w-50"
                                >
                                    <option value="all">Tất cả trình độ</option>
                                    {levels.map(level => (
                                        <option key={level} value={level}>
                                            Trình độ {level}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => handleLevelChange('all')}
                                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    Hiện tất cả
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Levels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredLevels.map(level => {
                        const progress = getLevelProgress(level);
                        const partNumbers = getPartNumbers(level);

                        return (
                            <div key={level} className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 rounded-3xl overflow-hidden group border-transparent">
                                <div className="card-body p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl bg-gray-100 text-gray-400">
                                                {level}
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900">Trình độ {level}</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                                <span>Tiến độ hoàn thành</span>
                                                <span className="text-blue-600">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {partNumbers.map(part => {
                                                const partData = progressData[level]?.[`part${part}`];
                                                const completed = partData?.completed;
                                                const unlocked = partData?.unlocked;

                                                return (
                                                    <Link
                                                        key={part}
                                                        href={route('path.tests', { level, part })}
                                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-md ${completed
                                                            ? 'bg-green-50/50 border-green-100 hover:bg-green-100/50'
                                                            : unlocked
                                                                ? 'bg-blue-50/30 border-blue-100 hover:bg-blue-100/40'
                                                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <span className={`text-sm font-bold ${completed ? 'text-green-700' : unlocked ? 'text-blue-700' : 'text-gray-500'}`}>Phần {part}</span>
                                                        <div className="flex items-center gap-2">
                                                            {completed ? (
                                                                <>
                                                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Hoàn thành</span>
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                </>
                                                            ) : unlocked ? (
                                                                <>
                                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Đang học</span>
                                                                    <Play className="w-4 h-4 text-blue-500 fill-blue-500" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Đang khóa</span>
                                                                    <Lock className="w-4 h-4 text-gray-300" />
                                                                </>
                                                            )}
                                                        </div>
                                                    </Link>
                                                );
                                            })}

                                            {partNumbers.length === 0 && (
                                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-gray-500 font-semibold">
                                                    Chưa có phần nào cho trình độ này.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        href={route('path.parts', level)}
                                        className="btn mt-8 w-full rounded-2xl font-black transition-all btn-neutral border-none"
                                    >
                                        Chi tiết lộ trình
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

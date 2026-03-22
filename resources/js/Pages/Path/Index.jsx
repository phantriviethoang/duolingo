import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CheckCircle, Lock, Play, Target, Save, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PathIndex({ levels, progressData, auth, partCountPreferences = {} }) {
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('all');

    const { put, processing } = useForm({
        target_level: auth?.user?.target_level || ''
    });

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSaveLevel = (e, level) => {
        e.preventDefault();
        e.stopPropagation();
        put(route('path.saveLevel', { target_level: level }), {
            preserveScroll: true,
        });
    };

    const goalScore = auth?.user?.goal_score || 50;
    const currentTargetLevel = auth?.user?.target_level;

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

    const getDisplayPartNumbers = (level) => {
        const allParts = getPartNumbers(level);
        const preferenceCount = partCountPreferences?.[level];

        // Only show parts if user has explicitly set a preference for this level
        if (preferenceCount && preferenceCount > 0) {
            return allParts.slice(0, preferenceCount);
        }

        // User hasn't chosen yet - return empty
        return [];
    };

    const handleLevelChange = (level) => {
        setSelectedLevel(level);
    };

    const getLevelProgress = (level) => {
        const parts = progressData[level] || {};
        const displayPartNumbers = getDisplayPartNumbers(level);
        const totalParts = displayPartNumbers.length || 1;
        const completedCount = displayPartNumbers
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
                {/* Success Toast */}
                {showSuccess && (
                    <div className="fixed top-20 right-8 z-50 animate-bounce">
                        <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-2 border-emerald-400">
                            <Check className="w-6 h-6" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}

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
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Mục tiêu hiện tại: {goalScore}%</p>
                                    <h2 className="text-2xl font-black text-gray-900">Chọn level bạn muốn học</h2>
                                </div>
                                <Link
                                    href={route('path.target')}
                                    className="px-4 py-2 bg-gray-100 font-bold rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-sm"
                                >
                                    Sửa mục tiêu
                                </Link>
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
                        const partNumbers = getDisplayPartNumbers(level);

                        const isSelected = auth?.user?.target_level === level;

                        return (
                            <div key={level} className={`card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-4 rounded-3xl overflow-hidden group ${isSelected ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-blue-500/10' : 'border-transparent'}`}>
                                <div className="card-body p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 text-gray-400'}`}>
                                                {level}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900">Trình độ {level}</h3>
                                                {isSelected && <span className="text-[10px] bg-blue-100 text-blue-700 font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Hiện tại</span>}
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => handleSaveLevel(e, level)}
                                            disabled={processing}
                                            className={`p-3 rounded-2xl transition-all duration-300 shadow-sm active:scale-90 relative z-10 ${isSelected ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg'}`}
                                            title={isSelected ? "Trình độ hiện tại" : "Đặt làm trình độ mục tiêu"}
                                        >
                                            {isSelected ? <Check className="w-6 h-6" /> : <Save className={`w-6 h-6 ${processing ? 'animate-pulse' : ''}`} />}
                                        </button>
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

                                            {/* {partCountPreferences?.[level] && getDisplayPartNumbers(level).length > 0 && (
                                                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-3">
                                                    <div className="mb-2">📋 Các phần được hiển thị:</div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {getDisplayPartNumbers(level).map(part => (
                                                            <span
                                                                key={part}
                                                                className="bg-blue-100 text-blue-700 font-black px-2 py-1 rounded text-xs"
                                                            >
                                                                Phần {part}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
 */}
                                            {/* Parts List - Show based on displayPartNumbers */}
                                            {getDisplayPartNumbers(level).length > 0 ? (
                                                <div className="space-y-3">
                                                    {getDisplayPartNumbers(level).map(part => {
                                                        const partData = progressData[level]?.[`part${part}`];
                                                        const completed = partData?.completed;
                                                        const unlocked = partData?.unlocked;
                                                        const isClickable = unlocked || completed;

                                                        return isClickable ? (
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
                                                                <span className={`text-sm font-bold ${completed ? 'text-green-700' : unlocked ? 'text-blue-700' : 'text-gray-500'}`}>
                                                                    Phần {part}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    {completed ? (
                                                                        <>
                                                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">
                                                                                Hoàn thành
                                                                            </span>
                                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                                        </>
                                                                    ) : unlocked ? (
                                                                        <>
                                                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                                                                                Đang học
                                                                            </span>
                                                                            <Play className="w-4 h-4 text-blue-500 fill-blue-500" />
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                                                Đang khóa
                                                                            </span>
                                                                            <Lock className="w-4 h-4 text-gray-300" />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </Link>
                                                        ) : (
                                                            <div
                                                                key={part}
                                                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-not-allowed opacity-60 ${completed
                                                                    ? 'bg-green-50/50 border-green-100'
                                                                    : 'bg-gray-50 border-gray-100'
                                                                    }`}
                                                            >
                                                                <span className={`text-sm font-bold ${completed ? 'text-green-700' : 'text-gray-500'}`}>
                                                                    Phần {part}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                                        Đang khóa
                                                                    </span>
                                                                    <Lock className="w-4 h-4 text-gray-300" />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
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

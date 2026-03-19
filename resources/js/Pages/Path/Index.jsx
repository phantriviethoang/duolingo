import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { useState } from 'react';

export default function PathIndex({ currentLevel, levels, progressData }) {
    const { put } = useForm();
    const [selectedLevel, setSelectedLevel] = useState('all');

    const handleLevelChange = (level) => {
        setSelectedLevel(level);

        // "all" chỉ dùng để lọc giao diện, không lưu vào current_level.
        if (level === 'all') {
            return;
        }

        put(route('path.saveTarget'), { level });
    };

    const getLevelProgress = (level) => {
        const parts = progressData[level] || {};
        const totalParts = 3; // Tất cả các level đều có 3 parts
        const completedCount = [1, 2, 3]
            .filter(num => parts[`part${num}`]?.completed).length;
        return Math.round((completedCount / totalParts) * 100);
    };

    const filteredLevels = selectedLevel === 'all'
        ? levels
        : levels.filter(level => level === selectedLevel);

    return (
        <AuthenticatedLayout>
            <Head title="Lộ trình học tập" />

            <div className="max-w-6xl mx-auto px-4 py-8">
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
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Trình độ mục tiêu</p>
                                    <h2 className="text-2xl font-black text-gray-900">Level {currentLevel}</h2>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => handleLevelChange(e.target.value)}
                                    className="px-6 py-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer min-w-[200px]"
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
                        const isCurrent = level === currentLevel;

                        return (
                            <div key={level} className={`card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-2 rounded-3xl overflow-hidden group ${isCurrent ? 'border-blue-500 ring-4 ring-blue-500/5 scale-[1.02]' : 'border-transparent'}`}>
                                <div className="card-body p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                {level}
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900">Trình độ {level}</h3>
                                        </div>
                                        {isCurrent && (
                                            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                                Mục tiêu
                                            </span>
                                        )}
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
                                            {[1, 2, 3].map(part => {
                                                const partData = progressData[level]?.[`part${part}`];
                                                const completed = partData?.completed;
                                                const unlocked = partData?.unlocked;

                                                return (
                                                    <div key={part} className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${completed ? 'bg-green-50/50 border-green-100' : unlocked ? 'bg-blue-50/30 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
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
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <Link
                                        href={route('path.parts', level)}
                                        className={`btn mt-8 w-full rounded-2xl font-black transition-all ${isCurrent ? 'btn-primary shadow-lg shadow-blue-500/20' : 'btn-ghost bg-gray-50 hover:bg-gray-100 text-gray-700 border-none'}`}
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

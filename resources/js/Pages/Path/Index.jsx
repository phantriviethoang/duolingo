import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { useState } from 'react';

export default function PathIndex({ currentLevel, levels, progressData }) {
    const { put } = useForm();
    const [selectedLevel, setSelectedLevel] = useState(currentLevel || 'all');

    const handleLevelChange = (level) => {
        setSelectedLevel(level);
        put(route('path.saveTarget'), { level });
    };

    const getLevelProgress = (level) => {
        const parts = progressData[level] || {};
        // A1 chỉ có 1 part, các level còn lại có 3 parts
        const totalParts = level === 'A1' ? 1 : 3;
        const completed = Object.values(parts).filter(part => part.completed).length;
        return Math.round((completed / totalParts) * 100);
    };

    // Lọc và sắp xếp levels theo lựa chọn
    const filteredLevels = selectedLevel === 'all'
        ? levels
        : levels.filter(level => level === selectedLevel);

    return (
        <AuthenticatedLayout>
            <Head title="Learning Path" />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Path</h1>
                    <p className="text-gray-600">Track your progress through CEFR levels</p>
                </div>

                {/* Level Selector Dropdown */}
                <div className="card bg-base-100 shadow-lg mb-8">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title">Current Level: {currentLevel}</h2>

                            {/* Level Dropdown */}
                            <select
                                value={selectedLevel}
                                onChange={(e) => handleLevelChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Tất cả levels</option>
                                {levels.map(level => (
                                    <option key={level} value={level}>
                                        Level {level}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => handleLevelChange('all')}
                            className="btn btn-outline btn-sm"
                        >
                            Xóa lọc
                        </button>
                    </div>
                </div>

                {/* Levels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLevels.map(level => {
                        const progress = getLevelProgress(level);
                        const isCurrent = level === currentLevel;

                        return (
                            <div key={level} className={`card bg-base-100 shadow-lg ${isCurrent ? 'ring-2 ring-primary' : ''}`}>
                                <div className="card-body">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="card-title">Level {level}</h3>
                                        {isCurrent && <span className="badge badge-primary">Current</span>}
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Progress</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium">{progress}%</span>
                                            </div>
                                        </div>

                                        {[1, 2, 3].map(part => {
                                            const partData = progressData[level]?.[`part${part}`];
                                            const completed = partData?.completed;

                                            return (
                                                <div key={part} className="flex items-center justify-between p-2 rounded bg-base-200">
                                                    <span className="text-sm">Part {part}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${completed
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {completed ? 'Completed' : 'Locked'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Link
                                        href={route('path.parts', level)}
                                        className="btn btn-primary btn-sm mt-4"
                                    >
                                        View Details
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

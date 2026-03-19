import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CheckCircle, Lock, Play } from 'lucide-react';

export default function PathIndex({ currentLevel, levels, progressData }) {
    const { put } = useForm();

    const handleLevelChange = (level) => {
        put(route('path.update'), { level });
    };

    const getLevelProgress = (level) => {
        const parts = progressData[level] || {};
        const completed = Object.values(parts).filter(part => part.completed).length;
        return Math.round((completed / 3) * 100);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Learning Path" />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Path</h1>
                    <p className="text-gray-600">Track your progress through CEFR levels</p>
                </div>

                {/* Current Level Selector */}
                <div className="card bg-base-100 shadow-lg mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Current Level: {currentLevel}</h2>
                        <div className="flex flex-wrap gap-2">
                            {levels.map(level => (
                                <button
                                    key={level}
                                    onClick={() => handleLevelChange(level)}
                                    className={`btn ${
                                        level === currentLevel ? 'btn-primary' : 'btn-outline'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Levels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levels.map(level => {
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
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="progress progress-primary w-full" style={{ '--value': progress }}></div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {[1, 2, 3].map(part => {
                                            const partData = progressData[level]?.[`part${part}`];
                                            const completed = partData?.completed;
                                            
                                            return (
                                                <div key={part} className="flex items-center justify-between p-2 rounded bg-base-200">
                                                    <span className="text-sm">Part {part}</span>
                                                    {completed ? (
                                                        <CheckCircle className="w-4 h-4 text-success" />
                                                    ) : (
                                                        <Lock className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Link href={route('path.show', level)}>
                                        <button className="btn btn-primary w-full">
                                            <Play className="w-4 h-4 mr-2" />
                                            View Level
                                        </button>
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

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { TrendingUp, BookOpen, Target, Calendar } from 'lucide-react';

export default function ProgressIndex({ progressData, recentResults, stats }) {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    
    const getOverallProgress = () => {
        const totalParts = levels.length * 3;
        let completedParts = 0;
        
        levels.forEach(level => {
            [1, 2, 3].forEach(part => {
                if (progressData[level]?.[`part${part}`]?.completed) {
                    completedParts++;
                }
            });
        });
        
        return Math.round((completedParts / totalParts) * 100);
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-success';
        if (score >= 75) return 'text-primary';
        if (score >= 60) return 'text-warning';
        return 'text-error';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Progress" />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
                    <p className="text-gray-600">Track your learning journey</p>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center">
                                <Target className="w-8 h-8 text-primary mr-3" />
                                <div>
                                    <p className="text-2xl font-bold">{getOverallProgress()}%</p>
                                    <p className="text-gray-600">Overall Progress</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center">
                                <BookOpen className="w-8 h-8 text-success mr-3" />
                                <div>
                                    <p className="text-2xl font-bold">{stats?.testsCompleted || 0}</p>
                                    <p className="text-gray-600">Tests Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center">
                                <TrendingUp className="w-8 h-8 text-warning mr-3" />
                                <div>
                                    <p className="text-2xl font-bold">{stats?.averageScore || 0}%</p>
                                    <p className="text-gray-600">Average Score</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="card bg-base-100 shadow-lg mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-6">Level Progress</h2>
                        <div className="space-y-6">
                            {levels.map(level => (
                                <div key={level}>
                                    <div className="flex items-center mb-3">
                                        <BookOpen className="w-5 h-5 mr-2 text-primary" />
                                        <h3 className="text-lg font-semibold">Level {level}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[1, 2, 3].map(part => {
                                            const partData = progressData[level]?.[`part${part}`];
                                            const isCompleted = partData?.completed;
                                            const score = partData?.score || 0;
                                            const attempts = partData?.attempts || 0;
                                            
                                            return (
                                                <div key={part} className="card bg-base-200">
                                                    <div className="card-body p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium">Part {part}</span>
                                                            {isCompleted ? (
                                                                <span className="badge badge-success">Completed</span>
                                                            ) : (
                                                                <span className="badge badge-outline">Not Started</span>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="text-sm text-gray-600 mb-2">
                                                            Score: <span className={`font-semibold ${getScoreColor(score)}`}>{score}%</span>
                                                        </div>
                                                        
                                                        <div className="text-sm text-gray-600 mb-3">
                                                            Attempts: {attempts}
                                                        </div>
                                                        
                                                        <div className="progress progress-primary w-full" style={{ '--value': score }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Results */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="card-title">Recent Results</h2>
                            <Link href={route('results.index')}>
                                <button className="btn btn-outline btn-sm">View All</button>
                            </Link>
                        </div>
                        
                        {recentResults?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Test</th>
                                            <th>Score</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentResults.map(result => (
                                            <tr key={result.id}>
                                                <td>{result.test?.title}</td>
                                                <td>
                                                    <span className={`badge ${getScoreColor(result.score)}`}>
                                                        {result.score}%
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {new Date(result.completed_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <Link href={route('results.show', result.id)}>
                                                        <button className="btn btn-outline btn-sm">View</button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No test results yet. Start practicing to see your progress!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

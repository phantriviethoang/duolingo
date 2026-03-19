import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Lock, Play, Clock, FileQuestion, BookOpen } from 'lucide-react';

export default function TestsIndex({ tests }) {
    const groupedTests = tests.reduce((acc, test) => {
        if (!acc[test.level]) {
            acc[test.level] = [];
        }
        acc[test.level].push(test);
        return acc;
    }, {});

    const sortedLevels = Object.keys(groupedTests).sort((a, b) => {
        const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        return levelOrder.indexOf(a) - levelOrder.indexOf(b);
    });

    return (
        <AuthenticatedLayout>
            <Head title="Tests" />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Tests</h1>
                    <p className="text-gray-600">Choose your level and part to start practicing</p>
                </div>

                {sortedLevels.map(level => (
                    <div key={level} className="mb-8">
                        <div className="flex items-center mb-4">
                            <BookOpen className="w-6 h-6 mr-2 text-primary" />
                            <h2 className="text-2xl font-semibold text-gray-900">Level {level}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {groupedTests[level].map(test => (
                                <div key={test.id} className="card bg-base-100 shadow-lg">
                                    <div className="card-body">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="badge badge-primary">Part {test.part}</span>
                                            {test.locked && <Lock className="w-4 h-4 text-warning" />}
                                        </div>

                                        <h3 className="card-title text-lg">{test.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{test.description}</p>

                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {test.duration} minutes
                                            <FileQuestion className="w-4 h-4 ml-4 mr-1" />
                                            {test.total_questions} questions
                                        </div>

                                        <div className="card-actions justify-end">
                                            {test.locked ? (
                                                <button className="btn btn-disabled" disabled>
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Locked
                                                </button>
                                            ) : (
                                                <Link href={route('path.test.take', { level: test.level, test: test.id })}>
                                                    <button className="btn btn-primary">
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Start Test
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {tests.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No tests available
                        </h3>
                        <p className="text-gray-500">
                            Check back later for new tests.
                        </p>
                    </div>
                )
                }
            </div>
        </AuthenticatedLayout>
    );
}

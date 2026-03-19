import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CheckCircle, Lock, Play, Clock, FileQuestion } from 'lucide-react';

export default function PathShow({ level, parts }) {
    return (
        <AuthenticatedLayout>
            <Head title={`${level} Learning Path`} />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href={route('path.index')}>
                        <button className="btn btn-outline btn-sm mb-4">
                            ← Back to Path
                        </button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Level {level}</h1>
                    <p className="text-gray-600">Complete all three parts to unlock the next level</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.values(parts).map(part => (
                        <div key={part.name} className={`card bg-base-100 shadow-lg ${!part.unlocked ? 'opacity-75' : ''}`}>
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="card-title">{part.name}</h2>
                                    {part.progress.completed ? (
                                        <span className="badge badge-success">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Completed
                                        </span>
                                    ) : part.unlocked ? (
                                        <span className="badge badge-primary">Available</span>
                                    ) : (
                                        <span className="badge badge-neutral">
                                            <Lock className="w-3 h-3 mr-1" />
                                            Locked
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Score</span>
                                        <span>{part.progress.score}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Required</span>
                                        <span>{part.pass_score}%</span>
                                    </div>
                                    <div className="progress progress-primary w-full" style={{ '--value': part.progress.score }}></div>
                                </div>

                                <div className="text-sm text-gray-600 mb-4">
                                    <div className="flex items-center mb-2">
                                        <FileQuestion className="w-4 h-4 mr-1" />
                                        {part.tests.length} tests available
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {part.tests.reduce((acc, test) => acc + test.duration, 0)} minutes total
                                    </div>
                                </div>

                                <div className="card-actions justify-end">
                                    {part.unlocked ? (
                                        <Link href={route('tests.index')}>
                                            <button className="btn btn-primary">
                                                <Play className="w-4 h-4 mr-2" />
                                                Start Practice
                                            </button>
                                        </Link>
                                    ) : (
                                        <button className="btn btn-disabled" disabled>
                                            <Lock className="w-4 h-4 mr-2" />
                                            Locked
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tests List */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Tests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.values(parts).flatMap(part => 
                            part.tests.map(test => (
                                <div key={test.id} className={`card bg-base-100 shadow-lg ${!part.unlocked ? 'opacity-75' : ''}`}>
                                    <div className="card-body p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold">{test.title}</h3>
                                            <span className="badge badge-outline">{part.name}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {test.duration} minutes
                                            <FileQuestion className="w-4 h-4 ml-4 mr-1" />
                                            {test.total_questions} questions
                                        </div>
                                        {part.unlocked ? (
                                            <Link href={route('tests.show', test.id)}>
                                                <button className="btn btn-primary btn-sm">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Start Test
                                                </button>
                                            </Link>
                                        ) : (
                                            <button className="btn btn-disabled btn-sm" disabled>
                                                <Lock className="w-4 h-4 mr-2" />
                                                Locked
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

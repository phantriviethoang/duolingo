import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, AlertCircle, ArrowLeft, RotateCcw, Home } from 'lucide-react';
import Layout from '@/Layouts/Layout';

const CEFRResult = ({ level, part, score, totalQuestions, percentage, isPassed, passThreshold, completedAt }) => {
    return (
        <Layout>
            <Head title={`Kết quả Part ${part} - ${level}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Kết quả Part {part}</h1>
                                    <p className="text-blue-100">Trình độ {level}</p>
                                </div>
                                <Link href={route('cefr.level', { level })}>
                                    <button className="flex items-center px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Về lộ trình
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Result Content */}
                        <div className="p-6">
                            {/* Status Icon */}
                            <div className="text-center mb-6">
                                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                                    isPassed ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                    {isPassed ? 
                                        <CheckCircle className="w-12 h-12 text-green-600" /> :
                                        <AlertCircle className="w-12 h-12 text-red-600" />
                                    }
                                </div>
                                
                                <h2 className={`text-3xl font-bold mb-2 ${
                                    isPassed ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {isPassed ? 'ĐẠT YÊU CẦU!' : 'CHƯA ĐẠT YÊU CẦU'}
                                </h2>
                                
                                <p className="text-gray-600 text-lg">
                                    Bạn đã hoàn thành Part {part} của trình độ {level}
                                </p>
                            </div>

                            {/* Score Details */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <div className="grid grid-cols-3 gap-6 text-center">
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900">{score}</div>
                                        <div className="text-sm text-gray-600">Số câu đúng</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900">{totalQuestions}</div>
                                        <div className="text-sm text-gray-600">Tổng số câu</div>
                                    </div>
                                    <div>
                                        <div className={`text-3xl font-bold ${
                                            isPassed ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {percentage}%
                                        </div>
                                        <div className="text-sm text-gray-600">Tỷ lệ đúng</div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-center">
                                        <span className="text-gray-600">Yêu cầu để đạt: </span>
                                        <span className="ml-2 font-bold text-red-600">{passThreshold}%</span>
                                        <span className={`ml-2 font-bold ${
                                            isPassed ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {isPassed ? '✅' : '❌'}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div 
                                            className={`h-4 rounded-full transition-all duration-500 ${
                                                isPassed ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Completion Info */}
                            {completedAt && (
                                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                    <div className="flex items-center text-blue-800">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        <span>Hoàn thành lúc: {new Date(completedAt).toLocaleString('vi-VN')}</span>
                                    </div>
                                </div>
                            )}

                            {/* Next Steps */}
                            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Các bước tiếp theo:</h3>
                                <div className="text-sm text-gray-700">
                                    {isPassed ? (
                                        <div>
                                            <p>✅ Part {part} đã hoàn thành!</p>
                                            {part < 3 ? (
                                                <p>Bạn có thể tiếp tục làm Part {part + 1} của trình độ {level}.</p>
                                            ) : (
                                                <p>Xin chúc mừng! Bạn đã hoàn thành tất cả các phần của trình độ {level}.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <p>❌ Bạn cần đạt ít nhất {passThreshold}% để hoàn thành Part {part}.</p>
                                            <p>Hãy xem lại lỗi sai và làm lại để cải thiện điểm số.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href={route('cefr.level', { level })}>
                                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                                        <Home className="w-4 h-4 mr-2" />
                                        Về lộ trình học
                                    </button>
                                </Link>
                                
                                {!isPassed && (
                                    <button 
                                        onClick={() => window.history.back()}
                                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Làm lại
                                    </button>
                                )}
                                
                                {isPassed && part < 3 && (
                                    <Link href={route('cefr.start-part', { level, part: part + 1 })}>
                                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                            Làm Part {part + 1}
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CEFRResult;

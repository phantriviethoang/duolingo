import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { Trash2 } from 'lucide-react';

export default function Create({ auth, tests = [], levels = [] }) {
    const { data, setData, post, errors, processing } = useForm({
        test_id: '',
        level: '',
        part_number: '',
        question_text: '',
        explanation: '',
        translation: '',
        detailed_explanation: '',
        answers: [
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
        ]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.questions.store'));
    };

    const handleAnswerChange = (index, field, value) => {
        const newAnswers = [...data.answers];
        newAnswers[index][field] = value;
        setData('answers', newAnswers);
    };

    const addAnswer = () => {
        setData('answers', [...data.answers, { text: '', is_correct: false }]);
    };

    const removeAnswer = (index) => {
        const newAnswers = [...data.answers];
        newAnswers.splice(index, 1);
        setData('answers', newAnswers);
    };

    // Get test level and parts for auto-fill
    const getTestLevelAndParts = (testId) => {
        if (!testId) return [];
        const test = tests.find(t => t.id === parseInt(testId));
        return test?.parts || [];
    };

    return (
        <AdminLayout current="/admin/questions">
            <Head title="Create Question" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Thêm câu hỏi mới</h1>
                    <p className="text-gray-500 font-medium mt-1">Tạo một câu hỏi mới cho ngân hàng câu hỏi</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Test Set, Level, Part Number */}
                    <div className="bg-white rounded-[1.5rem] border-2 border-gray-50 shadow-sm p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-3">Test Set (Bộ đề)</label>
                                <select
                                    value={data.test_id}
                                    onChange={(e) => {
                                        setData('test_id', e.target.value);
                                        const test = tests.find(t => t.id === parseInt(e.target.value));
                                        if (test) {
                                            setData('level', test.level);
                                        }
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors"
                                >
                                    <option value="">-- Select Test --</option>
                                    {tests.map(test => (
                                        <option key={test.id} value={test.id}>{test.title}</option>
                                    ))}
                                </select>
                                {errors.test_id && <div className="text-red-600 text-sm mt-2 font-medium">{errors.test_id}</div>}
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-3">Level</label>
                                <select
                                    value={data.level}
                                    onChange={(e) => setData('level', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors"
                                >
                                    <option value="">-- Select Level --</option>
                                    {levels.map(level => (
                                        <option key={level.name} value={level.name}>{level.name}</option>
                                    ))}
                                </select>
                                {errors.level && <div className="text-red-600 text-sm mt-2 font-medium">{errors.level}</div>}
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-3">Part Number (Phần)</label>
                                <input
                                    type="number"
                                    value={data.part_number}
                                    onChange={(e) => setData('part_number', e.target.value)}
                                    placeholder="1"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors"
                                />
                                {errors.part_number && <div className="text-red-600 text-sm mt-2 font-medium">{errors.part_number}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Question Text */}
                    <div className="bg-white rounded-[1.5rem] border-2 border-gray-50 shadow-sm p-8">
                        <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-3">Question Text</label>
                        <textarea
                            value={data.question_text}
                            onChange={(e) => setData('question_text', e.target.value)}
                            placeholder="When filling out the order form, please ...... your address clearly to prevent delays."
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors h-32 resize-none"
                        />
                        {errors.question_text && <div className="text-red-600 text-sm mt-2 font-medium">{errors.question_text}</div>}
                    </div>

                    {/* Translation and Explanation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-[1.5rem] border-2 border-gray-50 shadow-sm p-8">
                            <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-3">Translation (Optional)</label>
                            <textarea
                                value={data.translation}
                                onChange={(e) => setData('translation', e.target.value)}
                                placeholder="Khi điền vào đơn đặt hàng, vui lòng ...... địa chỉ của bạn một cách rõ ràng."
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors h-32 resize-none"
                            />
                        </div>
                        <div className="bg-white rounded-[1.5rem] border-2 border-gray-50 shadow-sm p-8">
                            <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-3">Explanation (Optional)</label>
                            <textarea
                                value={data.explanation}
                                onChange={(e) => setData('explanation', e.target.value)}
                                placeholder="Trong bối cảnh này, 'fill in' có nghĩa là 'điền', và danh từ phù hợp là một địa chỉ."
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors h-32 resize-none"
                            />
                        </div>
                    </div>

                    {/* Detailed Explanation */}
                    <div className="bg-white rounded-[1.5rem] border-2 border-gray-50 shadow-sm p-8">
                        <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-3">Detailed Explanation (Optional)</label>
                        <textarea
                            value={data.detailed_explanation}
                            onChange={(e) => setData('detailed_explanation', e.target.value)}
                            placeholder="Trong câu này, 'Filling out the form' (điền đơn) đi kèm với 'write' (viết) để chỉ chú ý an toàn còn 'direct' (chỉ chỉ rõ). Cum 'write your address' là tư duy thông thường."
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors h-24 resize-none"
                        />
                    </div>

                    {/* Answers */}
                    <div className="bg-white rounded-[1.5rem] border-2 border-gray-50 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Answers</h3>
                            <button
                                type="button"
                                onClick={addAnswer}
                                className="text-blue-600 hover:text-blue-700 font-bold text-sm"
                            >
                                + Add Answer
                            </button>
                        </div>
                        {errors.answers && <div className="text-red-600 text-sm mb-4 font-medium">{errors.answers}</div>}

                        <div className="space-y-3">
                            {data.answers.map((answer, index) => (
                                <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-gray-200">
                                    <input
                                        type="radio"
                                        name="correct_answer"
                                        checked={answer.is_correct}
                                        onChange={() => {
                                            const newAnswers = data.answers.map((ans, i) => ({
                                                ...ans,
                                                is_correct: i === index
                                            }));
                                            setData('answers', newAnswers);
                                        }}
                                        className="w-5 h-5 text-blue-600 cursor-pointer flex-shrink-0"
                                    />
                                    <input
                                        type="text"
                                        value={answer.text}
                                        onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 px-3 py-2 rounded border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                                    />
                                    {data.answers.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAnswer(index)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href={route('admin.questions.index')}
                            className="px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Save Question
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

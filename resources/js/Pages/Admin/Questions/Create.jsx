import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Pages/Admin/Layout';

export default function Create({ auth, tests, levels }) {
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

    return (
        <AdminLayout current="/admin/questions">
            <Head title="Create Question" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b">
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Metadata */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border p-4 rounded bg-gray-50">
                                    <div>
                                        <label className="block text-sm font-medium">Test Set (Bộ đề)</label>
                                        <select 
                                            value={data.test_id}
                                            onChange={(e) => setData('test_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        >
                                            <option value="">-- Select Test --</option>
                                            {tests.map(test => (
                                                <option key={test.id} value={test.id}>{test.title} ({test.level})</option>
                                            ))}
                                        </select>
                                        {errors.test_id && <div className="text-red-600 text-sm mt-1">{errors.test_id}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Level</label>
                                        <select 
                                            value={data.level}
                                            onChange={(e) => setData('level', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        >
                                            <option value="">-- Select Level --</option>
                                            {levels.map(level => (
                                                <option key={level.name} value={level.name}>{level.name}</option>
                                            ))}
                                        </select>
                                        {errors.level && <div className="text-red-600 text-sm mt-1">{errors.level}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Part Number (Phần)</label>
                                        <input 
                                            type="number"
                                            value={data.part_number}
                                            onChange={(e) => setData('part_number', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {errors.part_number && <div className="text-red-600 text-sm mt-1">{errors.part_number}</div>}
                                    </div>
                                </div>

                                {/* Question details */}
                                <div>
                                    <label className="block text-sm font-medium">Question Text</label>
                                    <textarea 
                                        value={data.question_text}
                                        onChange={(e) => setData('question_text', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-32"
                                    />
                                    {errors.question_text && <div className="text-red-600 text-sm mt-1">{errors.question_text}</div>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium">Translation (Optional)</label>
                                        <textarea 
                                            value={data.translation}
                                            onChange={(e) => setData('translation', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Explanation (Optional)</label>
                                        <textarea 
                                            value={data.explanation}
                                            onChange={(e) => setData('explanation', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium">Detailed Explanation (Optional)</label>
                                        <textarea 
                                            value={data.detailed_explanation}
                                            onChange={(e) => setData('detailed_explanation', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-24"
                                        />
                                    </div>
                                </div>

                                {/* Answers */}
                                <div className="border p-4 rounded">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-medium">Answers</h4>
                                        <button 
                                            type="button" 
                                            onClick={addAnswer}
                                            className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                                        >
                                            + Add Answer
                                        </button>
                                    </div>
                                    {errors.answers && <div className="text-red-600 text-sm mb-4">{errors.answers}</div>}
                                    
                                    <div className="space-y-4">
                                        {data.answers.map((answer, index) => (
                                            <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded">
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
                                                    className="w-5 h-5 text-blue-600"
                                                />
                                                <input 
                                                    type="text"
                                                    value={answer.text}
                                                    onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeAnswer(index)}
                                                    className="text-red-600"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 border-t pt-4">
                                    <Link href={route('admin.questions.index')} className="px-4 py-2 border rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                                        Cancel
                                    </Link>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Save Question
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

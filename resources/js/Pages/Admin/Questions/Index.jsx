import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Pages/Admin/Layout';

export default function Index({ auth, questions, filters, tests, levels }) {
    const [level, setLevel] = useState(filters.level || '');
    const [testId, setTestId] = useState(filters.test_id || '');
    const [partNumber, setPartNumber] = useState(filters.part_number || '');

    const handleFilter = () => {
        router.get(route('admin.questions.index'), {
            level,
            test_id: testId,
            part_number: partNumber
        }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this question?')) {
            router.delete(route('admin.questions.destroy', id));
        }
    };

    return (
        <AdminLayout current="/admin/questions">
            <Head title="Questions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Questions List</h3>
                                <Link 
                                    href={route('admin.questions.create')} 
                                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                                >
                                    + Add Question
                                </Link>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-4 mb-6">
                                <select 
                                    value={level} 
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="border rounded p-2"
                                >
                                    <option value="">All Levels</option>
                                    {levels.map((lvl) => (
                                        <option key={lvl.name} value={lvl.name}>{lvl.name}</option>
                                    ))}
                                </select>
                                
                                <select 
                                    value={testId} 
                                    onChange={(e) => setTestId(e.target.value)}
                                    className="border rounded p-2"
                                >
                                    <option value="">All Tests</option>
                                    {tests.map((test) => (
                                        <option key={test.id} value={test.id}>{test.title}</option>
                                    ))}
                                </select>

                                <input 
                                    type="number" 
                                    value={partNumber} 
                                    onChange={(e) => setPartNumber(e.target.value)}
                                    placeholder="Part Number"
                                    className="border rounded p-2 w-32"
                                />

                                <button 
                                    onClick={handleFilter}
                                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Filter
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-3">ID</th>
                                            <th className="border-b p-3">Question</th>
                                            <th className="border-b p-3">Level</th>
                                            <th className="border-b p-3">Test</th>
                                            <th className="border-b p-3">Part</th>
                                            <th className="border-b p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.data.map((q) => (
                                            <tr key={q.id}>
                                                <td className="border-b p-3">{q.id}</td>
                                                <td className="border-b p-3 max-w-xs truncate" title={q.question_text}>{q.question_text}</td>
                                                <td className="border-b p-3">{q.level}</td>
                                                <td className="border-b p-3">{q.test ? q.test.title : '-'}</td>
                                                <td className="border-b p-3">{q.part_number}</td>
                                                <td className="border-b p-3 space-x-2">
                                                    <Link 
                                                        href={route('admin.questions.edit', q.id)}
                                                        className="text-indigo-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(q.id)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex justify-center gap-2">
                                {questions.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 border rounded ${
                                            link.active ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

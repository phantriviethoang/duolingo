import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { Plus, Edit2, Trash2, FileQuestion } from 'lucide-react';

export default function Index({ auth, questions = {}, filters = {}, tests = [], levels = [] }) {
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
        if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
            router.delete(route('admin.questions.destroy', id));
        }
    };

    const handleClearFilters = () => {
        setLevel('');
        setTestId('');
        setPartNumber('');
        router.get(route('admin.questions.index'), {}, { preserveState: true });
    };

    return (
        <AdminLayout current="/admin/questions">
            <Head title="Questions" />

            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Ngân hàng câu hỏi</h1>
                        <p className="text-gray-500 font-medium mt-1">
                            {(level || testId || partNumber)
                                ? `Đang lọc: ${level ? `Trình độ ${level}` : ''} ${testId ? ` - Đề thi ${testId}` : ''} ${partNumber ? ` - Phần ${partNumber}` : ''}`
                                : 'Danh sách tất cả các câu hỏi trong ngân hàng.'
                            }
                        </p>
                    </div>
                    <Link
                        href={route('admin.questions.create')}
                        className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none rounded-xl px-6 font-bold shadow-lg shadow-blue-500/20 gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm câu hỏi mới
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-[1.5rem] border-2 border-gray-50 shadow-sm p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Bộ lọc</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Trình độ</label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors"
                            >
                                <option value="">Tất cả trình độ</option>
                                {levels.map((lvl) => (
                                    <option key={lvl.name} value={lvl.name}>{lvl.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Đề thi</label>
                            <select
                                value={testId}
                                onChange={(e) => setTestId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors"
                            >
                                <option value="">Tất cả đề thi</option>
                                {tests.map((test) => (
                                    <option key={test.id} value={test.id}>{test.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Phần</label>
                            <input
                                type="number"
                                value={partNumber}
                                onChange={(e) => setPartNumber(e.target.value)}
                                placeholder="Số phần"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold"
                            >
                                Lọc
                            </button>
                            {(level || testId || partNumber) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex-1 bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-bold"
                                >
                                    Xóa bộ lọc
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Questions Table */}
                <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Câu hỏi</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trình độ</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Phần</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Đề thi</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.data && questions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                                    <FileQuestion className="w-10 h-10" />
                                                </div>
                                                <p className="text-gray-400 font-bold">Chưa có câu hỏi nào phù hợp.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    questions.data && questions.data.map((q) => (
                                        <tr key={q.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                            <td className="px-8 py-6">
                                                <div className="max-w-2xl">
                                                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{q.question_text}</p>
                                                    <p className="text-xs text-gray-400 mt-1">ID: {q.id}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-center">
                                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                                                        {q.level}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-indigo-100">
                                                    Part {q.part_number}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <p className="text-sm font-medium text-gray-600">{q.test ? q.test.title : '-'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route('admin.questions.edit', q.id)}
                                                        className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(q.id)}
                                                        className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {questions.links && questions.links.length > 0 && (
                    <div className="flex justify-center gap-2 flex-wrap">
                        {questions.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-lg font-bold transition-colors ${link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border-2 border-gray-100 hover:border-blue-500'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

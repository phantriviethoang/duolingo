import { Head, Link, useForm } from "@inertiajs/react";
import { BookOpen, Settings2, Save, Database, Eye } from "lucide-react";
import AdminLayout from "../Layout";
import { useState } from "react";

export default function PathIndex({ pathData, levels }) {
    const [editingLevel, setEditingLevel] = useState(null);

    return (
        <AdminLayout current="/admin/path">
            <Head title="Quản lý lộ trình học tập" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý lộ trình</h1>
                    <p className="text-gray-500 font-medium mt-1">Quản lý số bộ đề và ngưỡng điểm đạt theo từng trình độ.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {levels.map((level) => (
                        <LevelCard
                            key={level}
                            level={level}
                            data={pathData[level]}
                            isEditing={editingLevel === level}
                            onEdit={() => setEditingLevel(level)}
                            onCancel={() => setEditingLevel(null)}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

function LevelCard({ level, data, isEditing, onEdit, onCancel }) {
    const scores = data.config?.part_scores || { 1: 60, 2: 75, 3: 90 };
    const {
        data: formData,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        part1: scores[1] || 60,
        part2: scores[2] || 75,
        part3: scores[3] || 90,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.path.updateThreshold", level), {
            onSuccess: () => onCancel(),
        });
    };

    return (
        <div className="bg-white border-2 border-gray-50 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border border-blue-100">
                            {level}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Trình độ {level}</h3>
                            <p className="text-sm text-gray-400 mt-0.5">Thiết lập lộ trình và bài tập</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={onEdit}
                                    className="flex items-center gap-2 px-4 py-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors"
                                >
                                    <Settings2 className="w-4 h-4" />
                                    Thiết lập điểm
                                </button>
                                <Link
                                    href={route("path.parts", level)}
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 font-bold text-sm hover:border-gray-300 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    Xem phía học viên
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-500 font-bold text-sm hover:text-gray-700 transition-colors"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </div>

                {/* Parts Grid */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.from({ length: Math.max(3, data?.max_part || 3) }, (_, i) => i + 1).map((part) => {
                            const partKey = `part${part}`;
                            const questionKey = `q_part${part}`;
                            const testCount = data?.[partKey] || 0;
                            const questionCount = data?.[questionKey] || 0;
                            const passScore = data?.config?.part_scores?.[part] || ((part - 1) * 15 + 60);

                            return (
                                <div
                                    key={part}
                                    className={`border-2 rounded-2xl p-6 transition-all ${isEditing
                                            ? "border-blue-200 bg-blue-50/40"
                                            : "border-gray-100 bg-gray-50/40"
                                        }`}
                                >
                                    {/* Part Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-lg font-black text-gray-900">Phần {part}</span>
                                        {!isEditing ? (
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-200">
                                                Đạt {passScore}%
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className={`w-14 px-2 py-1 border-2 rounded-lg text-center font-bold text-sm focus:outline-none focus:border-blue-500 ${errors[partKey] ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                    value={formData[partKey] || passScore}
                                                    onChange={(e) => setData(partKey, e.target.value)}
                                                    min="0"
                                                    max="100"
                                                />
                                                <span className="text-xs font-black text-gray-500">%</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Issues Display */}
                                    {errors[partKey] && (
                                        <div className="text-red-600 text-[10px] font-bold mb-3">{errors[partKey]}</div>
                                    )}

                                    {/* Stats */}
                                    <div className="space-y-3 mb-6 py-4 border-y border-gray-200">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <BookOpen className="h-4 w-4 text-blue-500" />
                                            <span>{testCount} bộ đề luyện tập</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Database className="h-4 w-4 text-indigo-500" />
                                            <span>{questionCount} câu hỏi</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {!isEditing && (
                                        <Link
                                            href={route("admin.tests", { level, part })}
                                            className="w-full block text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                                        >
                                            Quản lý bộ đề
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? "Đang lưu..." : "Lưu thiết lập"}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

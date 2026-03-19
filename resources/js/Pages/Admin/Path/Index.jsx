import { Head, Link, useForm } from "@inertiajs/react";
import { BookOpen, Settings2, Save } from "lucide-react";
import AdminLayout from "../Layout";
import { useState } from "react";

export default function PathIndex({ pathData, levels }) {
    const [editingLevel, setEditingLevel] = useState(null);

    return (
        <AdminLayout current="/admin/path">
            <Head title="Quản lý lộ trình học tập" />

            <div className="space-y-6">
                <div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Quản lý lộ trình
                        </h1>
                        <p className="text-sm text-gray-500">
                            Quản lý số bộ đề và ngưỡng điểm đạt theo từng trình
                            độ.
                        </p>
                    </div>
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
    const {
        data: formData,
        setData,
        post,
        processing,
    } = useForm({
        part1: data.config.pass_threshold_part1 || 60,
        part2: data.config.pass_threshold_part2 || 75,
        part3: data.config.pass_threshold_part3 || 90,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.path.updateThreshold", level), {
            onSuccess: () => onCancel(),
        });
    };

    return (
        <div className="card border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="card-body p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                            {level}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Trình độ {level}
                            </h3>
                            <p className="text-xs text-gray-500">
                                Thiết lập lộ trình và bài tập
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={onEdit}
                                className="btn btn-ghost btn-sm text-blue-600 hover:bg-blue-50 gap-2"
                            >
                                <Settings2 className="w-4 h-4" />
                                Thiết lập điểm
                            </button>
                        ) : (
                            <button
                                onClick={onCancel}
                                className="btn btn-ghost btn-sm text-gray-500 hover:bg-gray-100"
                            >
                                Hủy
                            </button>
                        )}
                        <Link
                            href={route("path.parts", level)}
                            className="btn btn-outline btn-sm gap-2"
                        >
                            Xem phía học viên
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((part) => (
                            <div
                                key={part}
                                className={`rounded-2xl border p-5 transition-all ${
                                    isEditing
                                        ? "border-blue-200 bg-blue-50/30"
                                        : "border-gray-100 bg-gray-50/30"
                                }`}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="font-bold text-gray-700">
                                        Phần {part}
                                    </span>
                                    {!isEditing ? (
                                        <span className="badge badge-blue bg-blue-100 text-blue-700 border-none font-bold py-3">
                                            Đạt{" "}
                                            {
                                                data.config[
                                                    `pass_threshold_part${part}`
                                                ]
                                            }
                                            %
                                        </span>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                className="input input-bordered input-xs w-16 font-bold"
                                                value={formData[`part${part}`]}
                                                onChange={(e) =>
                                                    setData(
                                                        `part${part}`,
                                                        e.target.value,
                                                    )
                                                }
                                                min="0"
                                                max="100"
                                            />
                                            <span className="text-xs font-bold text-gray-500">
                                                %
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <BookOpen className="h-4 w-4 text-blue-500" />
                                    <span>
                                        {data[`part${part}`]} bộ đề luyện tập
                                    </span>
                                </div>

                                {!isEditing && (
                                    <Link
                                        href={route("admin.tests", {
                                            level,
                                            part,
                                        })}
                                        className="btn btn-sm btn-primary w-full rounded-xl shadow-sm border-none bg-blue-600 hover:bg-blue-700"
                                    >
                                        Quản lý bộ đề
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {isEditing && (
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none rounded-xl gap-2 shadow-lg shadow-blue-500/20"
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

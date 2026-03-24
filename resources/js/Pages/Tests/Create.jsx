import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Plus, Trash2, Save, FileText, Layout, Info, CheckCircle2, Languages, HelpCircle, Database, CheckSquare, Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../Admin/Layout";

export default function Create() {
    const { data, setData, post, processing, errors, transform } = useForm({
        title: "",
        description: "",
        level: "A1",
        parts: [
            {
                part_number: 1,
                duration: 15,
                enabled: true,
            },
        ],
        is_active: true,
        question_ids: [],
    });

    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    const activeParts = useMemo(() => 
        data.parts
            .map((part, idx) => ({ ...part, originalIndex: idx }))
            .filter((part) => part.enabled),
        [data.parts]
    );

    useEffect(() => {
        const fetchQuestions = async () => {
            if (activeParts.length === 0 || !data.level) return;
            setLoadingQuestions(true);
            try {
                const partNumbers = activeParts.map((p) => p.originalIndex + 1).join(',');
                const response = await fetch(`/admin/api/questions?level=${data.level}&part_number=${partNumbers}`);
                const result = await response.json();
                setAvailableQuestions(result || []);
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setLoadingQuestions(false);
            }
        };

        const timer = setTimeout(() => {
            fetchQuestions();
        }, 500);

        return () => clearTimeout(timer);
    }, [data.level, data.parts]);

    const handleToggleQuestion = (id) => {
        const nextIds = data.question_ids.includes(id)
            ? data.question_ids.filter(qId => qId !== id)
            : [...data.question_ids, id];
        setData("question_ids", nextIds);
    };

    const handleSelectAll = (partNumber) => {
        const questionsInPart = availableQuestions.filter(q => q.part_number === partNumber).map(q => q.id);
        const allSelected = questionsInPart.every(id => data.question_ids.includes(id));

        let nextIds = [...data.question_ids];
        if (allSelected) {
            nextIds = nextIds.filter(id => !questionsInPart.includes(id));
        } else {
            questionsInPart.forEach(id => {
                if (!nextIds.includes(id)) nextIds.push(id);
            });
        }
        setData("question_ids", nextIds);
    };

    const updatePart = (index, field, value) => {
        const nextParts = [...data.parts];
        const numericFields = ["duration"];
        nextParts[index] = {
            ...nextParts[index],
            [field]: numericFields.includes(field) ? Number(value) : value,
        };
        setData("parts", nextParts);
    };

    const addPart = () => {
        setData("parts", [
            ...data.parts,
            {
                part_number: data.parts.length + 1,
                duration: 15,
                enabled: true,
            },
        ]);
    };

    const removePart = (index) => {
        if (data.parts.length <= 1) return;
        setData("parts", data.parts.filter((_, i) => i !== index));
    };

    const togglePart = (index) => {
        const nextParts = [...data.parts];
        nextParts[index] = {
            ...nextParts[index],
            enabled: !nextParts[index].enabled,
        };
        setData("parts", nextParts);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("tests.store"), {
            transform: (data) => ({
                ...data,
                parts: data.parts
                    .filter((part) => part.enabled)
                    .map((part, index) => ({
                        part_number: index + 1,

                        duration: Number(part.duration),
                    })),
                question_ids: data.question_ids,
            })
        });
    };

    return (
        <AdminLayout current="/admin/tests">
            <Head title="Thêm đề thi mới" />

            <div className="max-w-full mx-auto space-y-10 pb-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.tests')}
                            className="p-3 bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 rounded-2xl transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tạo đề thi mới</h1>
                            <p className="text-gray-500 mt-1">Thiết lập cấu hình bài thi và bộ câu hỏi.</p>
                        </div>
                    </div>

                    <button
                        onClick={submit}
                        disabled={processing}
                        className="btn btn-primary bg-blue-600 border-none hover:bg-blue-700 text-white rounded-2xl px-8 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        {processing ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Lưu đề thi
                    </button>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột trái: Thông tin cấu hình */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                                    <Layout className="w-5 h-5 text-blue-500" />
                                    Cấu hình
                                </h2>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiêu đề</label>
                                    <input
                                        type="text"
                                        className={`w-full px-4 py-3 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold ${errors.title ? 'border-red-500' : ''}`}
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        placeholder="Ví dụ: Grammar A1 - Part 1"
                                    />
                                    {errors.title && <p className="text-xs text-red-500 font-bold">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Mô tả</label>
                                    <textarea
                                        className={`w-full px-4 py-3 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Nhập mô tả cho đề thi..."
                                    />
                                    {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Trình độ</label>
                                        <select
                                            className={`w-full px-4 py-3 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold ${errors.level ? 'border-red-500' : ''}`}
                                            value={data.level}
                                            onChange={(e) => setData("level", e.target.value)}
                                        >
                                            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
                                                <option key={lvl} value={lvl}>{lvl}</option>
                                            ))}
                                        </select>
                                        {errors.level && <p className="text-xs text-red-500 font-bold">{errors.level}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cấu hình parts</label>
                                        <button
                                            type="button"
                                            onClick={addPart}
                                            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800"
                                        >
                                            + Thêm part
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {data.parts.map((part, index) => (
                                            <div key={index} className={`p-4 rounded-2xl border ${part.enabled ? 'border-blue-100 bg-blue-50/30' : 'border-gray-100 bg-gray-50/80'}`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-black text-gray-600 uppercase tracking-wider">Part #{index + 1}</span>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            className="toggle toggle-primary toggle-sm"
                                                            checked={part.enabled}
                                                            onChange={() => togglePart(index)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePart(index)}
                                                            className="p-1 text-gray-300 hover:text-red-500"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Thời gian (1-120 phút)</label>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={120}
                                                            value={part.duration}
                                                            onChange={(e) => updatePart(index, 'duration', e.target.value)}
                                                            className={`w-full px-3 py-2 rounded-xl border-1 text-sm font-bold ${errors[`parts.${index}.duration`] || part.duration > 120 ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                                                            placeholder="15"
                                                            disabled={!part.enabled}
                                                        />
                                                        {errors[`parts.${index}.duration`] && <p className="text-[10px] text-red-600 font-bold mt-1">{errors[`parts.${index}.duration`][0]}</p>}
                                                        {!errors[`parts.${index}.duration`] && part.duration > 120 && <p className="text-[10px] text-red-600 font-bold mt-1">Không được vượt quá 120 phút (2 giờ)</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {errors.parts && <p className="text-xs text-red-500 font-bold">{errors.parts}</p>}
                                    {activeParts.length === 0 && (
                                        <p className="text-xs text-amber-600 font-bold">Cần bật ít nhất 1 part để lưu đề thi.</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-700">Trạng thái kích hoạt</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={data.is_active}
                                        onChange={(e) => setData("is_active", e.target.checked)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    <span className="font-bold text-gray-700 block mb-1">Lưu ý về Part:</span>
                                    Bạn có thể thêm/xóa part linh hoạt, mỗi part có số câu và thời gian riêng.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Chọn câu hỏi từ Ngân hàng */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                                    <Database className="w-5 h-5 text-indigo-500" />
                                    Ngân Hàng Câu Hỏi ({data.level})
                                </h2>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl">
                                    Đã chọn {data.question_ids.length} câu
                                </span>
                            </div>

                            <div className="p-8 flex-1">
                                {loadingQuestions ? (
                                    <div className="flex justify-center items-center py-10">
                                        <span className="loading loading-spinner text-indigo-500"></span>
                                    </div>
                                ) : availableQuestions.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500 font-medium">Chưa có câu hỏi nào khả dụng cho cấu hình (Level {data.level}, Parts {activeParts.map(p => p.originalIndex + 1).join(', ')}).</p>
                                        <Link href="/admin/questions/create" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                                            Tạo câu hỏi mới &rarr;
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {activeParts.map((part) => {
                                            const partNumberForFilter = part.originalIndex + 1;
                                            const questionsInPart = availableQuestions.filter(q => q.part_number === partNumberForFilter);
                                            if (questionsInPart.length === 0) {
                                                return (
                                                    <div key={part.originalIndex} className="space-y-4">
                                                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                                            <h3 className="font-bold text-gray-700">Part {partNumberForFilter} <span className="text-gray-400 font-normal ml-2">(0 khả dụng)</span></h3>
                                                        </div>
                                                        <div className="p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
                                                            <p className="text-sm text-gray-400">Không có câu hỏi nào cho Part {partNumberForFilter} trong ngân hàng.</p>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            const selectedCount = questionsInPart.filter(q => data.question_ids.includes(q.id)).length;

                                            return (
                                                <div key={part.originalIndex} className="space-y-4">
                                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                                        <h3 className="font-bold text-gray-700">Part {partNumberForFilter} <span className="text-gray-400 font-normal ml-2">({selectedCount} / {questionsInPart.length} khả dụng)</span></h3>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelectAll(partNumberForFilter)}
                                                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                        >
                                                            <CheckSquare className="w-4 h-4" /> Chọn tất cả part {partNumberForFilter}
                                                        </button>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        {questionsInPart.map(q => (
                                                            <label key={q.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.question_ids.includes(q.id) ? 'border-indigo-500 bg-indigo-50/20 shadow-sm' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="checkbox checkbox-primary mt-1"
                                                                    checked={data.question_ids.includes(q.id)}
                                                                    onChange={() => handleToggleQuestion(q.id)}
                                                                />
                                                                <div className="flex-1 space-y-1">
                                                                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">{q.question_text}</p>
                                                                    <div className="flex gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                                                        <span>ID: {q.id}</span>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

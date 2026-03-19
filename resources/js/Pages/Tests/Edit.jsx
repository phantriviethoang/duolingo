import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Plus, Trash2, Save, FileText, Layout, Info, CheckCircle2, Languages, HelpCircle } from "lucide-react";
import AdminLayout from "../Admin/Layout";

export default function Edit({ test }) {
    const { data, setData, put, processing, errors } = useForm({
        title: test.title || "",
        description: test.description || "",
        duration: test.duration || 15,
        level: test.level || "A1",
        part: test.part || 1,
        questions: test.questions || [
            {
                question: "",
                options: [
                    { text: "", is_correct: true },
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                ],
                explanation: "",
                translation: "",
                detailed_explanation: "",
            },
        ],
        is_active: test.is_active ?? true,
    });

    const addQuestion = () => {
        setData("questions", [
            ...data.questions,
            {
                question: "",
                options: [
                    { text: "", is_correct: true },
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                ],
                explanation: "",
                translation: "",
                detailed_explanation: "",
            },
        ]);
    };

    const removeQuestion = (index) => {
        if (data.questions.length > 1) {
            const newQuestions = data.questions.filter((_, i) => i !== index);
            setData("questions", newQuestions);
        }
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...data.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setData("questions", newQuestions);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIndex].options[optionIndex].text = value;
        setData("questions", newQuestions);
    };

    const setCorrectAnswer = (questionIndex, optionIndex) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIndex].options.forEach((opt, idx) => {
            opt.is_correct = idx === optionIndex;
        });
        setData("questions", newQuestions);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("tests.update", test.id));
    };

    return (
        <AdminLayout current="/admin/tests">
            <Head title={`Chỉnh sửa: ${test.title}`} />

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
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Chỉnh sửa đề thi</h1>
                            <p className="text-gray-500 mt-1">ID: #{test.id} • Cập nhật nội dung và cấu hình.</p>
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
                        Cập nhật bài thi
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
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phần (Part)</label>
                                        <select
                                            className={`w-full px-4 py-3 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold ${errors.part ? 'border-red-500' : ''}`}
                                            value={data.part}
                                            onChange={(e) => setData("part", e.target.value)}
                                        >
                                            {[1, 2, 3].map(p => (
                                                <option key={p} value={p}>Phần {p}</option>
                                            ))}
                                        </select>
                                        {errors.part && <p className="text-xs text-red-500 font-bold">{errors.part}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Thời gian (phút)</label>
                                    <input
                                        type="number"
                                        className={`w-full px-4 py-3 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold ${errors.duration ? 'border-red-500' : ''}`}
                                        value={data.duration}
                                        onChange={(e) => setData("duration", e.target.value)}
                                    />
                                    {errors.duration && <p className="text-xs text-red-500 font-bold">{errors.duration}</p>}
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
                    </div>

                    {/* Cột phải: Danh sách câu hỏi */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black">
                                    {data.questions.length}
                                </span>
                                Danh sách câu hỏi
                            </h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm câu
                            </button>
                        </div>

                        {errors.questions && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
                                {errors.questions}
                            </div>
                        )}

                        <div className="space-y-8">
                            {data.questions.map((question, qIndex) => (
                                <div key={qIndex} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
                                    <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Câu hỏi #{qIndex + 1}</span>
                                        {data.questions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(qIndex)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <FileText className="w-3 h-3" /> Nội dung câu hỏi
                                                </label>
                                                <textarea
                                                    className={`w-full px-4 py-3 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium min-h-[100px] ${errors[`questions.${qIndex}.question`] ? 'border-red-500' : ''}`}
                                                    value={question.question}
                                                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                                                />
                                                {errors[`questions.${qIndex}.question`] && <p className="text-[10px] text-red-500 font-bold">{errors[`questions.${qIndex}.question`]}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {question.options.map((option, oIndex) => (
                                                    <div key={oIndex} className="space-y-1">
                                                        <div className={`relative p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${option.is_correct ? 'border-green-100 bg-green-50/30 ring-2 ring-green-500/20' : errors[`questions.${qIndex}.options.${oIndex}.text`] ? 'border-red-100 bg-red-50/30' : 'border-gray-50 bg-gray-50/30'}`}>
                                                            <input
                                                                type="radio"
                                                                name={`correct-${qIndex}`}
                                                                checked={option.is_correct}
                                                                onChange={() => setCorrectAnswer(qIndex, oIndex)}
                                                                className="radio radio-success radio-sm"
                                                            />
                                                            <input
                                                                type="text"
                                                                className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-gray-700"
                                                                value={option.text}
                                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                placeholder={`Đáp án ${String.fromCharCode(65 + oIndex)}`}
                                                            />
                                                            {option.is_correct && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                        </div>
                                                        {errors[`questions.${qIndex}.options.${oIndex}.text`] && (
                                                            <p className="text-[9px] text-red-500 font-bold ml-2">{errors[`questions.${qIndex}.options.${oIndex}.text`]}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {errors[`questions.${qIndex}.options`] && (
                                                <p className="text-[10px] text-red-500 font-bold">
                                                    {errors[`questions.${qIndex}.options`]}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-gray-50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Languages className="w-3 h-3" /> Dịch câu (Vietnamese)
                                                    </label>
                                                    <textarea
                                                        className="w-full px-4 py-2 rounded-xl border-gray-50 bg-gray-50/30 focus:border-blue-500 focus:ring-0 transition-all text-xs font-medium"
                                                        value={question.translation}
                                                        onChange={(e) => updateQuestion(qIndex, "translation", e.target.value)}
                                                        rows="2"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <HelpCircle className="w-3 h-3" /> Giải thích ngắn
                                                    </label>
                                                    <textarea
                                                        className="w-full px-4 py-2 rounded-xl border-gray-50 bg-gray-50/30 focus:border-blue-500 focus:ring-0 transition-all text-xs font-medium"
                                                        value={question.explanation}
                                                        onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                                                        rows="2"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Info className="w-3 h-3" /> Giải thích chi tiết / Ngữ pháp
                                                </label>
                                                <textarea
                                                    className="w-full px-4 py-2 rounded-xl border-gray-50 bg-gray-50/30 focus:border-blue-500 focus:ring-0 transition-all text-xs font-medium"
                                                    value={question.detailed_explanation}
                                                    onChange={(e) => updateQuestion(qIndex, "detailed_explanation", e.target.value)}
                                                    rows="3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addQuestion}
                            className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2"
                        >
                            <Plus className="w-8 h-8" />
                            <span>Thêm câu hỏi tiếp theo</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

import AdminLayout from "./Layout";
import { useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function EditQuestion() {
    const { question, tests = [] } = usePage().props;

    // Ensure options have correct structure
    const normalizedOptions = question.options?.map(opt => ({
        id: String(opt.id),
        text: opt.text || ""
    })) || [
            { id: "A", text: "" },
            { id: "B", text: "" },
            { id: "C", text: "" },
            { id: "D", text: "" },
        ];

    const { data, setData, put, processing, errors } = useForm({
        test_id: question.test_id,
        question: question.question,
        options: normalizedOptions,
        correct_option_id: String(question.correct_option_id || "A"),
        explanation: question.explanation || "",
    });

    console.log('question data:', question);
    console.log('form data:', data);
    console.log('correct_option_id type:', typeof data.correct_option_id, 'value:', data.correct_option_id);
    console.log('options:', data.options);

    const handleOptionChange = (index, value) => {
        const newOptions = [...data.options];
        newOptions[index].text = value;
        setData("options", newOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("questions.update", question.id));
    };

    return (
        <AdminLayout current="/admin/questions">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <a
                    href={route("admin.questions")}
                    className="btn btn-ghost btn-sm gap-2 mb-6"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </a>

                <h1 className="text-3xl font-bold mb-6">Sửa câu hỏi</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Thông tin câu hỏi</h2>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Đề thi <span className="text-error">*</span>
                                    </span>
                                </label>
                                <select
                                    value={data.test_id}
                                    onChange={(e) => setData("test_id", e.target.value)}
                                    className={`select select-bordered w-full ${errors.test_id ? "select-error" : ""}`}
                                >
                                    <option value="">-- Chọn đề thi --</option>
                                    {tests.map((test) => (
                                        <option key={test.id} value={test.id}>
                                            {test.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.test_id && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.test_id}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Câu hỏi <span className="text-error">*</span>
                                    </span>
                                </label>
                                <textarea
                                    value={data.question}
                                    onChange={(e) => setData("question", e.target.value)}
                                    className={`textarea textarea-bordered w-full text-base-content bg-base-100 ${errors.question ? "textarea-error" : ""}`}
                                    rows={4}
                                    placeholder="Nhập nội dung câu hỏi"
                                />
                                {errors.question && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.question}</span>
                                    </label>
                                )}
                            </div>

                            <div className="space-y-2 mb-4">
                                <label className="label">
                                    <span className="label-text">
                                        Các lựa chọn <span className="text-error">*</span>
                                    </span>
                                </label>
                                {data.options.map((option, index) => (
                                    <div key={option.id} className="flex gap-2 items-center">
                                        <label htmlFor={`option-${option.id}`}>
                                            <input
                                                id={`option-${option.id}`}
                                                type="radio"
                                                name="correct"
                                                value={option.id}
                                                checked={data.correct_option_id === option.id}
                                                onChange={(e) => setData("correct_option_id", e.target.value)}
                                                className="radio radio-primary"
                                            />
                                        </label>
                                        <textarea
                                            value={option.text}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            className="textarea-bordered w-full text-base-content bg-base-100 flex-1"
                                            rows={1}
                                            placeholder={`Nhập lựa chọn ${option.id}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Giải thích (tùy chọn)</span>
                                </label>
                                <textarea
                                    value={data.explanation}
                                    onChange={(e) => setData("explanation", e.target.value)}
                                    className="textarea textarea-bordered w-full text-base-content bg-base-100"
                                    rows={3}
                                    placeholder="Giải thích câu trả lời"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <a href={route("admin.questions")} className="btn btn-ghost">
                            Hủy
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn btn-primary"
                        >
                            {processing ? "Đang lưu..." : "Cập nhật câu hỏi"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

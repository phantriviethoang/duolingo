import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function Edit({ test }) {
    const { data, setData, put, processing, errors } = useForm({
        title: test.title || "",
        description: test.description || "",
        duration: test.duration || 40,
        questions: test.questions || [],
        is_active: test.is_active !== undefined ? test.is_active : true,
    });

    const addQuestion = () => {
        setData("questions", [
            ...data.questions,
            {
                id: data.questions.length + 1,
                question: "",
                options: [
                    { id: 0, text: "", is_correct: false },
                    { id: 1, text: "", is_correct: false },
                    { id: 2, text: "", is_correct: false },
                    { id: 3, text: "", is_correct: false },
                ],
                explanation: "",
            },
        ]);
    };

    const removeQuestion = (index) => {
        if (data.questions.length > 1) {
            const newQuestions = data.questions.filter((_, i) => i !== index);
            setData(
                "questions",
                newQuestions.map((q, i) => ({ ...q, id: i + 1 }))
            );
        }
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...data.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setData("questions", newQuestions);
    };

    const updateOption = (questionIndex, optionIndex, field, value) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIndex].options[optionIndex] = {
            ...newQuestions[questionIndex].options[optionIndex],
            [field]: value,
        };
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
        put(`/admin/tests/${test.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Sửa đề thi" />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link
                    href="/tests"
                    className="btn btn-ghost btn-sm gap-2 mb-6"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </Link>

                <h1 className="text-3xl font-bold mb-6">Sửa đề thi</h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title mb-4">
                                Thông tin đề thi
                            </h2>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Tiêu đề <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input input-bordered w-full ${errors.title ? "input-error" : ""
                                        }`}
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                {errors.title && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.title}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Mô tả (lý thuyết)</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full text-base-content bg-base-100"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows="4"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Thời gian làm bài (phút){" "}
                                        <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    className={`text-black input input-bordered w-full ${errors.duration ? "input-error" : ""
                                        }`}
                                    value={data.duration}
                                    onChange={(e) =>
                                        setData(
                                            "duration",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    min="1"
                                />
                                {errors.duration && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.duration}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData("is_active", e.target.checked)
                                        }
                                    />
                                    <span className="label-text">Kích hoạt đề thi</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title">Câu hỏi</h2>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="btn btn-sm btn-primary gap-2"
                                >
                                    <Plus size={16} />
                                    Thêm câu hỏi
                                </button>
                            </div>

                            {errors.questions && (
                                <div className="alert alert-error mb-4">
                                    <span>{errors.questions}</span>
                                </div>
                            )}

                            <div className="space-y-6">
                                {data.questions.map((question, qIndex) => (
                                    <div
                                        key={qIndex}
                                        className="border border-base-300 rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-semibold">
                                                Câu {qIndex + 1}
                                            </h3>
                                            {data.questions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeQuestion(qIndex)
                                                    }
                                                    className="btn btn-ghost btn-sm text-error"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="form-control mb-4">
                                            <label className="label">
                                                <span className="label-text">
                                                    Câu hỏi{" "}
                                                    <span className="text-error">
                                                        *
                                                    </span>
                                                </span>
                                            </label>
                                            <textarea
                                                className="textarea textarea-bordered w-full text-base-content bg-base-100"
                                                value={question.question}
                                                onChange={(e) =>
                                                    updateQuestion(
                                                        qIndex,
                                                        "question",
                                                        e.target.value
                                                    )
                                                }
                                                rows="2"
                                            />
                                            {errors[`questions.${qIndex}.question`] && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors[`questions.${qIndex}.question`]}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <label className="label">
                                                <span className="label-text">
                                                    Đáp án{" "}
                                                    <span className="text-error">
                                                        *
                                                    </span>
                                                </span>
                                            </label>
                                            {question.options.map(
                                                (option, oIndex) => (
                                                    <div
                                                        key={option.id}
                                                        className="flex gap-2 items-center"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`correct-${qIndex}`}
                                                            checked={
                                                                option.is_correct
                                                            }
                                                            onChange={() =>
                                                                setCorrectAnswer(
                                                                    qIndex,
                                                                    oIndex
                                                                )
                                                            }
                                                            className="radio radio-primary"
                                                        />
                                                        <input
                                                            type="text"
                                                            className={`input input-bordered w-full text-base-content bg-base-100 flex-1 ${option.is_correct
                                                                ? "input-primary"
                                                                : ""
                                                                }`}
                                                            value={option.text}
                                                            onChange={(e) =>
                                                                updateOption(
                                                                    qIndex,
                                                                    oIndex,
                                                                    "text",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder={`Đáp án ${String.fromCharCode(65 + oIndex)}`}
                                                        />
                                                        {errors[`questions.${qIndex}.options.${oIndex}.text`] && (
                                                            <span className="text-error text-xs">
                                                                {errors[`questions.${qIndex}.options.${oIndex}.text`]}
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            )}                                            {errors[`questions.${qIndex}.options`] && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors[`questions.${qIndex}.options`]}
                                                    </span>
                                                </label>
                                            )}                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Giải thích (tùy chọn)
                                                </span>
                                            </label>
                                            <textarea
                                                className="textarea textarea-bordered w-full text-base-content bg-base-100"
                                                value={
                                                    question.explanation || ""
                                                }
                                                onChange={(e) =>
                                                    updateQuestion(
                                                        qIndex,
                                                        "explanation",
                                                        e.target.value
                                                    )
                                                }
                                                rows="2"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/tests" className="btn btn-ghost">
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={processing}
                        >
                            {processing ? "Đang cập nhật..." : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

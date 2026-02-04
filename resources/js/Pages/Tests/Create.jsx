import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        email: "",
        description: "",
        duration: 40,
        audio_path: "",
        image_path: "",
        questions: [
            {
                id: 1,
                question: "",
                options: [
                    { id: 0, text: "", is_correct: false },
                    { id: 1, text: "", is_correct: false },
                    { id: 2, text: "", is_correct: false },
                    { id: 3, text: "", is_correct: false },
                ],
                explanation: "",
            },
        ],
        is_active: true,
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
        post("/tests");
    };

    return (
        <>
            <Head title="Tạo đề thi mới" />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link
                    href="/tests"
                    className="btn btn-ghost btn-sm gap-2 mb-6"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </Link>

                <h1 className="text-3xl font-bold mb-6">Tạo đề thi mới</h1>

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
                                    className={`input input-bordered ${errors.title ? "input-error" : ""
                                        }`}
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="VD: Grammar Practice 1"
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
                                    <span className="label-text">
                                        Email <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    className={`input input-bordered ${errors.email ? "input-error" : ""
                                        }`}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="email@domain.com"
                                />
                                {errors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.email}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Mô tả</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Mô tả về đề thi..."
                                    rows="3"
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
                                    className={`input input-bordered ${errors.duration ? "input-error" : ""
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Audio path</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`input input-bordered ${errors.audio_path ? "input-error" : ""}`}
                                        value={data.audio_path}
                                        onChange={(e) =>
                                            setData("audio_path", e.target.value)
                                        }
                                        placeholder="/audio/test-01.mp3"
                                    />
                                    {errors.audio_path && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                {errors.audio_path}
                                            </span>
                                        </label>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Image path</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`input input-bordered ${errors.image_path ? "input-error" : ""}`}
                                        value={data.image_path}
                                        onChange={(e) =>
                                            setData("image_path", e.target.value)
                                        }
                                        placeholder="/images/test-01.jpg"
                                    />
                                    {errors.image_path && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                {errors.image_path}
                                            </span>
                                        </label>
                                    )}
                                </div>
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
                                                className={`textarea textarea-bordered ${errors[
                                                    `questions.${qIndex}.question`
                                                ]
                                                    ? "textarea-error"
                                                    : ""
                                                    }`}
                                                value={question.question}
                                                onChange={(e) =>
                                                    updateQuestion(
                                                        qIndex,
                                                        "question",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nhập câu hỏi..."
                                                rows="2"
                                            />
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
                                                        key={oIndex}
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
                                                            className={`input input-bordered flex-1 ${option.is_correct
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
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Giải thích (tùy chọn)
                                                </span>
                                            </label>
                                            <textarea
                                                className="textarea textarea-bordered"
                                                value={question.explanation || ""}
                                                onChange={(e) =>
                                                    updateQuestion(
                                                        qIndex,
                                                        "explanation",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Giải thích đáp án..."
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
                            {processing ? "Đang tạo..." : "Tạo đề thi"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

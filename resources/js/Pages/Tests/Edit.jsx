import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function Edit({ test }) {
    const { data, setData, put, processing, errors } = useForm({
        title: test.title ?? "",
        description: test.description ?? "",
        duration: test.duration ?? 40,
        questions: test.questions ?? [],
        is_active: test.is_active ?? true,
    });

    const update = (path, value) => {
        setData(path, value);
    };

    const addQuestion = () => {
        const newQuestion = {
            question: "",
            options: Array.from({ length: 4 }, (_, optionIndex) => ({
                id: optionIndex,
                text: "",
                is_correct: false,
            })),
            explanation: "",
        };

        setData("questions", [...data.questions, newQuestion]);
    };

    const removeQuestion = (questionIndex) => {
        const newQuestions = data.questions.filter(
            (_, currentIndex) => currentIndex !== questionIndex,
        );

        setData("questions", newQuestions);
    };

    const updateQuestion = (questionIndex, field, value) => {
        const newQuestions = [...data.questions];

        newQuestions[questionIndex] = {
            ...newQuestions[questionIndex],
            [field]: value,
        };

        setData("questions", newQuestions);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const newQuestions = [...data.questions];

        newQuestions[questionIndex].options[optionIndex] = {
            ...newQuestions[questionIndex].options[optionIndex],
            text: value,
        };

        setData("questions", newQuestions);
    };

    const setCorrectAnswer = (questionIndex, optionIndex) => {
        const newQuestions = [...data.questions];

        newQuestions[questionIndex].options = newQuestions[
            questionIndex
        ].options.map((option, currentOptionIndex) => ({
            ...option,
            is_correct: currentOptionIndex === optionIndex,
        }));

        setData("questions", newQuestions);
    };

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/tests/${test.id}`);
    };

    return (
        <>
            <Head title="Sửa đề thi" />

            <div className="container mx-auto max-w-4xl p-6 text-black">
                <Link
                    href="/tests"
                    className="btn btn-ghost btn-sm text-lg mb-4"
                >
                    <ArrowLeft size={20} /> Quay lại
                </Link>

                <h1 className="text-2xl font-bold mb-4">Sửa đề thi</h1>

                <form
                    onSubmit={submit}
                    className="space-y-6 text-black flex flex-col"
                >
                    {/* INFO */}
                    <div className="card p-4 shadow text-black w-full">
                        <input
                            className="input input-bordered mb-2 text-black w-full"
                            placeholder="Tiêu đề"
                            value={data.title}
                            onChange={(e) => update("title", e.target.value)}
                        />
                        <textarea
                            className="textarea textarea-bordered mb-2 text-black w-full"
                            placeholder="Mô tả"
                            value={data.description}
                            onChange={(e) =>
                                update("description", e.target.value)
                            }
                        />
                        <input
                            type="number"
                            className="input input-bordered text-black w-full"
                            value={data.duration}
                            onChange={(e) =>
                                update("duration", +e.target.value || 0)
                            }
                        />
                    </div>

                    {/* QUESTIONS */}
                    <div className="card p-4 shadow text-black">
                        <div className="flex justify-between mb-4">
                            <h2 className="font-bold">Câu hỏi</h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="btn btn-sm btn-primary"
                            >
                                <Plus size={16} /> Thêm
                            </button>
                        </div>

                        {data.questions.map((q, qIndex) => (
                            <div
                                key={qIndex}
                                className="border p-4 mb-4 rounded"
                            >
                                <div className="flex justify-between mb-2">
                                    <b>Câu {qIndex + 1}</b>
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className="text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <textarea
                                    className="textarea textarea-bordered w-full mb-2 text-black"
                                    value={q.question}
                                    onChange={(e) =>
                                        updateQuestion(
                                            qIndex,
                                            "question",
                                            e.target.value,
                                        )
                                    }
                                />

                                {q.options.map((opt, oIndex) => (
                                    <div
                                        key={oIndex}
                                        className="flex gap-2 mb-1"
                                    >
                                        <input
                                            type="radio"
                                            className="text-black"
                                            checked={opt.is_correct}
                                            onChange={() =>
                                                setCorrectAnswer(qIndex, oIndex)
                                            }
                                        />
                                        <input
                                            className="input input-bordered w-full text-black"
                                            value={opt.text}
                                            onChange={(e) =>
                                                updateOption(
                                                    qIndex,
                                                    oIndex,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                ))}

                                <textarea
                                    className="textarea textarea-bordered w-full mt-2 text-black"
                                    placeholder="Giải thích"
                                    value={q.explanation || ""}
                                    onChange={(e) =>
                                        updateQuestion(
                                            qIndex,
                                            "explanation",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    <div className="w-1/2 mx-auto flex items-center justify-center">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={processing}
                        >
                            {processing ? "Đang lưu..." : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    CheckCircle,
    Lock,
    Play,
    FileQuestion,
    Clock,
    ArrowLeft,
    Save,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function PathShow({ level, parts, selectedPart = null, targetPartCount = null, auth }) {
    const partEntries = useMemo(
        () =>
            Object.entries(parts || {}).sort(
                ([a], [b]) => Number(a) - Number(b),
            ),
        [parts],
    );

    const resolvePartDefaults = (part) => {
        const availableQuestions =
            part?.tests?.reduce(
                (max, test) => Math.max(max, Number(test?.total_questions) || 0),
                0,
            ) || 20;

        const defaultDuration =
            Number(part?.tests?.[0]?.duration) ||
            Number(part?.duration) ||
            20;

        return {
            availableQuestions,
            question_limit: Math.max(1, availableQuestions),
            duration: Math.max(1, defaultDuration),
            pass_threshold: Math.max(1, Math.min(100, Number(part?.pass_score) || 60)),
        };
    };

    const [partConfigs, setPartConfigs] = useState(() =>
        partEntries.reduce((acc, [partKey, part]) => {
            acc[partKey] = resolvePartDefaults(part);
            return acc;
        }, {}),
    );

    const [selectedPartCount, setSelectedPartCount] = useState(targetPartCount || "");
    const { data, setData, put, processing } = useForm({
        count: targetPartCount || "",
        level: level,
    });

    // Cập nhật selectedPartCount và form data khi targetPartCount từ server thay đổi (ví dụ sau khi lưu)
    useEffect(() => {
        if (targetPartCount) {
            setSelectedPartCount(targetPartCount);
            setData('count', targetPartCount);
        }
    }, [targetPartCount]);

    const handleSavePartCount = () => {
        put(route('path.savePartCount'), {
            preserveScroll: true,
            onSuccess: () => {
                // Đã lưu thành công
            }
        });
    };

    useEffect(() => {
        setPartConfigs((prevConfigs) =>
            partEntries.reduce((acc, [partKey, part]) => {
                const defaults = resolvePartDefaults(part);
                const prev = prevConfigs[partKey];
                acc[partKey] = prev
                    ? {
                        ...defaults,
                        question_limit: Math.min(
                            defaults.availableQuestions,
                            Math.max(1, Number(prev.question_limit) || defaults.question_limit),
                        ),
                        duration: Math.max(1, Number(prev.duration) || defaults.duration),
                    }
                    : defaults;
                return acc;
            }, {}),
        );
    }, [partEntries]);

    const dynamicPartEntries = useMemo(() => {
        const fallbackTestId = partEntries
            .map(([, part]) => part?.first_test_id)
            .find((id) => Boolean(id));

        if (selectedPart) {
            return partEntries.filter(
                ([partKey]) => Number(partKey) === Number(selectedPart),
            );
        }

        const byNumber = new Map(
            partEntries.map(([partKey, part]) => [Number(partKey), part]),
        );

        const count = selectedPartCount === "" ? 0 : Math.max(1, Math.min(50, Number(selectedPartCount) || 0));
        let previousCompleted = true;

        return Array.from({ length: count }, (_, index) => {
            const partNumber = index + 1;
            const existing = byNumber.get(partNumber);
            const isCompleted = existing?.progress?.completed || false;

            const isUnlocked = index === 0 ? true : previousCompleted;
            previousCompleted = isCompleted;

            if (existing) {
                return [String(partNumber), { ...existing, unlocked: isUnlocked }];
            }

            return [
                String(partNumber),
                {
                    name: `Part ${partNumber}`,
                    pass_score: 60,
                    tests: [],
                    first_test_id: fallbackTestId || null,
                    unlocked: isUnlocked,
                    progress: { score: 0, completed: false },
                    is_virtual: true,
                },
            ];
        });
    }, [partEntries, selectedPart, selectedPartCount]);

    const updatePartConfig = (partKey, field, value) => {
        setPartConfigs((prev) => {
            const current = prev[partKey] || { question_limit: 1, duration: 20, availableQuestions: 1 };
            const numeric = Number(value);

            if (!Number.isFinite(numeric)) {
                return prev;
            }

            if (field === "question_limit") {
                return {
                    ...prev,
                    [partKey]: {
                        ...current,
                        question_limit: Math.max(
                            1,
                            Math.min(current.availableQuestions || 1, Math.floor(numeric)),
                        ),
                    },
                };
            }

            if (field === "pass_threshold") {
                return {
                    ...prev,
                    [partKey]: {
                        ...current,
                        pass_threshold: Math.max(1, Math.min(100, Math.floor(numeric))),
                    },
                };
            }

            return {
                ...prev,
                [partKey]: {
                    ...current,
                    duration: Math.max(1, Math.min(240, Math.floor(numeric))),
                },
            };
        });
    };
    const visiblePartEntries = dynamicPartEntries;
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const currentLevelIndex = levels.indexOf(level);
    const nextLevel =
        currentLevelIndex >= 0 ? levels[currentLevelIndex + 1] : null;
    const allPartsCompleted =
        partEntries.length > 0 &&
        partEntries.every(([, part]) => Boolean(part?.progress?.completed));
    const canGoNextLevel = Boolean(nextLevel) && allPartsCompleted;

    const nextLevelHref = canGoNextLevel
        ? route("path.parts", nextLevel)
        : null;

    const handleSelectedPartCountChange = (value) => {
        if (value === "") {
            setSelectedPartCount("");
            setData('count', "");
            return;
        }
        const count = Math.floor(Number(value) || 1);
        const normalized = Math.max(1, Math.min(count, 50));

        setSelectedPartCount(normalized);
        setData('count', normalized);
    };

    return (
        <AuthenticatedLayout fullWidth={true}>
            <Head title={`Lộ trình học: ${level}`} />

            <div className="max-w-full mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/path/level">
                        <button className="btn btn-outline btn-sm mb-4 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl px-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại lộ trình
                        </button>
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                        Trình độ {level}
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        {level === "A1"
                            ? "Hoàn thành các phần để chinh phục những bước đầu tiên."
                            : `Vượt qua thử thách tại trình độ ${level} để nâng cao kỹ năng.`}
                    </p>

                    {!selectedPart && (
                        <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-4">
                            <div className="grid grid-cols-1 gap-4 items-center">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                        Chọn số phần muốn thi
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Nhập số phần muốn thi..."
                                            value={selectedPartCount}
                                            onChange={(e) =>
                                                handleSelectedPartCountChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="input input-bordered w-full max-w-44 text-black placeholder-black font-bold"
                                        />
                                        <button
                                            onClick={handleSavePartCount}
                                            disabled={processing}
                                            className={`btn btn-square ${selectedPartCount == targetPartCount ? 'btn-ghost text-emerald-500' : 'btn-primary'}`}
                                            title="Lưu số lượng phần muốn thi"
                                        >
                                            <Save className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-2">
                                        Nhập số phần muốn thi (ví dụ: 1 hoặc 5). Hệ thống sẽ hiển thị đúng từng đó phần và ghi nhớ lựa chọn của bạn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {canGoNextLevel && (
                        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
                                        Hoàn thành {level}
                                    </p>
                                    <p className="text-sm text-emerald-800">
                                        Bạn đã hoàn thành đủ {partEntries.length} phần. Tiếp tục
                                        sang trình độ {nextLevel}.
                                    </p>
                                </div>
                                <Link
                                    href={nextLevelHref}
                                    className="btn btn-sm border-none bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    Sang {nextLevel}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {visiblePartEntries.map(([partKey, part]) => {
                        const isUnlocked = part.unlocked ?? true;
                        const isCompleted = part.progress.completed;
                        const config = partConfigs[partKey] || resolvePartDefaults(part);
                        const canStart = Boolean(part.first_test_id);
                        const startHref = canStart
                            ? route("path.test.take", {
                                level,
                                test: part.first_test_id,
                                part_number: Number(partKey),
                                question_limit: config.question_limit,
                                duration: config.duration,
                                custom_pass_threshold: config.pass_threshold,
                            })
                            : null;

                        return (
                            <div
                                key={partKey}
                                className={`card bg-white rounded-4xl border-2 transition-all duration-300 overflow-hidden group ${isCompleted
                                    ? "border-green-100 shadow-lg shadow-green-500/5"
                                    : isUnlocked
                                        ? "border-blue-100 shadow-xl shadow-blue-500/5 hover:scale-[1.02] hover:border-blue-200"
                                        : "border-gray-100 opacity-75 grayscale bg-gray-50/50 cursor-not-allowed"
                                    }`}
                            >
                                <div className="card-body p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : isUnlocked
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 text-gray-400"
                                                    }`}
                                            >
                                                {partKey}
                                            </div>
                                            <h2 className="text-xl font-black text-gray-900">
                                                Phần {partKey}
                                            </h2>
                                        </div>
                                        {isCompleted ? (
                                            <div className="bg-green-50 text-green-600 p-2 rounded-full border border-green-100">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                        ) : (
                                            !isUnlocked && (
                                                <Lock className="w-5 h-5 text-gray-400" />
                                            )
                                        )}
                                    </div>

                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                <span>Tiến độ của bạn</span>
                                                <span
                                                    className={
                                                        isCompleted
                                                            ? "text-green-600"
                                                            : "text-blue-600"
                                                    }
                                                >
                                                    {part.progress.score}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted
                                                        ? "bg-green-500"
                                                        : "bg-blue-600"
                                                        }`}
                                                    style={{
                                                        width: `${part.progress.score}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-[10px] text-gray-400 font-bold italic uppercase">
                                                    Yêu cầu đạt:{" "}
                                                    {config.pass_threshold}%
                                                </p>
                                                {!isUnlocked && (
                                                    <p className="text-[9px] text-red-400 font-bold uppercase tracking-tighter">
                                                        {Number(partKey) === 1
                                                            ? `Cần hoàn thành cấp độ trước`
                                                            : `Cần hoàn thành Phần ${Number(partKey) - 1}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center text-xs font-bold text-gray-500">
                                                <FileQuestion className="w-4 h-4 mr-2 text-gray-300" />
                                                {part.tests.length} bài tập
                                            </div>
                                            <div className="flex items-center text-xs font-bold text-gray-500">
                                                <Clock className="w-4 h-4 mr-2 text-gray-300" />
                                                {part.tests.reduce(
                                                    (acc, test) =>
                                                        acc + test.duration,
                                                    0,
                                                )}{" "}
                                                phút
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <label className="form-control">
                                                <div className="label py-1">
                                                    <span className="label-text text-[11px] font-black uppercase tracking-wider text-gray-500">
                                                        Số câu muốn làm
                                                    </span>
                                                </div>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={config.availableQuestions}
                                                    value={config.question_limit}
                                                    disabled={!isUnlocked}
                                                    onChange={(e) =>
                                                        updatePartConfig(
                                                            partKey,
                                                            "question_limit",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="input input-bordered w-full bg-white text-black"
                                                />
                                                <div className="label pt-1">
                                                    <span className="label-text-alt text-[10px] text-gray-400">
                                                        Tối đa {config.availableQuestions} câu
                                                    </span>
                                                </div>
                                            </label>

                                            <label className="form-control">
                                                <div className="label py-1">
                                                    <span className="label-text text-[11px] font-black uppercase tracking-wider text-gray-500">
                                                        Thời gian (phút)
                                                    </span>
                                                </div>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={240}
                                                    value={config.duration}
                                                    disabled={!isUnlocked}
                                                    onChange={(e) =>
                                                        updatePartConfig(
                                                            partKey,
                                                            "duration",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="input input-bordered w-full bg-white text-black"
                                                />
                                                <div className="label pt-1">
                                                    <span className="label-text-alt text-[10px] text-gray-400">
                                                        Từ 1 đến 240 phút
                                                    </span>
                                                </div>
                                            </label>

                                            <label className="form-control sm:col-span-2">
                                                <div className="label py-1">
                                                    <span className="label-text text-[11px] font-black uppercase tracking-wider text-gray-500">
                                                        Phần trăm đạt mong muốn
                                                    </span>
                                                </div>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    value={config.pass_threshold}
                                                    disabled={!isUnlocked}
                                                    onChange={(e) =>
                                                        updatePartConfig(
                                                            partKey,
                                                            "pass_threshold",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="input input-bordered w-full bg-white text-black"
                                                />
                                                <div className="label pt-1">
                                                    <span className="label-text-alt text-[10px] text-gray-400">
                                                        Bạn tự đặt ngưỡng đạt từ 1% đến 100% cho phần này.
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        {canStart ? (
                                            <Link href={startHref} className="w-full">
                                                <button
                                                    className={`btn w-full rounded-2xl h-14 font-black transition-all ${isCompleted
                                                        ? "btn-ghost bg-green-50 text-green-700 hover:bg-green-100 border-none"
                                                        : isUnlocked
                                                            ? "btn-primary bg-blue-600 border-none hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                                                            : "btn-ghost bg-gray-400 text-black border-none hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {isUnlocked ? (
                                                        <>
                                                            <Play
                                                                className={`w-5 h-5 mr-2 ${isCompleted ? "fill-green-700" : "fill-white"}`}
                                                            />
                                                            {isCompleted
                                                                ? "Luyện tập lại"
                                                                : "Bắt đầu ngay"}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="w-5 h-5 mr-2" />
                                                            Chưa đủ điều kiện
                                                        </>
                                                    )}
                                                </button>
                                            </Link>
                                        ) : (
                                            <button
                                                className="btn w-full rounded-2xl h-14 font-black btn-ghost bg-gray-100 text-gray-400 border-none"
                                                disabled
                                            >
                                                Chưa có bài cho phần này
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        );
                    })}

                    {!selectedPart && visiblePartEntries.length === 0 && (
                        <div className="col-span-full p-8 border border-dashed border-gray-200 rounded-2xl text-center text-gray-500 font-semibold">
                            Chưa có phần nào đang mở để bạn chọn thi.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

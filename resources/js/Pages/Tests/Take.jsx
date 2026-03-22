import { Head, InfiniteScroll, router, usePage } from "@inertiajs/react";
import { Clock, AlertCircle, Send } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "@/Layouts/Layout";
import AppHeader from "@/Components/AppHeader";

export default function Take({
    test,
    exam,
    testSession = null,
    questionsFeed = null,
    quiz: incomingQuiz,
    questions: incomingQuestions,
    submitRoute: incomingSubmitRoute,
    section = null,
    question: _1,
    retake_wrong: _2,
    previous_result_id: _3,
}) {
    const page = usePage();
    const { url } = page;
    const quiz = incomingQuiz || test || exam;
    const resolvedQuestionsFeed = page?.props?.questionsFeed || questionsFeed;
    const questions = Array.isArray(resolvedQuestionsFeed?.data)
        ? resolvedQuestionsFeed.data
        : Array.isArray(incomingQuestions)
            ? incomingQuestions
            : test?.questions || [];
    const totalQuestions = Number(
        quiz?.total_questions ||
        resolvedQuestionsFeed?.total ||
        resolvedQuestionsFeed?.meta?.total ||
        questions.length,
    );
    const selectedQuestionLimit = Number(
        quiz?.selected_question_limit || totalQuestions,
    );
    const selectedPassThreshold = Number(
        quiz?.selected_pass_threshold || 60,
    );
    const isRetakeWrong = Boolean(_2);

    const levelFromUrl = url.match(/\/path\/([A-Z]\d+)\//)?.[1] || quiz?.level;
    const submitRoute =
        incomingSubmitRoute ||
        (levelFromUrl
            ? `/path/${levelFromUrl}/test-${quiz?.id}/submit`
            : "/path/level");
    const syncRoute = levelFromUrl
        ? `/path/${levelFromUrl}/test-${quiz?.id}/session/sync`
        : null;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [flaggedQuestions, setFlaggedQuestions] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const intervalRef = useRef(null);
    const submitLockRef = useRef(false);
    const autoSubmittedRef = useRef(false);
    const syncInFlightRef = useRef(false);
    const answersRef = useRef({});
    const flaggedRef = useRef({});
    const currentQuestionRef = useRef(0);
    const timeLeftRef = useRef(0);
    const isHydratedRef = useRef(false);
    const isSubmittingRef = useRef(false);
    const hasProgressRef = useRef(false);
    const leavePromptOpenRef = useRef(false);
    const hasConfirmedLeaveRef = useRef(false);
    const lastPromptAtRef = useRef(0);
    const lastPromptDecisionRef = useRef(false);
    const ignoreNextPopRef = useRef(false);
    const LEAVE_WARNING_MESSAGE =
        "Bạn có chắc muốn rời trang? Tiến trình làm bài có thể chưa được lưu.";

    const sectionSuffix = section ? `_sec_${section.order}` : "";
    const retakeSuffix = isRetakeWrong ? "_retake_wrong" : "";
    const storageKey = `test_${quiz?.id}${sectionSuffix}${retakeSuffix}_session`;
    const parsedDuration = Number(quiz?.duration);
    const quizDurationMinutes =
        Number.isFinite(parsedDuration) && parsedDuration > 0
            ? parsedDuration
            : 40;
    const quizDurationSeconds = Math.floor(quizDurationMinutes * 60);

    const [timeLeft, setTimeLeft] = useState(quizDurationSeconds);

    useEffect(() => {
        answersRef.current = selectedAnswers;
    }, [selectedAnswers]);

    useEffect(() => {
        flaggedRef.current = flaggedQuestions;
    }, [flaggedQuestions]);

    useEffect(() => {
        currentQuestionRef.current = currentQuestion;
    }, [currentQuestion]);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {
        isHydratedRef.current = isHydrated;
    }, [isHydrated]);

    useEffect(() => {
        isSubmittingRef.current = isSubmitting;
    }, [isSubmitting]);

    useEffect(() => {
        hasProgressRef.current =
            Object.keys(selectedAnswers).length > 0 ||
            currentQuestion > 0 ||
            timeLeft < quizDurationSeconds;
    }, [selectedAnswers, currentQuestion, timeLeft, quizDurationSeconds]);

    const toObject = (value) => {
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            return {};
        }
        return value;
    };

    const getCsrfToken = () => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        if (token) return token;

        const xsrfCookie = document.cookie
            .split(";")
            .map((item) => item.trim())
            .find((item) => item.startsWith("XSRF-TOKEN="));

        if (!xsrfCookie) return "";

        return decodeURIComponent(xsrfCookie.split("=").slice(1).join("="));
    };

    const getXsrfTokenFromCookie = () => {
        const xsrfCookie = document.cookie
            .split(";")
            .map((item) => item.trim())
            .find((item) => item.startsWith("XSRF-TOKEN="));

        if (!xsrfCookie) return "";
        return decodeURIComponent(xsrfCookie.split("=").slice(1).join("="));
    };

    const computeRemainingTime = (savedTimeLeft, savedAtMs) => {
        const safeSavedTime = Math.max(0, Number(savedTimeLeft || 0));
        const safeSavedAt = Number(savedAtMs || 0);

        if (!Number.isFinite(safeSavedAt) || safeSavedAt <= 0) {
            return Math.min(quizDurationSeconds, safeSavedTime);
        }

        const elapsedSeconds = Math.max(
            0,
            Math.floor((Date.now() - safeSavedAt) / 1000),
        );

        return Math.max(
            0,
            Math.min(quizDurationSeconds, safeSavedTime - elapsedSeconds),
        );
    };

    const buildSnapshot = (payload = {}) => {
        return {
            answers: toObject(payload.answers),
            flagged: toObject(payload.flagged),
            current_question: Math.max(
                0,
                Number(payload.current_question || 0),
            ),
            time_left: Math.max(0, Number(payload.time_left || 0)),
            saved_at: Number(payload.saved_at || Date.now()),
        };
    };

    const saveSnapshotToLocal = (snapshot) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(snapshot));
        } catch (error) {
            console.error("Error saving session snapshot:", error);
        }
    };

    useEffect(() => {
        if (!quiz?.id) return;

        try {
            const saved = localStorage.getItem(storageKey);
            const localSnapshot = saved
                ? buildSnapshot(JSON.parse(saved))
                : null;
            const remoteSnapshot = testSession
                ? buildSnapshot({
                    answers: testSession.answers,
                    flagged: testSession.flagged,
                    current_question: testSession.current_question,
                    time_left: testSession.time_left,
                    saved_at: testSession.last_synced_at
                        ? Date.parse(testSession.last_synced_at)
                        : 0,
                })
                : null;

            const remoteSavedAt = remoteSnapshot?.saved_at || 0;
            const sourceSnapshot =
                remoteSnapshot && remoteSavedAt > 0
                    ? remoteSnapshot
                    : localSnapshot;

            if (sourceSnapshot) {
                const boundedCurrentQuestion = Math.min(
                    totalQuestions > 0 ? totalQuestions - 1 : 0,
                    sourceSnapshot.current_question,
                );

                setSelectedAnswers(toObject(sourceSnapshot.answers));
                setFlaggedQuestions(toObject(sourceSnapshot.flagged));
                setCurrentQuestion(Math.max(0, boundedCurrentQuestion));
                setTimeLeft(
                    computeRemainingTime(
                        sourceSnapshot.time_left,
                        sourceSnapshot.saved_at,
                    ),
                );
            } else {
                setSelectedAnswers({});
                setFlaggedQuestions({});
                setCurrentQuestion(0);
                setTimeLeft(quizDurationSeconds);

                saveSnapshotToLocal(
                    buildSnapshot({
                        answers: {},
                        flagged: {},
                        current_question: 0,
                        time_left: quizDurationSeconds,
                        saved_at: Date.now(),
                    }),
                );
            }
        } catch (error) {
            console.error("Error loading session snapshot:", error);
            setSelectedAnswers({});
            setFlaggedQuestions({});
            setCurrentQuestion(0);
            setTimeLeft(quizDurationSeconds);
        }

        setIsHydrated(true);
    }, [
        quiz?.id,
        totalQuestions,
        storageKey,
        quizDurationSeconds,
        testSession,
    ]);

    useEffect(() => {
        if (!quiz?.id || !isHydrated || isSubmitting) return;

        saveSnapshotToLocal(
            buildSnapshot({
                answers: selectedAnswers,
                flagged: flaggedQuestions,
                current_question: currentQuestion,
                time_left: timeLeft,
                saved_at: Date.now(),
            }),
        );
    }, [
        selectedAnswers,
        flaggedQuestions,
        currentQuestion,
        timeLeft,
        quiz?.id,
        isHydrated,
        isSubmitting,
        storageKey,
    ]);

    const syncSessionToServer = useCallback(
        async ({ keepalive = false } = {}) => {
            if (
                !syncRoute ||
                !quiz?.id ||
                !isHydratedRef.current ||
                isSubmittingRef.current
            )
                return;
            if (syncInFlightRef.current && !keepalive) return;

            const payload = {
                _token: getCsrfToken(),
                answers: answersRef.current,
                flagged: flaggedRef.current,
                current_question: currentQuestionRef.current,
                time_left: Math.max(0, Math.floor(timeLeftRef.current)),
            };

            const xsrfToken = getXsrfTokenFromCookie();

            const headers = {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": getCsrfToken(),
                "X-XSRF-TOKEN": xsrfToken,
                Accept: "application/json",
            };

            if (keepalive) {
                // sendBeacon is more reliable during unload and does not require custom headers.
                const formData = new FormData();
                formData.append("_token", payload._token || "");
                formData.append(
                    "answers",
                    JSON.stringify(payload.answers || {}),
                );
                formData.append(
                    "flagged",
                    JSON.stringify(payload.flagged || {}),
                );
                formData.append(
                    "current_question",
                    String(payload.current_question ?? 0),
                );
                formData.append("time_left", String(payload.time_left ?? 0));

                if (navigator.sendBeacon) {
                    navigator.sendBeacon(syncRoute, formData);
                } else {
                    fetch(syncRoute, {
                        method: "POST",
                        credentials: "same-origin",
                        body: formData,
                        keepalive: true,
                    }).catch(() => { });
                }
                return;
            }

            syncInFlightRef.current = true;
            try {
                const response = await fetch(syncRoute, {
                    method: "POST",
                    credentials: "same-origin",
                    headers,
                    body: JSON.stringify(payload),
                });

                if (response.status === 419) {
                    console.warn(
                        "Session sync skipped due to expired CSRF token (419).",
                    );
                }
            } catch (error) {
                console.error("Session sync error:", error);
            } finally {
                syncInFlightRef.current = false;
            }
        },
        [syncRoute, quiz?.id],
    );


    useEffect(() => {
        if (!isHydrated || isSubmitting) return;

        const debounceId = setTimeout(() => {
            syncSessionToServer();
        }, 1200);

        return () => clearTimeout(debounceId);
    }, [
        selectedAnswers,
        flaggedQuestions,
        currentQuestion,
        isHydrated,
        isSubmitting,
        syncSessionToServer,
    ]);

    useEffect(() => {
        if (!isHydrated || isSubmitting) return;

        const syncInterval = setInterval(() => {
            syncSessionToServer();
        }, 10000);

        return () => clearInterval(syncInterval);
    }, [isHydrated, isSubmitting, syncSessionToServer]);

    useEffect(() => {
        if (!isHydrated || isSubmitting) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                syncSessionToServer({ keepalive: true });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
    }, [isHydrated, isSubmitting, syncSessionToServer]);

    useEffect(() => {
        if (!isHydrated) return;

        const hasProgress =
            Object.keys(selectedAnswers).length > 0 ||
            currentQuestion > 0 ||
            timeLeft < quizDurationSeconds;

        const handleBeforeUnload = (e) => {
            if (quiz?.id && !isSubmitting) {
                saveSnapshotToLocal(
                    buildSnapshot({
                        answers: selectedAnswers,
                        flagged: flaggedQuestions,
                        current_question: currentQuestion,
                        time_left: timeLeft,
                        saved_at: Date.now(),
                    }),
                );

                syncSessionToServer({ keepalive: true });
            }

            if (isSubmitting || !hasProgress) return;

            if (hasConfirmedLeaveRef.current) {
                return;
            }

            e.preventDefault();
            e.returnValue = LEAVE_WARNING_MESSAGE;
            return e.returnValue;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [
        quiz?.id,
        selectedAnswers,
        flaggedQuestions,
        currentQuestion,
        timeLeft,
        quizDurationSeconds,
        isHydrated,
        isSubmitting,
        syncSessionToServer,
        LEAVE_WARNING_MESSAGE,
    ]);

    useEffect(() => {
        if (!isHydrated) return;

        // Unified navigation guard for Inertia
        const unregisterInertiaBefore = router.on("before", (event) => {
            if (isSubmittingRef.current || hasConfirmedLeaveRef.current) {
                return;
            }

            const visitUrl = event?.detail?.visit?.url;
            if (!visitUrl) return;

            const currentUrl = new URL(window.location.href);
            const nextUrl = new URL(visitUrl, window.location.origin);

            // Don't warn for same-page transitions (like scroll or partial reloads)
            if (currentUrl.pathname === nextUrl.pathname) {
                return;
            }

            if (!confirm(LEAVE_WARNING_MESSAGE)) {
                event.preventDefault();
            } else {
                hasConfirmedLeaveRef.current = true;
                syncSessionToServer({ keepalive: true });
            }
        });

        // Browser level guard (tab close, reload)
        const handleBeforeUnload = (e) => {
            if (isSubmittingRef.current || hasConfirmedLeaveRef.current) {
                return;
            }

            // Always sync on leave attempt
            syncSessionToServer({ keepalive: true });

            e.preventDefault();
            e.returnValue = LEAVE_WARNING_MESSAGE;
            return LEAVE_WARNING_MESSAGE;
        };

        // Popstate guard (back/forward button)
        const handlePopState = (event) => {
            if (isSubmittingRef.current || hasConfirmedLeaveRef.current) {
                return;
            }

            if (!confirm(LEAVE_WARNING_MESSAGE)) {
                // If user cancels, push the current state back to keep them on the page
                window.history.pushState(null, "", window.location.href);
            } else {
                hasConfirmedLeaveRef.current = true;
                syncSessionToServer({ keepalive: true });
                // Let the browser proceed with the back/forward move
            }
        };

        // Trap the initial state to make popstate work reliably
        window.history.pushState(null, "", window.location.href);

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);

        return () => {
            unregisterInertiaBefore();
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isHydrated, syncSessionToServer, LEAVE_WARNING_MESSAGE]);

    useEffect(() => {
        return () => {
            hasConfirmedLeaveRef.current = false;
        };
    }, []);

    if (!quiz) {
        return (
            <Layout>
                <Head title="Lỗi" />
                <div className="flex items-center justify-center py-20">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border-l-4 border-red-500">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Không tìm thấy đề thi
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Đề thi này không tồn tại hoặc đã bị xóa.
                        </p>
                        <button
                            onClick={() => router.visit("/path/level")}
                            className="btn btn-primary w-full"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (questions.length === 0) {
        return (
            <Layout>
                <Head title="Lỗi" />
                <div className="flex items-center justify-center py-20">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border-l-4 border-yellow-500">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Đề thi chưa sẵn sàng
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Đề thi này chưa có câu hỏi. Vui lòng liên hệ quản
                            trị viên.
                        </p>
                        <button
                            onClick={() => router.visit("/path/level")}
                            className="btn btn-primary w-full"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAnswerSelect = (questionId, answerId, questionIndex) => {
        if (isSubmitting) return;
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
        setCurrentQuestion(questionIndex);
    };

    const scrollToQuestion = (questionIndex) => {
        const target = document.getElementById(
            `question-card-${questionIndex}`,
        );
        if (target) {
            const header = document.querySelector("header");
            const headerHeight = header?.offsetHeight ?? 80;
            const top =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                16;

            window.scrollTo({
                top: Math.max(0, top),
                behavior: "smooth",
            });
        }
    };

    const handleSubmit = () => {
        if (isSubmitting || submitLockRef.current) return;

        // Submission is an intentional navigation: suppress leave prompts.
        hasConfirmedLeaveRef.current = true;
        isSubmittingRef.current = true;
        lastPromptAtRef.current = Date.now();
        lastPromptDecisionRef.current = true;

        submitLockRef.current = true;
        setShowSubmitConfirm(false);
        setIsSubmitting(true);
        syncSessionToServer();

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const payload = section
            ? {
                section_order: section.order,
                answers: selectedAnswers,
                time_spent: quizDurationSeconds - timeLeft,
                part_number: Number(quiz?.part) || 1,
                question_ids: questions.map((q) => q.id),
                custom_question_limit: selectedQuestionLimit,
                custom_pass_threshold: selectedPassThreshold,
            }
            : {
                answers: selectedAnswers,
                time_spent: quizDurationSeconds - timeLeft,
                part_number: Number(quiz?.part) || 1,
                question_ids: questions.map((q) => q.id),
                custom_question_limit: selectedQuestionLimit,
                custom_pass_threshold: selectedPassThreshold,
            };

        const visit = router.post(submitRoute, payload, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                try {
                    localStorage.removeItem(storageKey);
                } catch (error) {
                    console.error("Error clearing saved data:", error);
                }
            },
            onError: (errors) => {
                console.error("Submit error:", errors);
                setIsSubmitting(false);
                submitLockRef.current = false;
                alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
            },
            onFinish: () => {
                setIsSubmitting(false);
                submitLockRef.current = false;
            },
        });

        if (visit && typeof visit.catch === "function") {
            visit.catch((error) => {
                if (
                    error?.code === "ERR_CANCELED" ||
                    error?.message === "Request aborted"
                ) {
                    return;
                }
                console.error("Unexpected submit request error:", error);
            });
        }
    };

    const autoSubmit = () => {
        if (isSubmitting || submitLockRef.current) return;

        // Auto submit on timeout should never trigger extra leave warnings.
        hasConfirmedLeaveRef.current = true;
        isSubmittingRef.current = true;
        lastPromptAtRef.current = Date.now();
        lastPromptDecisionRef.current = true;

        submitLockRef.current = true;
        setIsSubmitting(true);
        syncSessionToServer();

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const payload = section
            ? {
                section_order: section.order,
                answers: selectedAnswers,
                time_spent: quizDurationSeconds - timeLeft,
                part_number: Number(quiz?.part) || 1,
                question_ids: questions.map((q) => q.id),
                custom_question_limit: selectedQuestionLimit,
                custom_pass_threshold: selectedPassThreshold,
            }
            : {
                answers: selectedAnswers,
                time_spent: quizDurationSeconds - timeLeft,
                part_number: Number(quiz?.part) || 1,
                question_ids: questions.map((q) => q.id),
                custom_question_limit: selectedQuestionLimit,
                custom_pass_threshold: selectedPassThreshold,
            };

        const visit = router.post(submitRoute, payload, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                try {
                    localStorage.removeItem(storageKey);
                } catch (error) {
                    console.error("Error clearing saved data:", error);
                }
            },
            onError: (errors) => {
                console.error("Auto submit error:", errors);
                setIsSubmitting(false);
                submitLockRef.current = false;
                autoSubmittedRef.current = false;
                alert(
                    "Có lỗi xảy ra khi tự động nộp bài. Vui lòng thử nộp lại.",
                );
            },
            onFinish: () => {
                setIsSubmitting(false);
                submitLockRef.current = false;
            },
        });

        if (visit && typeof visit.catch === "function") {
            visit.catch((error) => {
                if (
                    error?.code === "ERR_CANCELED" ||
                    error?.message === "Request aborted"
                ) {
                    return;
                }
                console.error("Unexpected auto submit request error:", error);
            });
        }
    };

    useEffect(() => {
        if (isSubmitting || !isHydrated) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newValue = prev - 1;
                if (newValue <= 0) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    return 0;
                }
                return newValue;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isSubmitting, isHydrated]);

    useEffect(() => {
        if (isSubmitting) return;
        if (timeLeft > 0) return;
        if (autoSubmittedRef.current) return;

        autoSubmittedRef.current = true;
        autoSubmit();
    }, [timeLeft, isSubmitting]);

    const currentQuestionDisplay = Math.min(
        totalQuestions,
        Math.max(1, currentQuestion + 1),
    );
    const progress =
        totalQuestions > 0
            ? (currentQuestionDisplay / totalQuestions) * 100
            : 0;
    const answeredCount = Object.values(selectedAnswers).filter(
        (v) => v !== undefined && v !== null,
    ).length;

    return (
        <>
            <Head title={`Làm đề thi: ${quiz.title}`} />
            <AppHeader />
            <div className="min-h-screen bg-gray-50 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                        <div className="flex-1 min-w-0 w-full">
                            {/* Test Header Info - Now part of the content */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                            {quiz.title}
                                        </h1>
                                        {isRetakeWrong && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-100">
                                                    Đang làm lại các câu sai
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                            {section
                                                ? `Phần ${section.order} • `
                                                : ""}
                                            Tổng số {totalQuestions} câu hỏi
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="text-center px-4">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                                Đã trả lời
                                            </p>
                                            <p className="text-xl font-bold text-blue-600">
                                                {answeredCount}/{totalQuestions}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <InfiniteScroll
                                data="questionsFeed"
                                buffer={200}
                                onlyNext
                                loading={
                                    <div className="text-center py-4 text-sm text-gray-500">
                                        Đang tải thêm câu hỏi...
                                    </div>
                                }
                            >
                                <div className="space-y-4">
                                    {questions.map(
                                        (question, questionIndex) => (
                                            <div
                                                id={`question-card-${questionIndex}`}
                                                key={question.id}
                                                className={`bg-white rounded-lg shadow-md p-6 border-l-4 transition-all ${currentQuestion ===
                                                    questionIndex
                                                    ? "border-blue-500"
                                                    : "border-gray-200"
                                                    }`}
                                            >
                                                <div className="mb-6">
                                                    <p className="text-sm font-semibold text-blue-600 mb-3">
                                                        Câu {questionIndex + 1}/
                                                        {totalQuestions}
                                                    </p>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {question.question}
                                                    </h3>
                                                </div>

                                                <div className="space-y-3">
                                                    {question.options &&
                                                        (Array.isArray(
                                                            question.options,
                                                        )
                                                            ? question.options.map(
                                                                (
                                                                    option,
                                                                    index,
                                                                ) => (
                                                                    <label
                                                                        key={
                                                                            option.id
                                                                        }
                                                                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                                                    >
                                                                        <input
                                                                            type="radio"
                                                                            name={`question-${question.id}`}
                                                                            value={
                                                                                option.id
                                                                            }
                                                                            checked={
                                                                                selectedAnswers[
                                                                                question
                                                                                    .id
                                                                                ] ===
                                                                                option.id
                                                                            }
                                                                            onChange={() =>
                                                                                handleAnswerSelect(
                                                                                    question.id,
                                                                                    option.id,
                                                                                    questionIndex,
                                                                                )
                                                                            }
                                                                            className="w-4 h-4"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <p className="font-medium text-gray-900">
                                                                                {String.fromCharCode(
                                                                                    65 +
                                                                                    index,
                                                                                )}
                                                                                .{" "}
                                                                                {
                                                                                    option.text
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </label>
                                                                ),
                                                            )
                                                            : Object.entries(
                                                                question.options,
                                                            ).map(
                                                                (
                                                                    [
                                                                        key,
                                                                        value,
                                                                    ],
                                                                    index,
                                                                ) => (
                                                                    <label
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                                                    >
                                                                        <input
                                                                            type="radio"
                                                                            name={`question-${question.id}`}
                                                                            value={
                                                                                key
                                                                            }
                                                                            checked={
                                                                                selectedAnswers[
                                                                                question
                                                                                    .id
                                                                                ] ===
                                                                                key
                                                                            }
                                                                            onChange={() =>
                                                                                handleAnswerSelect(
                                                                                    question.id,
                                                                                    key,
                                                                                    questionIndex,
                                                                                )
                                                                            }
                                                                            className="w-4 h-4"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <p className="font-medium text-gray-900">
                                                                                {String.fromCharCode(
                                                                                    65 +
                                                                                    index,
                                                                                )}
                                                                                .{" "}
                                                                                {
                                                                                    value
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </label>
                                                                ),
                                                            ))}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </InfiniteScroll>
                        </div>

                        <div className="lg:col-span-1 lg:sticky lg:top-24">
                            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                                {/* Pass Threshold Badge */}
                                <div className={`p-4 rounded-lg border-2 text-center ${selectedPassThreshold >= 75 ? 'bg-orange-50 border-orange-200' : selectedPassThreshold >= 60 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                        🎯 Yêu cầu để đạt
                                    </p>
                                    <p className={`text-2xl font-black ${selectedPassThreshold >= 75 ? 'text-orange-600' : selectedPassThreshold >= 60 ? 'text-blue-600' : 'text-green-600'}`}>
                                        ≥ {selectedPassThreshold}%
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-2 font-semibold">
                                        Độ chính xác của bạn phải đạt {selectedPassThreshold}% để mở phần tiếp theo
                                    </p>
                                </div>

                                {/* Timer Section moved here */}
                                <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                        Thời gian còn lại
                                    </p>
                                    <div
                                        className={`flex items-center justify-center gap-2 ${timeLeft < 60 ? "text-red-600 animate-pulse" : "text-gray-900"}`}
                                    >
                                        <Clock className="w-5 h-5" />
                                        <span className="text-2xl font-bold tabular-nums">
                                            {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-gray-900">
                                    Danh sách câu hỏi
                                </h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((q, index) => (
                                        <button
                                            key={q.id}
                                            onClick={() => {
                                                setCurrentQuestion(index);
                                                scrollToQuestion(index);
                                            }}
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-all border-2 ${currentQuestion === index
                                                ? "border-blue-600 bg-blue-600 text-white"
                                                : selectedAnswers[q.id]
                                                    ? "border-green-500 bg-green-50 text-green-700"
                                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm space-y-2">
                                    <p className="text-gray-600">
                                        <span className="inline-block w-3 h-3 rounded border-2 border-gray-300 mr-2"></span>
                                        Chưa trả lời
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="inline-block w-3 h-3 rounded bg-green-100 border-2 border-green-500 mr-2"></span>
                                        Đã trả lời
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowSubmitConfirm(true)}
                                    disabled={isSubmitting}
                                    className="w-full btn btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Đang nộp..." : "Nộp bài"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showSubmitConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Xác nhận nộp bài?
                            </h2>
                            <p className="text-gray-600 mb-2">
                                Bạn đã trả lời{" "}
                                <span className="font-bold">
                                    {answeredCount}/{totalQuestions}
                                </span>{" "}
                                câu
                            </p>
                            {answeredCount < totalQuestions && (
                                <p className="text-yellow-600 text-sm mb-4">
                                    ️ Còn {totalQuestions - answeredCount} câu
                                    chưa được trả lời
                                </p>
                            )}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <p className="text-blue-900 text-sm font-semibold mb-2">
                                    🎯 Yêu cầu để đạt: ≥ {selectedPassThreshold}%
                                </p>
                                <p className="text-blue-700 text-xs">
                                    Bạn cần đạt ít nhất {selectedPassThreshold}% độ chính xác để hoàn thành phần này.
                                </p>
                            </div>
                            <p className="text-gray-600 text-sm mb-6">
                                Bạn không thể quay lại để sửa câu trả lời sau
                                khi nộp bài.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitConfirm(false)}
                                    disabled={isSubmitting}
                                    className="btn btn-outline flex-1 disabled:opacity-50"
                                >
                                    Tiếp tục làm bài
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="btn btn-success flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Đang nộp...
                                        </>
                                    ) : (
                                        "Nộp bài"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

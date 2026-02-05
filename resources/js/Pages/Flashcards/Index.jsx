import { Head, Link, router } from "@inertiajs/react";
import { BookOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryCard from "@/Components/Flashcards/CategoryCard";
import FlashcardViewer from "@/Components/Flashcards/FlashcardViewer";

export default function Index({ categories = [], flashcards = [], selectedCategoryId = null }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedCategoryId, flashcards]);

    const currentCard = flashcards[currentIndex];

    const handleCategorySelect = (categoryId) => {
        if (categoryId === selectedCategoryId) return;
        router.get(categoryId ? `/flashcards?category=${categoryId}` : "/flashcards", {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const nextCard = () => {
        if (flashcards.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const previousCard = () => {
        if (flashcards.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    const speakCurrentWord = useCallback(() => {
        if (!currentCard || typeof window === "undefined" || !window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(currentCard.word);
        utterance.lang = "en-US";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }, [currentCard]);

    const selectedCategory = useMemo(
        () => categories.find((category) => category.id === selectedCategoryId),
        [categories, selectedCategoryId]
    );

    return (
        <>
            <Head title="Flashcards - Học từ vựng" />

            <div className="min-h-screen bg-[#f2f4f9] py-16">
                {!selectedCategoryId ? (
                    <div className="mx-auto max-w-5xl rounded-4xl border border-gray-300 bg-white px-10 py-14 text-center">
                        <h1 className="text-3xl font-semibold text-gray-900">Flashcards</h1>
                        <p className="mt-4 text-lg text-gray-700">Lựa chọn lĩnh vực từ vựng mà bạn cần</p>

                        {categories.length === 0 ? (
                            <div className="mt-12 rounded-3xl border border-dashed border-gray-300 p-10 text-gray-500">
                                <BookOpen className="mx-auto mb-4 h-12 w-12" />
                                Chưa có chủ đề nào
                            </div>
                        ) : (
                            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {categories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        title={category.name}
                                        description={`${category.flashcards_count || 0} từ vựng`}
                                        onSelect={() => handleCategorySelect(category.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mx-auto max-w-4xl rounded-4xl border border-gray-300 bg-white px-10 py-14">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {selectedCategory?.name || "Từ vựng Tiếng Anh giao tiếp"}
                                </h1>
                                <p className="text-gray-600">Lật thẻ để xem nghĩa và phát âm.</p>
                            </div>
                            <Link
                                href="/flashcards"
                                className="rounded-full border border-gray-400 px-6 py-2 text-sm font-semibold text-gray-700"
                            >
                                Chọn chủ đề khác
                            </Link>
                        </div>

                        {flashcards.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-600">
                                <BookOpen className="mx-auto mb-4 h-16 w-16" />
                                Chưa có thẻ từ vựng nào trong chủ đề này
                            </div>
                        ) : (
                            <FlashcardViewer
                                card={currentCard}
                                onNext={nextCard}
                                onBack={() => handleCategorySelect(null)}
                                onSpeak={speakCurrentWord}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

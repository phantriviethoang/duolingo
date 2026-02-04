import { Head, Link, router } from "@inertiajs/react";
import { BookOpen, Filter } from "lucide-react";
import { useState } from "react";

export default function Index({ categories, flashcards, selectedCategoryId }) {
    const [flippedCards, setFlippedCards] = useState({});
    const [filterCategory, setFilterCategory] = useState(selectedCategoryId || null);

    const toggleFlip = (cardId) => {
        setFlippedCards((prev) => ({
            ...prev,
            [cardId]: !prev[cardId],
        }));
    };

    const handleCategoryFilter = (categoryId) => {
        setFilterCategory(categoryId);
        if (categoryId) {
            router.get(`/flashcards?category=${categoryId}`);
        } else {
            router.get('/flashcards');
        }
    };

    return (
        <>
            <Head title="Flashcards - Học từ vựng" />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Flashcards - Học từ vựng</h1>
                    <p className="text-base-content/70">Lật thẻ để xem nghĩa và ví dụ của từ vựng</p>
                </div>

                {/* Category Filter */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={20} />
                            <h3 className="font-semibold">Lọc theo chủ đề</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleCategoryFilter(null)}
                                className={`btn btn-sm ${!filterCategory ? 'btn-primary' : 'btn-outline'}`}
                            >
                                Tất cả ({flashcards.length})
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryFilter(category.id)}
                                    className={`btn btn-sm ${filterCategory === category.id ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {category.name} ({category.flashcards_count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Flashcards Grid */}
                {flashcards.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen size={80} className="mx-auto text-base-content/30 mb-4" />
                        <p className="text-lg text-base-content/70">
                            Chưa có flashcard nào trong danh mục này
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {flashcards.map((card) => (
                            <div
                                key={card.id}
                                className="perspective-1000"
                                onClick={() => toggleFlip(card.id)}
                            >
                                <div
                                    className={`card-flip cursor-pointer ${flippedCards[card.id] ? 'flipped' : ''}`}
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.6s',
                                        transform: flippedCards[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        position: 'relative',
                                        height: '280px',
                                    }}
                                >
                                    {/* Front */}
                                    <div
                                        className="card bg-primary text-primary-content shadow-xl absolute w-full h-full"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                        }}
                                    >
                                        <div className="card-body items-center justify-center text-center">
                                            <h2 className="card-title text-3xl mb-2">
                                                {card.word}
                                            </h2>
                                            {card.phonetic && (
                                                <p className="text-sm opacity-80">
                                                    /{card.phonetic}/
                                                </p>
                                            )}
                                            {card.category && (
                                                <div className="badge badge-secondary mt-4">
                                                    {card.category.name}
                                                </div>
                                            )}
                                            <p className="text-sm mt-4 opacity-70">
                                                Nhấp để xem nghĩa
                                            </p>
                                        </div>
                                    </div>

                                    {/* Back */}
                                    <div
                                        className="card bg-secondary text-secondary-content shadow-xl absolute w-full h-full"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        <div className="card-body justify-center">
                                            <div className="mb-4">
                                                <h3 className="font-semibold text-lg mb-2">
                                                    Nghĩa:
                                                </h3>
                                                <p className="text-xl">
                                                    {card.meaning}
                                                </p>
                                            </div>
                                            {card.example && (
                                                <div>
                                                    <h3 className="font-semibold text-sm mb-1">
                                                        Ví dụ:
                                                    </h3>
                                                    <p className="text-sm italic opacity-90">
                                                        {card.example}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

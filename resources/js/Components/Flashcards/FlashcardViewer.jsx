import { useEffect, useState } from "react";
import { Volume2, RefreshCw } from "lucide-react";

export default function FlashcardViewer({ card, onNext, onBack, onSpeak }) {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setIsFlipped(false);
    }, [card?.id]);

    if (!card) return null;

    const translation = card.translation || card.meaning;

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    const handleNext = () => {
        setIsFlipped(false);
        onNext?.();
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="w-full rounded-4xl border border-gray-300 bg-[#efeff3] p-10">
                <div className={`mx-auto max-w-lg rounded-3xl border border-gray-300 px-10 py-12 text-center transition-all duration-300 ${isFlipped ? "bg-white" : "bg-[#e5fff4]"}`}>
                    <div className="flex items-center justify-center gap-3 text-3xl font-semibold text-gray-900">
                        <span>{card.word}</span>
                        <button
                            type="button"
                            onClick={onSpeak}
                            className="rounded-full border border-gray-400 p-2 text-gray-600 hover:bg-white"
                        >
                            <Volume2 className="h-5 w-5" />
                        </button>
                    </div>
                    {(card.word_type || card.phonetic) && (
                        <p className="mt-4 text-lg text-gray-700">
                            ({card.word_type || "noun"}) {card.phonetic || ""}
                        </p>
                    )}

                    {!isFlipped ? (
                        <p className="mt-6 text-base text-gray-500">Nhấn "Lật thẻ" để xem nghĩa và ví dụ.</p>
                    ) : (
                        <div className="mt-6 space-y-4">
                            {translation && (
                                <p className="text-xl font-semibold text-emerald-700">{translation}</p>
                            )}
                            {card.example && (
                                <p className="text-base text-gray-700">
                                    Ví dụ: <span className="font-medium text-gray-900">{card.example}</span>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-full border border-gray-500 px-8 py-2 text-base font-semibold text-gray-800"
                >
                    Chọn chủ đề khác
                </button>
                <button
                    type="button"
                    onClick={handleFlip}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-900 px-8 py-2 text-base font-semibold text-gray-900"
                >
                    <RefreshCw className="h-4 w-4" />
                    {isFlipped ? "Ẩn nghĩa" : "Lật thẻ"}
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full border border-gray-500 px-8 py-2 text-base font-semibold text-gray-800"
                >
                    Từ khác
                </button>
            </div>
        </div>
    );
}

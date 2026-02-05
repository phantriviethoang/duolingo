import { Volume2 } from "lucide-react";

export default function FlashcardViewer({ card, onNext, onBack, onSpeak }) {
    if (!card) return null;

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="w-full rounded-4xl border border-gray-300 bg-[#efeff3] p-10">
                <div className="mx-auto max-w-lg rounded-3xl border border-gray-300 bg-[#e5fff4] px-10 py-12 text-center">
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
                    {card.meaning && (
                        <p className="mt-4 text-base text-gray-800">{card.meaning}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-full border border-gray-500 px-8 py-2 text-base font-semibold text-gray-800"
                >
                    Quay lại
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded-full border border-gray-500 px-8 py-2 text-base font-semibold text-gray-800"
                >
                    Từ khác
                </button>
            </div>
        </div>
    );
}

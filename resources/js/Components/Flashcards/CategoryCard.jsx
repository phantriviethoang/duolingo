export default function CategoryCard({ title, description, onSelect }) {
    return (
        <div className="rounded-[28px] border border-gray-300 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-gray-800">{title}</p>
            {description && (
                <p className="mt-2 text-sm text-gray-600">{description}</p>
            )}
            <button
                type="button"
                onClick={onSelect}
                className="mt-8 rounded-full border border-gray-500 px-6 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
                Chi tiết
            </button>
        </div>
    );
}

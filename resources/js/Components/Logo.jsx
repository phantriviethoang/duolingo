export default function Logo({ className = "h-12 w-12", variant = "dark" }) {
    const isLight = variant === "light";

    const borderClass = isLight ? "border-white" : "border-gray-900";
    const squareClass = isLight ? "bg-white" : "bg-gray-900";
    const textClass = isLight ? "text-white" : "text-gray-900";

    return (
        <div className={`relative grid place-items-center rounded-xl border ${borderClass} ${className}`}>
            <span className={`absolute left-1/2 top-0 inline-block h-2 w-2 -translate-x-1/2 -translate-y-1/2 ${squareClass}`} />
            <span className={`absolute right-0 top-1/2 inline-block h-2 w-2 translate-x-1/2 -translate-y-1/2 ${squareClass}`} />
            <span className={`absolute bottom-0 left-1/2 inline-block h-2 w-2 -translate-x-1/2 translate-y-1/2 ${squareClass}`} />
            <span className={`absolute left-0 top-1/2 inline-block h-2 w-2 -translate-x-1/2 -translate-y-1/2 ${squareClass}`} />
            <span className={`text-xl font-bold leading-none ${textClass}`}>E</span>
        </div>
    );
}

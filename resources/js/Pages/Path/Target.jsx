import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Target, TrendingUp, Trophy, CheckCircle2 } from 'lucide-react';

export default function TargetSelection({ goal_score }) {
    const { data, setData, put, processing } = useForm({
        goal_score: goal_score || 50,
    });

    const options = [
        {
            value: 50,
            label: 'Cơ bản',
            description: 'Dành cho người mới bắt đầu.',
            threshold: '>= 50%',
            icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
            bgColor: 'bg-blue-50/50',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-700',
            bgBadge: 'bg-blue-100'
        },
        {
            value: 70,
            label: 'Khá',
            description: 'Cải thiện kỹ năng rõ rệt.',
            threshold: '>= 70%',
            icon: <Target className="w-8 h-8 text-indigo-500" />,
            bgColor: 'bg-indigo-50/50',
            borderColor: 'border-indigo-500',
            textColor: 'text-indigo-700',
            bgBadge: 'bg-indigo-100'
        },
        {
            value: 90,
            label: 'Xuất sắc',
            description: 'Thông thạo ngoại ngữ.',
            threshold: '>= 90%',
            icon: <Trophy className="w-8 h-8 text-amber-500" />,
            bgColor: 'bg-amber-50/50',
            borderColor: 'border-amber-500',
            textColor: 'text-amber-700',
            bgBadge: 'bg-amber-100'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('path.saveTarget'));
    };

    return (
        <AuthenticatedLayout fullWidth={true}>
            <Head title="Thiết lập mục tiêu" />

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Mục tiêu học tập của bạn là gì?
                    </h1>
                    <p className="text-xl text-gray-600 font-medium">
                        Chọn một ngưỡng điểm để chúng tôi tối ưu lộ trình học tập cho bạn. {goal_score && <span className="text-blue-600 block mt-2">(Mục tiêu cũ: {goal_score}%)</span>}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => setData('goal_score', option.value)}
                                className={`relative cursor-pointer group rounded-3xl p-8 border-4 transition-all duration-300 ${data.goal_score === option.value
                                    ? `${option.borderColor} ${option.bgColor} shadow-2xl scale-105`
                                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-xl'
                                    }`}
                            >
                                {data.goal_score === option.value && (
                                    <div className={`absolute top-4 right-4 ${option.textColor}`}>
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                )}

                                <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm inline-block group-hover:scale-110 transition-transform">
                                    {option.icon}
                                </div>

                                <h3 className="text-xl font-black text-gray-900 mb-2">{option.label}</h3>
                                <p className="text-gray-500 text-sm font-medium mb-4 leading-relaxed">
                                    {option.description}
                                </p>

                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${option.bgBadge} ${option.textColor}`}>
                                    Điểm đậu: {option.threshold}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn px-12 py-4 h-auto bg-blue-600 hover:bg-blue-700 text-white border-none rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {processing ? 'Đang lưu...' : 'Lưu mục tiêu & Bắt đầu'}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-8 text-gray-400 text-sm">
                    Bạn có thể thay đổi mục tiêu này sau bất cứ lúc nào trong cài đặt lộ trình.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}

import { ArrowRight } from "lucide-react";

export default function ActionCard(props: { title: string; subtitle: string }) {
    const { title, subtitle } = props;
    return (
        <button className="relative p-5 text-left transition bg-[#F3F1ED] border-b-4 border-brand-gold shadow-sm group rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xl font-bold text-gray-900 mb-2">{title}</p>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>
                <span className="grid text-white rounded-full bg-brand-gold/70 h-9 w-9 place-items-center group-hover:bg-brand-gold shrink-0">
                    <ArrowRight className="w-5 h-5" />
                </span>
            </div>
        </button>
    );
}
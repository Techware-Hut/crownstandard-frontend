"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface ActionCardProps {
  title: string;
  subtitle: string;
  href?: string;
}

export default function ActionCard({ title, subtitle, href }: ActionCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "relative p-5 text-left transition bg-[#F3F1ED] border-b-4 border-brand-gold shadow-sm group rounded-xl w-full",
        href
          ? "hover:shadow-md cursor-pointer"
          : "cursor-default"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xl font-bold text-gray-900 mb-2">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        <span
          className={clsx(
            "grid text-white rounded-full h-9 w-9 place-items-center shrink-0",
            href
              ? "bg-brand-gold/70 group-hover:bg-brand-gold"
              : "bg-gray-300"
          )}
        >
          <ArrowRight className="w-5 h-5" />
        </span>
      </div>
    </button>
  );
}

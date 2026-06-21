import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/faq";

type AccordionProps = {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
};

export default function Accordion({
  item,
  isOpen,
  onToggle,
  index,
}: AccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      setMaxHeight(`${el.scrollHeight}px`);
      const t = setTimeout(() => setMaxHeight("none"), 350);
      return () => clearTimeout(t);
    } else {
      // collapse from "none" back to measured height, then to 0 for animation
      setMaxHeight(`${el.scrollHeight}px`);
      requestAnimationFrame(() => setMaxHeight("0px"));
    }
  }, [isOpen]);

  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <article
      className={[
        "group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300",
        isOpen
          ? "border-indigo-200 shadow-indigo-100/60 ring-1 ring-indigo-100"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`panel-${item.id}`}
        id={`trigger-${item.id}`}
        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
      >
        <span
          className={[
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-semibold tabular-nums transition-colors",
            isOpen
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
          ].join(" ")}
        >
          {formattedIndex}
        </span>

        <span className="flex-1 text-base font-medium text-slate-900 sm:text-lg">
          {item.question}
        </span>

        <span
          className={[
            "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300",
            isOpen
              ? "rotate-180 border-indigo-200 bg-indigo-50 text-indigo-600"
              : "border-slate-200 bg-white text-slate-500 group-hover:border-slate-300 group-hover:text-slate-700",
          ].join(" ")}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      <div
        id={`panel-${item.id}`}
        role="region"
        aria-labelledby={`trigger-${item.id}`}
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
      >
        <div className="border-t border-slate-100 px-5 pb-6 pt-5 sm:px-6">
          <p className="text-[15px] leading-relaxed text-slate-600">
            {item.answer}
          </p>
          <div className="mt-5 flex items-center gap-3 text-xs">
            <span className="text-slate-400">Was this helpful?</span>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            >
              👍 Yes
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              👎 No
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

import type { FaqCategory } from "@/lib/faq";

type CategoryTabsProps = {
  categories: FaqCategory[];
  active: string;
  onSelect: (id: string) => void;
  counts: Record<string, number>;
};

export default function CategoryTabs({
  categories,
  active,
  onSelect,
  counts,
}: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="FAQ categories"
      className="flex flex-wrap gap-2"
    >
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(cat.id)}
            className={[
              "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-blue-500 text-white shadow-sm shadow-slate-900/20"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")}
          >
            <span>{cat.label}</span>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-white",
              ].join(" ")}
            >
              {counts[cat.id] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

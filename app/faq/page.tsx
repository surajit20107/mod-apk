'use client'

import { useEffect, useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { categories, faqs } from "@/lib/faq";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import CategoryTabs from "@/components/CategoryTabs";
import Accordion from "@/components/Accordion";
import Sidebar from "@/components/FaqSidebar";
import CTASection from "@/components/CTASection";

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  // Filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, query]);

  // Counts per category (always based on query, not activeCategory)
  const counts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result: Record<string, number> = { all: 0 };
    for (const cat of categories) {
      if (cat.id === "all") continue;
      result[cat.id] = 0;
    }
    for (const item of faqs) {
      if (q) {
        const matches =
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q);
        if (!matches) continue;
      }
      result.all += 1;
      result[item.category] = (result[item.category] ?? 0) + 1;
    }
    return result;
  }, [query]);

  const popular = useMemo(
    () => faqs.filter((f) => f.popular).slice(0, 5),
    []
  );

  // When user clicks a popular question, set category to All, clear search,
  // and open that question's accordion.
  const handleSelectQuestion = (id: string) => {
    const item = faqs.find((f) => f.id === id);
    setQuery("");
    if (item) setActiveCategory(item.category);
    setOpenId(id);
    requestAnimationFrame(() => {
      const el = document.getElementById(`trigger-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  // If the active filter/search hides the currently open item, close it.
  useEffect(() => {
    if (openId && !filtered.some((f) => f.id === openId)) {
      setOpenId(null);
    }
  }, [filtered, openId]);

  return (
    <div>
      <div>
        <Hero
          questionCount={faqs.length}
          categoryCount={categories.length - 1}
        />

        <section className="px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_320px]">
            {/* Main column */}
            <div className="space-y-6">
              <SearchBar value={query} onChange={setQuery} />
              <CategoryTabs
                categories={categories}
                active={activeCategory}
                onSelect={setActiveCategory}
                counts={counts}
              />

              <div className="pt-2">
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-lg font-semibold text-slate-400">
                    {query
                      ? `${filtered.length} result${
                          filtered.length === 1 ? "" : "s"
                        } for "${query}"`
                      : activeCategory === "all"
                      ? "All questions"
                      : categories.find((c) => c.id === activeCategory)
                          ?.label}
                  </h2>
                  <span className="text-xs text-slate-400">
                    {filtered.length} of {faqs.length}
                  </span>
                </div>

                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-400">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                      No questions found
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Try a different keyword or clear the filters to see all
                      questions.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setActiveCategory("all");
                      }}
                      className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((item, idx) => (
                      <Accordion
                        key={item.id}
                        item={item}
                        index={idx}
                        isOpen={openId === item.id}
                        onToggle={() =>
                          setOpenId((cur) =>
                            cur === item.id ? null : item.id
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar
              popular={popular}
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
        </section>

        <CTASection />
        {/* </CTASection> */}
      </div>
    </div>
  );
}

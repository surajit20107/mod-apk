import { Sparkles, MessageCircle } from "lucide-react";

type HeroProps = {
  questionCount: number;
  categoryCount: number;
};

export default function Hero({ questionCount, categoryCount }: HeroProps) {
  return (
    <section className="relative px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Frequently Asked{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Questions
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Find answers to the most common questions about GetModsAPK and our modified applications.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
            <MessageCircle className="h-3.5 w-3.5 text-indigo-500" />
            {questionCount} answers
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
            {categoryCount} categories
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
            Updated weekly
          </span>
        </div>
      </div>
    </section>
  );
}

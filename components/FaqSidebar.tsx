import { ArrowUpRight, MessageSquare, Github, Send } from "lucide-react";
import type { FaqItem } from "@/lib/faq";

type SidebarProps = {
  popular: FaqItem[];
  onSelectQuestion: (id: string) => void;
};

const resources = [
  {
    icon: Github,
    title: "GitHub Repository",
    description: "Browse the source code and contribute.",
    href: "https://github.com/surajit20107/mod-apk",
  },
  {
    icon: Send,
    title: "Telegram Support",
    description: "Get updates and discuss apps with the community.",
    href: "https://telegram.me/Thunder_Modz",
  },
  {
    icon: MessageSquare,
    title: "Contact Us",
    description: "Reach out for support or inquiries.",
    href: "#",
  },
];

export default function Sidebar({
  popular,
  onSelectQuestion,
}: SidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-8">
      {/* Popular */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Popular Questions
          </h3>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            Hot
          </span>
        </div>
        <ul className="space-y-1">
          {popular.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectQuestion(item.id)}
                className="group flex w-full items-start gap-2.5 rounded-lg px-2 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 transition group-hover:bg-indigo-600" />
                <span className="flex-1 leading-snug">{item.question}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          More Resources
        </h3>
        <ul className="space-y-3">
          {resources.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.title}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-indigo-100 group-hover:text-indigo-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-900">
                      {r.title}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {r.description}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

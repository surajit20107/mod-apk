import { ArrowRight, Mail, MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-6 pb-24 pt-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 shadow-2xl shadow-slate-900/20 sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(60% 80% at 80% 20%, rgba(139,92,246,0.45), transparent 60%), radial-gradient(50% 60% at 10% 80%, rgba(56,189,248,0.35), transparent 60%)",
          }}
        />
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200 ring-1 ring-white/20">
              <MessageCircle className="h-3.5 w-3.5" />
              Still stuck?
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Can't find the answer you're looking for?
            </h2>
            <p className="mt-4 text-slate-300">
              Our community and support team are happy to help. Reach out and
              we'll get back to you within one business day.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="#"
              className="group flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 text-slate-900 cursor-pointer shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    Email support
                  </span>
                  <span className="block text-xs text-slate-500">
                    support@example.com
                  </span>
                </span>
              </span>
              <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
            </a>

            <a
              href="#"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <span className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    Join the community
                  </span>
                  <span className="block text-xs text-slate-300">
                    Discord · 100,000+ developers
                  </span>
                </span>
              </span>
              <ArrowRight className="h-5 w-5 text-white/60 transition group-hover:translate-x-1 group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

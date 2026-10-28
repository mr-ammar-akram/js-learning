import { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Briefcase,
  Globe,
  Newspaper,
  Crown,
  LifeBuoy,
} from "lucide-react";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";

/* ---------- Routes ---------- */
const ROUTES = {
  contact: "/contact",
  memberships: "/memberships",
  posts: "/posts",
};

/* ---------- Shared class strings (dark theme) ---------- */
const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const btnBase = `inline-flex min-h-12 items-center justify-center rounded-full border-2 px-6 text-base font-semibold transition-colors ${focusRing}`;
const btnPrimary = `${btnBase} border-orange-400 bg-orange-400 text-slate-950 hover:border-orange-300 hover:bg-orange-300`;
const btnGhost = `${btnBase} border-slate-700 bg-transparent text-slate-100 hover:border-slate-400`;

/* ---------- Content: edit these arrays to match your real services ---------- */
const SERVICES = [
  {
    Icon: BookOpen,
    title: "Academic books",
    text: "Textbooks, reference guides and study material for school, college and university courses.",
    points: ["Curated by subject and level", "Exam and course preparation", "Trusted publishers and authors"],
  },
  {
    Icon: Briefcase,
    title: "Professional growth",
    text: "Books and guides on careers, business, leadership and practical skills you can use at work.",
    points: ["Career and skills development", "Business and management", "Practical, actionable reading"],
  },
  {
    Icon: Globe,
    title: "General knowledge",
    text: "Science, history, culture and current affairs for curious readers of every age.",
    points: ["Wide range of topics", "Easy-to-read explanations", "Great for self-learners"],
  },
  {
    Icon: Newspaper,
    title: "Articles and blogs",
    text: "Free articles, study tips and reading lists to help you learn more in less time.",
    points: ["New posts regularly", "Study and reading guides", "Free to read for everyone"],
  },
  {
    Icon: Crown,
    title: "Membership access",
    text: "Unlock premium content, exclusive benefits and unlimited access with a flexible plan.",
    points: ["Daily to yearly plans", "Premium features", "Cancel when you need to"],
  },
  {
    Icon: LifeBuoy,
    title: "Personal support",
    text: "Not sure where to start? Tell us what you need and we will point you to the right resource.",
    points: ["Friendly, human help", "Recommendations for your goals", "Quick replies"],
  },
];

const STEPS = [
  { title: "Tell us what you need", text: "Browse the services above or send us a short message about your goal." },
  { title: "Get the right match", text: "We help you pick the books, content or plan that fits your level and budget." },
  { title: "Start learning", text: "Get access straight away and keep learning at your own pace." },
];

const FAQS = [
  {
    q: "How do I get started?",
    a: "Create a free account, browse the services, and choose a membership plan if you want premium access.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Yes. You can switch plans or stop renewing from your account whenever you like.",
  },
  {
    q: "Who can I talk to if I need help?",
    a: "Use the contact page and send us a message. We reply as quickly as we can.",
  },
];

/* ---------- Small presentational pieces, memoised ---------- */
const SectionHeading = memo(function SectionHeading({ id, title, text, center = false }) {
  return (
    <div className={`mb-9 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <h2 id={id} className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-3 text-lg text-slate-400">{text}</p>}
    </div>
  );
});

const ServiceCard = memo(function ServiceCard({ Icon, title, text, points }) {
  return (
    <li className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-orange-400/50">
      <span className="grid size-12 place-items-center rounded-xl bg-orange-400/10 text-orange-400">
        <Icon size={24} aria-hidden="true" />
      </span>
      <h3 className="mb-2 mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="text-slate-400">{text}</p>
      <ul className="mt-4 grid gap-2 border-t border-slate-800 pt-4 text-sm">
        {points.map((p) => (
          <li key={p} className="flex gap-2.5">
            <svg
              viewBox="0 0 24 24"
              className="mt-0.5 size-4 shrink-0 text-orange-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 5 5 9-10" />
            </svg>
            {p}
          </li>
        ))}
      </ul>
    </li>
  );
});

export default function Services() {
  useEffect(() => {
    document.title = "Services";
  }, []);

  return (
    <div className="w-full bg-slate-950 font-sans leading-relaxed text-slate-300 antialiased [color-scheme:dark]">
      <a
        href="#main"
        className={`sr-only z-50 rounded-lg bg-white px-4 py-2 text-slate-900 focus:not-sr-only focus:absolute focus:left-3 focus:top-3 ${focusRing}`}
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        {/* PAGE HERO */}
        <section
          aria-labelledby="services-title"
          className="bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.18),transparent_65%)] py-14 text-center sm:py-20"
        >
          <div className={container}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-400">
              What we offer
            </p>
            <h1
              id="services-title"
              className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tighter text-white sm:text-5xl lg:text-6xl"
            >
              Services built around the way you learn
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300 sm:text-xl">
              From academic books to professional growth and general knowledge, find the right
              resources and support in one place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to={ROUTES.memberships} className={`${btnPrimary} max-[360px]:w-full`}>
                View membership plans
              </Link>
              <Link to={ROUTES.contact} className={`${btnGhost} max-[360px]:w-full`}>
                Talk to us
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section aria-labelledby="offer-title" className="py-16 sm:py-20">
          <div className={container}>
            <SectionHeading
              center
              id="offer-title"
              title="Everything in one place"
              text="Pick the service that fits your goals. You can mix and match as you grow."
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <ServiceCard key={s.title} {...s} />
              ))}
            </ul>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section aria-labelledby="process-title" className="bg-slate-900/50 py-16 sm:py-20">
          <div className={container}>
            <SectionHeading id="process-title" title="How it works" />
            <ol className="grid gap-4 lg:grid-cols-3">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className="relative rounded-2xl border border-slate-800 bg-slate-900 p-6 pl-[4.5rem]"
                >
                  <span className="absolute left-6 top-6 grid size-9 place-items-center rounded-full bg-orange-400 font-bold text-slate-950">
                    {i + 1}
                  </span>
                  <h3 className="mb-1.5 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="text-slate-400">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="py-16 sm:py-20">
          <div className={`${container} max-w-3xl`}>
            <SectionHeading id="faq-title" title="Common questions" />
            <div className="divide-y divide-slate-800 border-y border-slate-800">
              {FAQS.map((f) => (
                <details key={f.q} className="group">
                  <summary
                    className={`relative cursor-pointer list-none py-5 pr-9 font-semibold text-white [&::-webkit-details-marker]:hidden ${focusRing}`}
                  >
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-2xl font-normal text-orange-400 group-open:hidden"
                    >
                      +
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute right-1 top-1/2 hidden -translate-y-1/2 text-2xl font-normal text-orange-400 group-open:block"
                    >
                      –
                    </span>
                  </summary>
                  <p className="pb-5 text-slate-400">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section aria-labelledby="cta-title" className="pb-16 sm:pb-20">
          <div className={container}>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.15),transparent_70%)] px-6 py-14 text-center">
              <h2 id="cta-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Not sure which service you need?
              </h2>
              <p className="mx-auto mb-7 mt-3 max-w-lg text-slate-300">
                Send us a message and we will help you find the right fit.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to={ROUTES.contact} className={btnPrimary}>
                  Contact us
                </Link>
                <Link to={ROUTES.posts} className={btnGhost}>
                  Read our blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
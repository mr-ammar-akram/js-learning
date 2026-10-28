import { memo, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { Header } from "./layout/Header";

/* ---------- Routes: change these to match your router ---------- */
const ROUTES = {
  register: "/register",
  login: "/login",
  dashboard: "/dashboard",
  checkout: "/checkout",
  contact: "/contact",
};

/* ---------- Reusable class strings (dark theme) ---------- */
const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";
const btnBase = `inline-flex min-h-12 items-center justify-center rounded-full border-2 px-6 text-base font-semibold transition-colors ${focusRing}`;
const btnPrimary = `${btnBase} border-blue-600 bg-blue-600 text-white hover:border-blue-500 hover:bg-blue-500`;
const btnGhost = `${btnBase} border-slate-700 bg-transparent text-slate-100 hover:border-slate-400`;

/* ---------- Static content, created once outside the component ---------- */
const STATS = [
  { value: "2 min", label: "to publish your first page" },
  { value: "95+", label: "typical Lighthouse performance score" },
  { value: "100%", label: "responsive on phone, tablet and desktop" },
];

const FEATURES = [
  {
    title: "Fast by default",
    text: "Pages ship small and load quickly, so visitors reach your content before they think about leaving.",
    icon: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z",
  },
  {
    title: "Responsive everywhere",
    text: "Every layout adapts to any screen size. Design once and it works on phones, tablets and large monitors.",
    icon: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm5 17h.01",
  },
  {
    title: "Clean, modern design",
    text: "Minimal building blocks with consistent spacing and type, so everything you make looks considered.",
    icon: "M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3a2 2 0 0 1 1.5-3.2H17a4 4 0 0 0 4-4c0-4-4-7.5-9-7.5Z",
  },
  {
    title: "Secure sign-in",
    text: "Account access is protected with token-based authentication, so only you can change your site.",
    icon: "M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z",
  },
  {
    title: "Built for search",
    text: "Semantic markup and clear page structure help search engines understand and rank your content.",
    icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-5-5",
  },
  {
    title: "Easy to grow",
    text: "Start with one page and add sections, pages and integrations as your project gets bigger.",
    icon: "M4 20V10m6 10V4m6 16v-7m6 7H2",
  },
];

const STEPS = [
  { title: "Create your account", text: "Register with your email. It takes less than a minute." },
  {
    title: "Choose a layout",
    text: "Pick a starting point and change the text, colours and sections to fit your brand.",
  },
  { title: "Publish", text: "Go live with one click and keep improving the page whenever you like." },
];

/* Placeholder reviews: replace with real customer quotes before launch */
const REVIEWS = [
  {
    quote:
      "I had a clean landing page live in an afternoon. It looked right on my phone without any extra work.",
    name: "Customer name",
    role: "Freelance designer",
  },
  {
    quote: "The pages load fast and our contact form submissions went up after we switched.",
    name: "Customer name",
    role: "Small business owner",
  },
  {
    quote: "Simple enough that my whole team can edit content without asking a developer.",
    name: "Customer name",
    role: "Marketing lead",
  },
];

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "No. You can build and publish pages without writing code. If you are a developer, you can still customise everything.",
  },
  {
    q: "Can I use my own domain name?",
    a: "Yes. Paid plans let you connect a custom domain to your website.",
  },
  {
    q: "Will my site work on mobile?",
    a: "Yes. Every layout is responsive and tested on common phone, tablet and desktop sizes.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. You can downgrade or cancel from your account settings whenever you want.",
  },
];

/* ---------- Helpers for membership data ---------- */
const DURATION_LABELS = { 1: "Day", 30: "Month", 180: "Half Year" };
const durationLabel = (d) => DURATION_LABELS[Number(d)] ?? "1 Year";
const formatAmount = (n) =>
  Number.isNaN(Number(n)) ? n : Number(n).toLocaleString("en-PK");

/* ---------- Small presentational pieces, memoised ---------- */
const Icon = memo(function Icon({ path }) {
  return (
    <span className="grid size-12 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d={path} />
      </svg>
    </span>
  );
});

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

const HeroPreview = memo(function HeroPreview() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-lg justify-self-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-950/40"
    >
      <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <span className="size-2.5 rounded-full bg-slate-700" />
        <span className="size-2.5 rounded-full bg-slate-700" />
        <span className="size-2.5 rounded-full bg-slate-700" />
        <div className="ml-3 flex-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-0.5 text-xs text-slate-400">
          mybrand.com
        </div>
      </div>
      <div className="grid gap-3 px-5 pb-7 pt-6">
        <div className="h-5 w-3/4 rounded-md bg-slate-100" />
        <div className="h-2.5 w-11/12 rounded-md bg-slate-700" />
        <div className="h-2.5 w-3/5 rounded-md bg-slate-700" />
        <div className="mt-1 h-8 w-28 rounded-full bg-blue-500" />
        <div className="mt-2 grid grid-cols-3 gap-2.5">
          <div className="h-16 rounded-lg bg-amber-300/30" />
          <div className="h-16 rounded-lg border border-slate-800 bg-slate-950" />
          <div className="h-16 rounded-lg border border-slate-800 bg-slate-950" />
        </div>
      </div>
    </div>
  );
});

/* ---------- Pricing: live membership plans from your API ---------- */
function PricingSection() {
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_HOST_URL}/memberships`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        const list = (json.data ?? []).filter((m) => m.plans?.length);
        setMemberships([...list].sort((a, b) => a.id - b.id));
        setStatus("ready");
      } catch (err) {
        if (err.name !== "AbortError") setStatus("error");
      }
    })();

    // Cancel the request if the user leaves the page mid-load
    return () => controller.abort();
  }, [attempt]);

  const upgradePlan = (membership) => {
    const plan = membership.plans[0];
    navigate(ROUTES.checkout, {
      state: {
        membership_id: membership.id,
        membership_name: membership.title,
        plan_amount: plan.amount,
        plan_name: plan.name,
      },
    });
  };

  const retry = () => {
    setStatus("loading");
    setAttempt((a) => a + 1);
  };

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-4 py-16 sm:py-20">
      <div className={container}>
        <SectionHeading
          center
          id="pricing-title"
          title="Simple pricing"
          text="Unlock exclusive benefits, premium features, and unlimited access with flexible membership plans tailored to your needs."
        />

        {status === "loading" && (
          <div role="status" className="flex h-48 items-center justify-center">
            <span className="size-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500 motion-reduce:animate-none" />
            <span className="sr-only">Loading plans…</span>
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
            <p className="text-slate-300">We couldn’t load the plans. Check your connection and try again.</p>
            <button type="button" onClick={retry} className={`${btnGhost} mt-4`}>
              Try again
            </button>
          </div>
        )}

        {status === "ready" && memberships.length === 0 && (
          <p className="text-center text-slate-400">No plans are available right now. Please check back soon.</p>
        )}

        {status === "ready" && memberships.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
            {memberships.map((m) => {
              const plan = m.plans[0];
              const amount = formatAmount(plan.amount);
              return (
                <article
                  key={m.id}
                  className="flex h-full w-full flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30 md:min-h-[30rem]"
                >
                  <header>
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <p className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white">
                      {m.title}
                    </p>
                  </header>

                  <p className="flex min-h-[4.5rem] flex-wrap items-end gap-x-1.5 text-white">
                    <span className="sr-only">Rs {amount}</span>
                    <span aria-hidden="true" className="text-5xl font-normal leading-none tracking-tight">
                      ₨&nbsp;{amount}
                    </span>
                    {m.duration && (
                      <span className="pb-0.5 text-base text-slate-400">/ {durationLabel(m.duration)}</span>
                    )}
                  </p>

                  <button type="button" onClick={() => upgradePlan(m)} className={`${btnPrimary} w-full`}>
                    {Number(plan.amount) > 0 ? "Purchase plan" : "Free"}
                  </button>

                  {/* Plan features come from your admin editor as HTML.
                      Sanitise with DOMPurify if non-admins can ever edit it. */}
                  <div
                    className="tiptap tiptap-membership grow text-sm text-slate-300 [&_a]:underline [&_li]:mb-1.5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: m.description }}
                  />

                  <p className="border-t border-slate-800 pt-3 text-xs text-slate-400">
                    Want to know more?{" "}
                    <Link
                      to={ROUTES.contact}
                      className={`font-medium text-slate-200 underline ${focusRing}`}
                    >
                      Go to Chat
                    </Link>
                  </p>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-2 text-center">
          <Users size={24} className="text-blue-400" aria-hidden="true" />
          <h3 className="text-sm font-medium text-white">Membership Benefits</h3>
          <p className="text-sm text-slate-400">Explore topics in depth with longer conversations</p>
        </div>
      </div>
    </section>
  );
}

export default function Homepage() {
  /* Read the login cookie once per mount, not on every render */
  const isLoggedIn = useMemo(
    () => document.cookie.split("; ").some((row) => row.startsWith("token=")),
    []
  );

  const primaryCta = isLoggedIn
    ? { to: ROUTES.dashboard, label: "Go to dashboard" }
    : { to: ROUTES.register, label: "Get started free" };

  return (
    <div className="w-full bg-slate-950 font-sans leading-relaxed text-slate-300 antialiased [color-scheme:dark]">
      <a
        href="#main"
        className={`sr-only z-50 rounded-lg bg-white px-4 py-2 text-slate-900 focus:not-sr-only focus:absolute focus:left-3 focus:top-3 ${focusRing}`}
      >
        Skip to content
      </a>

      {/* NAVBAR */}
      <Header />

      <main id="main">
        {/* HERO */}
        <section
          aria-labelledby="hero-title"
          className="bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.28),transparent_60%)] py-12 lg:py-24"
        >
          <div className={`${container} grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14`}>
            <div>
              <h1
                id="hero-title"
                className="text-4xl font-extrabold tracking-tighter text-white sm:text-5xl lg:text-6xl"
              >
                Build something people want to visit
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-300 sm:text-xl">
                Create modern, fast websites in minutes. Pick a layout, make it yours, and publish
                without wrestling with code.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to={primaryCta.to} className={`${btnPrimary} max-[360px]:w-full`}>
                  {primaryCta.label}
                </Link>
                <a href="#how-it-works" className={`${btnGhost} max-[360px]:w-full`}>
                  See how it works
                </a>
              </div>
              <p className="mt-3.5 text-sm text-slate-400">No credit card required.</p>
            </div>
            <HeroPreview />
          </div>
        </section>

        {/* STATS */}
        <section aria-label="Highlights" className="border-y border-slate-800">
          <div className={container}>
            <dl className="grid divide-y divide-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col-reverse py-6 sm:px-6 ${i === 0 ? "sm:pl-0" : ""}`}
                >
                  <dt className="text-sm text-slate-400 sm:text-base">{s.label}</dt>
                  <dd className="text-3xl font-bold tracking-tight text-white">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" aria-labelledby="features-title" className="scroll-mt-4 py-16 sm:py-20">
          <div className={container}>
            <SectionHeading
              id="features-title"
              title="Everything you need to launch"
              text="Practical tools that keep your site quick, tidy and easy to maintain."
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <li key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <Icon path={f.icon} />
                  <h3 className="mb-2 mt-4 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-slate-400">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          aria-labelledby="how-title"
          className="scroll-mt-4 bg-slate-900/50 py-16 sm:py-20"
        >
          <div className={container}>
            <SectionHeading id="how-title" title="From idea to live site in three steps" />
            <ol className="grid gap-4 lg:grid-cols-3">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className="relative rounded-2xl border border-slate-800 bg-slate-900 p-6 pl-[4.5rem]"
                >
                  <span className="absolute left-6 top-6 grid size-9 place-items-center rounded-full bg-blue-600 font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mb-1.5 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="text-slate-400">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PRICING (membership plans from API) */}
        <PricingSection />

        {/* TESTIMONIALS */}
        <section aria-labelledby="reviews-title" className="bg-slate-900/50 py-16 sm:py-20">
          <div className={container}>
            <SectionHeading id="reviews-title" title="What people say" />
            <div className="grid gap-4 lg:grid-cols-3">
              {REVIEWS.map((r, i) => (
                <figure
                  key={i}
                  className="m-0 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <blockquote className="m-0 text-lg text-slate-100">{r.quote}</blockquote>
                  <figcaption className="flex flex-col text-sm text-slate-400">
                    <strong className="font-semibold text-white">{r.name}</strong>
                    <span>{r.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-4 py-16 sm:py-20">
          <div className={`${container} max-w-3xl`}>
            <SectionHeading id="faq-title" title="Questions, answered" />
            <div className="divide-y divide-slate-800 border-y border-slate-800">
              {FAQS.map((f) => (
                <details key={f.q} className="group">
                  <summary
                    className={`relative cursor-pointer list-none py-5 pr-9 font-semibold text-white [&::-webkit-details-marker]:hidden ${focusRing}`}
                  >
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-2xl font-normal text-blue-400 group-open:hidden"
                    >
                      +
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute right-1 top-1/2 hidden -translate-y-1/2 text-2xl font-normal text-blue-400 group-open:block"
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
            <div className="rounded-3xl border border-slate-800 bg-slate-900 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.25),transparent_70%)] px-6 py-14 text-center">
              <h2 id="cta-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to build your site?
              </h2>
              <p className="mx-auto mb-7 mt-3 max-w-lg text-slate-300">
                Create your free account and publish your first page today.
              </p>
              <Link to={primaryCta.to} className={btnPrimary}>
                {primaryCta.label}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-black/40 pt-12 text-slate-400">
        <div className={`${container} grid gap-8 sm:grid-cols-[2fr_1fr_1fr]`}>
          <div>
            <p className="text-xl font-bold text-white">MyBrand</p>
            <p className="mt-1.5">Modern websites, made simple.</p>
          </div>
          <nav aria-label="Product" className="flex flex-col gap-2">
            <h3 className="mb-1 text-sm font-semibold text-white">Product</h3>
            <a href="#features" className={`w-fit hover:text-white hover:underline ${focusRing}`}>
              Features
            </a>
            <a href="#pricing" className={`w-fit hover:text-white hover:underline ${focusRing}`}>
              Pricing
            </a>
            <a href="#faq" className={`w-fit hover:text-white hover:underline ${focusRing}`}>
              FAQ
            </a>
          </nav>
          <nav aria-label="Account" className="flex flex-col gap-2">
            <h3 className="mb-1 text-sm font-semibold text-white">Account</h3>
            <Link to={ROUTES.login} className={`w-fit hover:text-white hover:underline ${focusRing}`}>
              Log in
            </Link>
            <Link
              to={ROUTES.register}
              className={`w-fit hover:text-white hover:underline ${focusRing}`}
            >
              Sign up
            </Link>
          </nav>
        </div>
        <div className={`${container} mt-10 border-t border-white/10 py-5 text-sm`}>
          <p>© {new Date().getFullYear()} MyBrand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
import { memo, useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";

/* ---------- Shared class strings (dark theme) ---------- */
const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const btnBase = `inline-flex min-h-12 items-center justify-center rounded-full border-2 px-6 text-base font-semibold transition-colors ${focusRing}`;
const btnPrimary = `${btnBase} border-orange-400 bg-orange-400 text-slate-950 hover:border-orange-300 hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60`;
const btnGhost = `${btnBase} border-slate-700 bg-transparent text-slate-100 hover:border-slate-400`;
const fieldBase =
  "w-full rounded-xl border bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-400";
const fieldOk = "border-slate-700 hover:border-slate-500";
const fieldBad = "border-red-400";

/* ---------- Contact details: TODO replace these placeholders ---------- */
const CONTACT_INFO = [
  { Icon: Mail, label: "Email", value: "support@yoursite.com", href: "mailto:support@yoursite.com" },
  { Icon: Phone, label: "Phone", value: "+92 300 0000000", href: "tel:+923000000000" },
  { Icon: MapPin, label: "Address", value: "Your street address, Lahore, Pakistan" },
  { Icon: Clock, label: "Opening hours", value: "Mon – Sat, 9:00 am – 6:00 pm" },
];

const TOPICS = ["General question", "Membership and billing", "Services", "Technical support", "Other"];

const INITIAL = { name: "", email: "", topic: TOPICS[0], message: "", website: "" }; // "website" is a hidden spam trap

/* ---------- Validation (pure function, lives outside the component) ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (values.message.trim().length < 10) errors.message = "Please write at least 10 characters.";
  return errors;
}

/* ---------- Small presentational pieces ---------- */
const InfoCard = memo(function InfoCard({ Icon, label, value, href }) {
  const body = href ? (
    <a href={href} className={`rounded-md font-medium text-white hover:text-orange-400 ${focusRing}`}>
      {value}
    </a>
  ) : (
    <span className="font-medium text-white">{value}</span>
  );

  return (
    <li className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-400/10 text-orange-400">
        <Icon size={22} aria-hidden="true" />
      </span>
      <div className="min-w-0 break-words">
        <p className="text-sm text-slate-400">{label}</p>
        {body}
      </div>
    </li>
  );
});

function Field({ id, label, error, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-200">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-orange-400">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success" | "error"
  const statusRef = useRef(null);

  useEffect(() => {
    document.title = "Contact us";
  }, []);

  // Move focus to the result message so keyboard and screen-reader users notice it
  useEffect(() => {
    if (status === "success" || status === "error") statusRef.current?.focus();
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    // Clear a field's error as soon as the user edits it
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return; // block double submits

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    // Spam trap: real people never fill this hidden field, so pretend it worked
    if (values.website) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`${process.env.REACT_APP_HOST_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          topic: values.topic,
          message: values.message.trim(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setValues(INITIAL);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const describedBy = (id) => (errors[id] ? `${id}-error` : undefined);
  const fieldClass = (id) => `${fieldBase} ${errors[id] ? fieldBad : fieldOk}`;

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
          aria-labelledby="contact-title"
          className="bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.18),transparent_65%)] py-14 text-center sm:py-20"
        >
          <div className={container}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-400">
              Contact
            </p>
            <h1
              id="contact-title"
              className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tighter text-white sm:text-5xl lg:text-6xl"
            >
              We would love to hear from you
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Questions about plans, services or your account? Send us a message and we will reply as
              soon as we can.
            </p>
          </div>
        </section>

        {/* FORM + DETAILS */}
        <section className="pb-16 sm:pb-24">
          <div className={`${container} grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10`}>
            {/* Form card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
              {status === "success" ? (
                <div
                  ref={statusRef}
                  tabIndex={-1}
                  role="status"
                  className="flex flex-col items-center gap-3 py-10 text-center focus:outline-none"
                >
                  <CheckCircle2 size={48} className="text-green-400" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-white">Message sent</h2>
                  <p className="max-w-sm text-slate-400">
                    Thanks for reaching out. We have received your message and will get back to you soon.
                  </p>
                  <button type="button" onClick={() => setStatus("idle")} className={`${btnGhost} mt-3`}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="grid gap-5" aria-labelledby="form-title">
                  <h2 id="form-title" className="text-2xl font-bold tracking-tight text-white">
                    Send us a message
                  </h2>

                  {status === "error" && (
                    <div
                      ref={statusRef}
                      tabIndex={-1}
                      role="alert"
                      className="flex items-start gap-3 rounded-xl border border-red-400/40 bg-red-950/40 p-4 text-red-200 focus:outline-none"
                    >
                      <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <p>We couldn’t send your message. Please try again in a moment.</p>
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="name" label="Your name" error={errors.name} required>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={describedBy("name")}
                        className={fieldClass("name")}
                        placeholder="Your name"
                      />
                    </Field>

                    <Field id="email" label="Email address" error={errors.email} required>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={values.email}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("email")}
                        className={fieldClass("email")}
                        placeholder="you@example.com"
                      />
                    </Field>
                  </div>

                  <Field id="topic" label="Topic">
                    <select
                      id="topic"
                      name="topic"
                      value={values.topic}
                      onChange={handleChange}
                      className={fieldClass("topic")}
                    >
                      {TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="message" label="Message" error={errors.message} required>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={describedBy("message")}
                      className={`${fieldClass("message")} resize-y`}
                      placeholder="How can we help?"
                    />
                  </Field>

                  {/* Honeypot: hidden from people and assistive tech, bots tend to fill it in */}
                  <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Leave this field empty</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" disabled={status === "sending"} className={`${btnPrimary} w-full sm:w-fit`}>
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact details */}
            <aside aria-labelledby="details-title">
              <h2 id="details-title" className="mb-4 text-2xl font-bold tracking-tight text-white">
                Other ways to reach us
              </h2>
              <ul className="grid gap-4">
                {CONTACT_INFO.map((c) => (
                  <InfoCard key={c.label} {...c} />
                ))}
              </ul>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
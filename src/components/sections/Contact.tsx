import { useId, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Copy, Loader2, Mail, TriangleAlert } from "lucide-react";
import { budgets, profile, projectTypes } from "../../data/content";
import { contactDeliveryConfigured, submitContact, validateContact, type ContactErrors, type ContactPayload } from "../../lib/contact";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { Button } from "../ui/Button";
import { Emblem } from "../ui/Crosshairs";
import { Reveal } from "../ui/Reveal";

const empty: ContactPayload = { name: "", email: "", company: "", projectType: "", budget: "", message: "" };

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "sent" } | { kind: "mailto" } | { kind: "error"; message: string };

const inputCls =
  "w-full rounded-xl border border-mirage/20 bg-sand-2 px-4 py-3 text-[15px] text-mirage placeholder:text-subtle transition-colors outline-none hover:border-mirage/40 focus:border-blaze focus:ring-4 focus:ring-blaze/15 aria-[invalid=true]:border-rose-600";

function Field({ label, optional, error, htmlFor, errorId, children }: {
  label: string;
  optional?: boolean;
  error?: string;
  htmlFor?: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-sm font-medium text-mirage">
        {label}
        {optional && <span className="text-xs font-normal text-subtle">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<ContactPayload>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");

  const set = <K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const ids = (key: keyof ContactPayload) => ({ id: `${uid}-${key}`, err: `${uid}-${key}-error` });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    // Bots fill hidden fields; quietly pretend it worked.
    if (honeypot) return setStatus({ kind: "sent" });

    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0] as keyof ContactPayload | undefined;
    if (firstInvalid) {
      document.getElementById(ids(firstInvalid).id)?.focus();
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const result = await submitContact(values);
      setStatus({ kind: result.mode });
      if (result.mode === "sent") setValues(empty);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (status.kind === "sent" || status.kind === "mailto") {
    const sent = status.kind === "sent";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[520px] flex-col items-center justify-center px-6 text-center"
        role="status"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blaze/10 text-blaze-ink">
          {sent ? <CheckCircle2 className="h-7 w-7" /> : <Mail className="h-7 w-7" />}
        </span>
        <h3 className="display mt-6 text-2xl">{sent ? "Thank you. I've got it." : "Your email app should be open."}</h3>
        <p className="mt-3 max-w-sm text-muted">
          {sent
            ? "I'll read it myself, properly, and get back to you soon. I'm already curious about what we could build."
            : `Your message is ready to go, just hit send. If nothing opened, you can write to me directly at ${profile.email}.`}
        </p>
        <Button variant="secondary" className="mt-8" onClick={() => setStatus({ kind: "idle" })}>
          {sent ? "Write another note" : "Back to the form"}
        </Button>
      </motion.div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5 p-6 sm:p-8" aria-describedby={`${uid}-form-note`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor={ids("name").id} error={errors.name} errorId={ids("name").err}>
          <input
            id={ids("name").id}
            className={inputCls}
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? ids("name").err : undefined}
            required
          />
        </Field>
        <Field label="Email" htmlFor={ids("email").id} error={errors.email} errorId={ids("email").err}>
          <input
            id={ids("email").id}
            type="email"
            className={inputCls}
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? ids("email").err : undefined}
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company" optional htmlFor={ids("company").id} errorId={ids("company").err}>
          <input
            id={ids("company").id}
            className={inputCls}
            autoComplete="organization"
            placeholder="If there is one yet"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </Field>
        <Field label="Rough budget" optional htmlFor={ids("budget").id} errorId={ids("budget").err}>
          <div className="relative">
            <select
              id={ids("budget").id}
              className={`${inputCls} appearance-none pr-10 ${values.budget ? "" : "text-subtle"}`}
              value={values.budget}
              onChange={(e) => set("budget", e.target.value)}
            >
              <option value="">Select a range</option>
              {budgets.map((b) => (
                <option key={b} value={b} className="text-mirage">
                  {b}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-subtle">
              ▾
            </span>
          </div>
        </Field>
      </div>

      <fieldset aria-describedby={errors.projectType ? ids("projectType").err : undefined}>
        <legend className="mb-2 text-sm font-medium text-mirage">What are we building?</legend>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map((t, i) => {
            const checked = values.projectType === t;
            return (
              <label
                key={t}
                className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blaze ${
                  checked
                    ? "border-mirage bg-mirage text-sand"
                    : "border-mirage/20 bg-sand-2 text-muted hover:border-mirage hover:text-mirage"
                }`}
              >
                <input
                  type="radio"
                  name="projectType"
                  value={t}
                  id={i === 0 ? ids("projectType").id : undefined}
                  checked={checked}
                  onChange={() => set("projectType", t)}
                  className="sr-only"
                />
                {t}
              </label>
            );
          })}
        </div>
        {errors.projectType && (
          <p id={ids("projectType").err} className="mt-1.5 text-xs text-rose-600">
            {errors.projectType}
          </p>
        )}
      </fieldset>

      <Field label="Tell me about your idea" htmlFor={ids("message").id} error={errors.message} errorId={ids("message").err}>
        <textarea
          id={ids("message").id}
          rows={5}
          className={`${inputCls} resize-y`}
          placeholder="What do you have in mind, who is it for, and why does it matter to you? It's okay if it's still rough."
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? ids("message").err : undefined}
          required
        />
      </Field>

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <AnimatePresence>
        {status.kind === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-600/30 bg-rose-600/[0.06] p-3.5 text-sm text-rose-800"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Sorry, your message didn't go through: {status.message} You can also write to me directly at{" "}
              <a className="underline underline-offset-2" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              .
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col-reverse items-start gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${uid}-form-note`} className="text-xs text-subtle">
          {contactDeliveryConfigured ? "I read every message myself." : "This opens your email app with your note ready to send."}
        </p>
        <Button type="submit" variant="accent" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Start the conversation
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${profile.email}`;
        }
      }}
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-sand/25 px-3 text-xs text-sand/75 transition-colors hover:border-sand hover:text-sand"
      aria-live="polite"
    >
      {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-blaze" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-sea py-24 text-sand md:py-32">
      <Emblem className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] text-sand/[0.04]" />
      <div className="container-page relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <Reveal>
          <p className="eyebrow text-sand/60">
            <span className="h-px w-8 bg-sand/30" aria-hidden />
            Contact
          </p>
          <h2 id="contact-title" className="display mt-5 text-[2.6rem] text-balance sm:text-6xl">
            Have an idea? <span className="text-blaze">Let's build it</span> <span className="text-outline text-sand">together.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-sand/75 text-pretty">
            Whether it's a brand new product, a process that wears your team out, or a hunch about AI, I'd love to hear about
            it. No pitch, no pressure. Just a conversation about what you want to make.
          </p>

          <div className="mt-10 space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-[16px] border border-sand/20 p-4">
              <a href={`mailto:${profile.email}`} className="flex min-w-0 items-center gap-3 hover:text-blaze">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blaze text-white">
                  <Mail className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-sand/55">Email</span>
                  <span className="block truncate text-[15px] font-medium">{profile.email}</span>
                </span>
              </a>
              <CopyEmail />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                { href: profile.github, label: "GitHub", Icon: GithubIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-[16px] border border-sand/20 p-4 transition-colors hover:border-sand hover:bg-sand hover:text-mirage"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>

          <ul className="mt-10 space-y-3 text-sm text-sand/75">
            {["We start with a real conversation, not a sales call", "We shape the plan together, step by step", "I stay with your product after it goes live"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 bg-blaze" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-[24px] bg-paper text-mirage shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

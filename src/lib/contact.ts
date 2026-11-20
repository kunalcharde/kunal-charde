import { profile } from "../data/content";

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(p: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  if (p.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(p.email.trim())) errors.email = "Please enter a valid email address.";
  if (!p.projectType) errors.projectType = "Pick whichever feels closest. 'Not sure yet' is fine too.";
  if (p.message.trim().length < 20) errors.message = "A couple of sentences would help me understand it (20+ characters).";
  return errors;
}

export type SubmitResult = { mode: "sent" } | { mode: "mailto" };

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
// The private client pipeline's public enquiry endpoint; each enquiry becomes a lead there.
const PIPELINE_URL = import.meta.env.VITE_PIPELINE_ENQUIRY_URL as string | undefined;

export const contactDeliveryConfigured = Boolean(WEB3FORMS_KEY || PIPELINE_URL);

function buildEmailBody(p: ContactPayload) {
  const details = [
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    p.company && `Company: ${p.company}`,
    `Project type: ${p.projectType}`,
    p.budget && `Estimated budget: ${p.budget}`,
  ].filter(Boolean);
  return `${details.join("\n")}\n\n${p.message}`;
}

async function postJson(url: string, body: unknown, signal: AbortSignal) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  return { res, data: (await res.json().catch(() => null)) as { success?: boolean; ok?: boolean; message?: string; error?: string } | null };
}

async function sendToInbox(p: ContactPayload, subject: string, signal: AbortSignal) {
  const { res, data } = await postJson(
    "https://api.web3forms.com/submit",
    {
      access_key: WEB3FORMS_KEY,
      subject,
      from_name: "Portfolio contact form",
      replyto: p.email,
      name: p.name,
      email: p.email,
      company: p.company || "Not given",
      project_type: p.projectType,
      budget: p.budget || "Not given",
      message: p.message,
    },
    signal,
  );
  if (!res.ok || !data?.success) throw new Error(data?.message || `Request failed (${res.status})`);
}

async function sendToPipeline(p: ContactPayload, signal: AbortSignal) {
  const { res, data } = await postJson(PIPELINE_URL!, p, signal);
  if (!res.ok || !data?.ok) throw new Error(data?.error || `Request failed (${res.status})`);
}

/**
 * Delivers the enquiry to Kunal's inbox through Web3Forms and to his client pipeline, each when configured.
 * Both are sent at once; the visitor sees success if either arrives, so one service being down loses nothing.
 * With neither configured (e.g. local preview), it opens the visitor's email client with everything pre-filled
 * instead, so the form is never a dead end.
 */
export async function submitContact(p: ContactPayload): Promise<SubmitResult> {
  const subject = `New idea from ${p.name}: ${p.projectType}`;

  if (!WEB3FORMS_KEY && !PIPELINE_URL) {
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildEmailBody(p))}`;
    window.location.href = href;
    return { mode: "mailto" };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const deliveries = [WEB3FORMS_KEY && sendToInbox(p, subject, controller.signal), PIPELINE_URL && sendToPipeline(p, controller.signal)].filter(
      (d): d is Promise<void> => Boolean(d),
    );
    const results = await Promise.allSettled(deliveries);
    if (results.some((r) => r.status === "fulfilled")) return { mode: "sent" };
    const err = (results[0] as PromiseRejectedResult).reason;
    if (err instanceof DOMException && err.name === "AbortError") throw new Error("It took too long to send. Please try again.");
    throw err instanceof Error ? err : new Error("Something went wrong.");
  } finally {
    window.clearTimeout(timeout);
  }
}

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

export const contactDeliveryConfigured = Boolean(WEB3FORMS_KEY);

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

/**
 * Delivers the enquiry to Kunal's inbox through Web3Forms when an access key is configured.
 * Without a key (e.g. local preview), it opens the visitor's email client with everything pre-filled instead,
 * so the form is never a dead end.
 */
export async function submitContact(p: ContactPayload): Promise<SubmitResult> {
  const subject = `New idea from ${p.name}: ${p.projectType}`;

  if (!WEB3FORMS_KEY) {
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildEmailBody(p))}`;
    window.location.href = href;
    return { mode: "mailto" };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
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
      }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (!res.ok || !data?.success) throw new Error(data?.message || `Request failed (${res.status})`);
    return { mode: "sent" };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw new Error("It took too long to send. Please try again.");
    throw err instanceof Error ? err : new Error("Something went wrong.");
  } finally {
    window.clearTimeout(timeout);
  }
}

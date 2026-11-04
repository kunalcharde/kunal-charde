import { FileText, Gavel, Hash, LayoutDashboard, MessageSquare, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { MockupKind } from "../../data/content";
import { BrowserFrame, Line, PhoneFrame } from "./Frames";

// Illustrative product mockups — composed in code, not screenshots of client systems.

function CrmMockup() {
  const bars = [38, 52, 44, 63, 58, 71, 66, 80, 74, 88, 82, 94];
  const rows = [
    { label: "Sampling request", tag: "Pending L2", tone: "amber" },
    { label: "Sales order", tag: "Approved", tone: "emerald" },
    { label: "Visit plan", tag: "In review", tone: "violet" },
  ];
  const tones: Record<string, string> = {
    amber: "bg-amber-400/10 text-amber-300",
    emerald: "bg-emerald-400/10 text-emerald-300",
    violet: "bg-teal-300/10 text-teal-200",
  };
  return (
    <BrowserFrame url="crm.company.app/dashboard">
      <div className="flex h-[300px]">
        <aside className="hidden w-[118px] shrink-0 flex-col gap-1 border-r border-sand/10 p-2.5 sm:flex">
          {[LayoutDashboard, Users, FileText, ShieldCheck].map((Icon, i) => (
            <div key={i} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? "bg-white/[0.06]" : ""}`}>
              <Icon className={`h-3 w-3 ${i === 0 ? "text-blaze" : "text-sand/45"}`} />
              <Line w={i === 0 ? "48px" : `${36 + i * 6}px`} />
            </div>
          ))}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3.5">
          <div className="grid grid-cols-3 gap-2">
            {["Orders", "Approvals", "Field visits"].map((k, i) => (
              <div key={k} className="rounded-lg border border-sand/10 bg-white/[0.02] p-2.5">
                <p className="text-[9px] text-sand/45">{k}</p>
                <div className="mt-2 flex items-end justify-between">
                  <Line w="40%" className="h-2.5 bg-slate-500/60" />
                  <span className={`text-[8px] ${i === 1 ? "text-amber-300" : "text-emerald-300"}`}>▲</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-sand/10 bg-white/[0.02] p-3">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-sea to-blaze/80"
                style={{ height: `${h}%`, opacity: 0.45 + i * 0.045 }}
              />
            ))}
          </div>
          <div className="space-y-1.5">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-md border border-sand/[0.07] px-2.5 py-1.5">
                <span className="text-[10px] text-slate-300">{r.label}</span>
                <span className={`rounded px-1.5 py-0.5 text-[8.5px] ${tones[r.tone]}`}>{r.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function LegalMockup() {
  return (
    <BrowserFrame url="research.legal.app/search">
      <div className="grid h-[300px] grid-cols-1 sm:grid-cols-[1.35fr_1fr]">
        <div className="flex min-w-0 flex-col gap-2.5 p-3.5">
          <div className="flex items-center gap-2 rounded-lg border border-sand/10 bg-white/[0.03] px-2.5 py-2">
            <Search className="h-3 w-3 text-sand/45" />
            <span className="truncate text-[10px] text-slate-300">anticipatory bail · economic offences</span>
          </div>
          {[
            { court: "Supreme Court", cite: "Judgment · 2023" },
            { court: "High Court", cite: "Judgment · 2022" },
            { court: "High Court", cite: "Order · 2021" },
          ].map((r, i) => (
            <div key={i} className="rounded-lg border border-sand/[0.07] bg-white/[0.015] p-2.5">
              <div className="flex items-center gap-1.5">
                <Gavel className="h-2.5 w-2.5 text-blaze" />
                <span className="text-[9.5px] font-medium text-slate-200">{r.court}</span>
                <span className="ml-auto font-mono text-[8.5px] text-sand/45">{r.cite}</span>
              </div>
              <div className="mt-2 space-y-1">
                <Line w="96%" />
                <div className="flex gap-1">
                  <Line w="30%" />
                  <div className="h-1.5 w-[38%] rounded-full bg-blaze/60" />
                  <Line w="22%" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden flex-col gap-2.5 border-l border-sand/10 bg-white/[0.015] p-3.5 sm:flex">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-blaze" />
            <span className="text-[10px] font-medium">AI summary</span>
          </div>
          <div className="space-y-1.5">
            <Line w="100%" />
            <Line w="92%" />
            <Line w="97%" />
            <Line w="64%" />
          </div>
          <p className="mt-1 text-[9px] text-sand/45">Key holdings</p>
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-start gap-1.5">
              <span className="rounded bg-blaze/20 px-1 font-mono text-[8px] text-blaze">[{n}]</span>
              <div className="flex-1 space-y-1 pt-0.5">
                <Line w="94%" />
                <Line w={`${50 + n * 12}%`} />
              </div>
            </div>
          ))}
          <div className="mt-auto rounded-md border border-sand/10 px-2 py-1.5 text-[8.5px] text-sand/45">Personal details anonymized</div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function AssistantMockup() {
  return (
    <BrowserFrame url="assistant.company.app">
      <div className="grid h-[300px] grid-cols-1 sm:grid-cols-[1fr_120px]">
        <div className="flex min-w-0 flex-col gap-3 p-3.5">
          <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-sm bg-white/[0.07] px-3 py-2 text-[10px] text-slate-200">
            How many leave days can I carry forward to next year?
          </div>
          <div className="flex max-w-[90%] gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blaze/25">
              <Sparkles className="h-2.5 w-2.5 text-blaze" />
            </div>
            <div className="min-w-0 rounded-2xl rounded-tl-sm border border-sand/10 bg-white/[0.02] px-3 py-2.5">
              <div className="space-y-1.5">
                <Line w="210px" className="max-w-full" />
                <Line w="180px" className="max-w-full" />
                <Line w="120px" />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {["Leave-Policy.pdf · p.4", "HR-FAQ.docx"].map((s) => (
                  <span key={s} className="flex items-center gap-1 rounded border border-sand/10 px-1.5 py-0.5 text-[8.5px] text-muted">
                    <FileText className="h-2 w-2" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-auto flex items-center gap-2 rounded-xl border border-sand/10 bg-white/[0.03] px-3 py-2">
            <span className="text-[9.5px] text-sand/45">Ask about policies, SOPs, tickets…</span>
            <span className="ml-auto h-4 w-4 rounded-md bg-blaze" />
          </div>
        </div>
        <div className="hidden flex-col gap-3 border-l border-sand/10 p-3 sm:flex">
          <p className="text-[9px] text-sand/45">Channels</p>
          {[
            { icon: MessageSquare, l: "Web chat" },
            { icon: Hash, l: "Slack" },
            { icon: Users, l: "Teams" },
          ].map(({ icon: Icon, l }) => (
            <div key={l} className="flex items-center gap-1.5 text-[9.5px] text-slate-300">
              <Icon className="h-2.5 w-2.5 text-sand/45" />
              {l}
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          ))}
          <p className="mt-2 text-[9px] text-sand/45">Guardrails</p>
          {["Scope", "Tone", "Audit log"].map((g) => (
            <div key={g} className="flex items-center justify-between text-[9.5px] text-slate-300">
              {g}
              <span className="flex h-2.5 w-4.5 items-center rounded-full bg-blaze/70 px-px">
                <span className="ml-auto h-2 w-2 rounded-full bg-white" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

function HealthMockup() {
  return (
    <div className="flex h-[337px] items-center justify-center gap-6">
      <PhoneFrame>
        <div className="flex h-[318px] flex-col gap-2 overflow-hidden px-3 pt-8 pb-3">
          <p className="text-[9px] text-sand/45">Good morning</p>
          <Line w="55%" className="h-2.5 bg-slate-400/60" />
          <div className="mt-1 rounded-xl bg-gradient-to-br from-blaze/60 via-sea/50 to-transparent p-3">
            <p className="font-mono text-[8px] tracking-wider text-white uppercase">Health ID</p>
            <Line w="70%" className="mt-2 bg-white/40" />
            <Line w="45%" className="mt-1.5 bg-white/25" />
          </div>
          <p className="mt-1 text-[9px] text-sand/45">Upcoming</p>
          {[0].map((i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-sand/10 p-2">
              <div className="h-6 w-6 rounded-md bg-white/[0.06]" />
              <div className="flex-1 space-y-1">
                <Line w="70%" />
                <Line w="45%" />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2">
            {["Records", "Consents"].map((t) => (
              <div key={t} className="rounded-lg border border-sand/10 p-2">
                <ShieldCheck className="h-3 w-3 text-blaze" />
                <p className="mt-1.5 text-[8.5px] text-slate-300">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </PhoneFrame>
      <div className="hidden w-[150px] flex-col gap-2 sm:flex">
        {["FHIR resources", "ABDM M1 · M2 · M3", "PHR certified flows", "Secure REST APIs"].map((t) => (
          <div key={t} className="flex items-center gap-2 rounded-lg border border-sand/10 bg-white/[0.02] px-2.5 py-2 text-[10px] text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blaze" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

const mockups: Record<MockupKind, () => React.JSX.Element> = {
  crm: CrmMockup,
  legal: LegalMockup,
  assistant: AssistantMockup,
  health: HealthMockup,
};

export function ProjectMockup({ kind }: { kind: MockupKind }) {
  const Mockup = mockups[kind];
  return (
    <div aria-hidden className="pointer-events-none select-none">
      <Mockup />
    </div>
  );
}

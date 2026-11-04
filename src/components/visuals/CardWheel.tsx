import type { CSSProperties, ReactNode } from "react";
import { Emblem } from "../ui/Crosshairs";

type Card = { bg: string; fg: string; body: ReactNode; corner?: string };

const Tag = ({ children }: { children: ReactNode }) => <span className="label text-[8px] opacity-70">{children}</span>;

// Every figure on these cards comes from real project work; nothing is invented.
const cards: Card[] = [
  {
    bg: "bg-blaze",
    fg: "text-mirage",
    corner: "KC",
    body: <Emblem className="mx-auto h-[58%] w-[58%]" />,
  },
  {
    bg: "bg-mirage",
    fg: "text-sand",
    corner: "AI",
    body: (
      <div className="relative mx-auto aspect-square w-[78%] rounded-full">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,#fff_0%,#ffb27f_10%,#ff5b04_26%,#075056_55%,transparent_72%)] blur-[2px]" />
        <div className="absolute inset-[14%] rounded-full border border-sand/25" />
        <div className="absolute inset-[30%] rounded-full border border-sand/20" />
      </div>
    ),
  },
  {
    bg: "bg-paper",
    fg: "text-mirage",
    corner: "CRM",
    body: (
      <div className="w-full px-1">
        <p className="display text-[2.1em]">1.7M+</p>
        <p className="mt-2 text-[0.62em] leading-snug opacity-70">sales records in live analytics dashboards</p>
        <div className="mt-3 flex h-8 items-end gap-[3px]">
          {[40, 62, 50, 78, 66, 92, 84].map((h, i) => (
            <span key={i} className={`flex-1 ${i === 5 ? "bg-blaze" : "bg-mirage/80"}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    bg: "bg-sea",
    fg: "text-sand",
    corner: "LLM",
    body: (
      <div className="w-full px-1">
        <p className="display text-[2.6em]">RAG</p>
        <div className="mt-3 space-y-1.5">
          {["Ingest", "Embed", "Retrieve", "Answer + cite"].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5 text-[0.6em]">
              <span className="font-sans font-medium tabular-nums opacity-60">0{i + 1}</span>
              <span className="h-px flex-1 bg-sand/30" />
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    bg: "bg-mirage",
    fg: "text-sand",
    corner: "LAW",
    body: (
      <div className="w-full px-1">
        <p className="display text-[2.4em] text-blaze">24+1</p>
        <p className="mt-2 text-[0.62em] leading-snug opacity-75">High Courts and the Supreme Court of India, indexed for AI search</p>
      </div>
    ),
  },
  {
    bg: "bg-sand-2",
    fg: "text-mirage",
    corner: "WEB",
    body: (
      <div className="w-full rounded-md border border-mirage/15 bg-paper p-1.5">
        <div className="mb-1.5 flex gap-1">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-1 w-1 rounded-full bg-mirage/40" />
          ))}
        </div>
        <div className="h-8 rounded-sm bg-mirage" />
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          <div className="h-5 rounded-sm bg-blaze" />
          <div className="h-5 rounded-sm bg-mirage/15" />
          <div className="h-5 rounded-sm bg-sea/70" />
        </div>
      </div>
    ),
  },
  {
    bg: "bg-blaze",
    fg: "text-white",
    corner: "VENTURES",
    body: (
      <div className="w-full px-1">
        <p className="display text-[2.8em] text-mirage">20+</p>
        <p className="mt-2 text-[0.62em] leading-snug">products built inside a deep-tech &amp; AI venture studio</p>
      </div>
    ),
  },
  {
    bg: "bg-mirage",
    fg: "text-sand",
    corner: "APP",
    body: (
      <div className="mx-auto h-[86%] w-[52%] rounded-[10px] border-2 border-sand/70 p-1">
        <div className="h-3 rounded-sm bg-blaze" />
        <div className="mt-1 space-y-1">
          {[0, 1, 2].map((r) => (
            <div key={r} className="h-2.5 rounded-sm bg-sand/20" />
          ))}
        </div>
      </div>
    ),
  },
  {
    bg: "bg-paper",
    fg: "text-mirage",
    corner: "STACK",
    body: (
      <div className="w-full space-y-1 px-1 text-[0.66em] font-medium">
        {["React", "Node.js", "PostgreSQL", "Flutter", "AWS"].map((t, i) => (
          <div key={t} className="flex justify-between border-b border-mirage/15 pb-1">
            <span>{t}</span>
            <span className={i === 0 ? "text-blaze" : "opacity-40"}>●</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    bg: "bg-sea",
    fg: "text-sand",
    corner: "HEALTH",
    body: (
      <div className="w-full px-1">
        <p className="display text-[1.5em] leading-[1.05]">ABDM M1·M2·M3</p>
        <p className="mt-2 text-[0.62em] opacity-75">FHIR-aligned health workflows</p>
      </div>
    ),
  },
  {
    bg: "bg-mirage",
    fg: "text-sand",
    corner: "OPS",
    body: (
      <div className="w-full px-1 font-sans font-medium tabular-nums text-[0.58em] leading-relaxed">
        <p className="text-blaze">● deploy</p>
        <p className="opacity-70">docker · nginx</p>
        <p className="opacity-70">ec2 · ecs · rds · s3</p>
        <p className="opacity-70">ci/cd → prod</p>
      </div>
    ),
  },
  {
    bg: "bg-blaze",
    fg: "text-mirage",
    corner: "TOGETHER",
    body: (
      <p className="display px-1 text-[1.7em] leading-[0.95]">
        Let's
        <br />
        build
        <br />
        <span className="text-white">it ↗</span>
      </p>
    ),
  },
];

/** A fan of project cards orbiting a dial — a slowly rotating wheel; only its top half is on screen. */
export function CardWheel() {
  const step = 360 / cards.length;
  return (
    <div
      aria-hidden
      className="relative mx-auto w-full overflow-hidden select-none [--h:calc(var(--w)*1.36)] [--r:clamp(250px,36vw,500px)] [--w:clamp(112px,13vw,178px)]"
      style={{ height: "calc(var(--r) + var(--h) * 0.62)" } as CSSProperties}
    >
      {/* Dial */}
      <div
        className="absolute left-1/2 rounded-full border border-mirage/10 bg-gradient-to-b from-paper to-sand shadow-[inset_0_2px_30px_rgba(22,35,42,0.06)]"
        style={{
          width: "calc((var(--r) - var(--h) * 0.62) * 2)",
          height: "calc((var(--r) - var(--h) * 0.62) * 2)",
          top: "calc(100% - var(--r) + var(--h) * 0.62)",
          transform: "translateX(-50%)",
        }}
      >
        <svg viewBox="0 0 200 200" className="absolute inset-[6%] animate-spin-rev text-mirage/35">
          <defs>
            <path id="dial-ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
          </defs>
          <text fontSize="7.5" letterSpacing="3.2" fill="currentColor" fontFamily="var(--font-sans)">
            <textPath href="#dial-ring">KUNAL CHARDE · PORTFOLIO · FULL-STACK · AI · AUTOMATION · CLOUD ·</textPath>
          </text>
        </svg>
        <div className="absolute inset-[22%] rounded-full border border-dashed border-mirage/15" />
        <div className="absolute top-[27%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-mirage">
          <span className="text-[10px]">▲</span>
          <span className="label text-[13px]">Me</span>
        </div>
      </div>

      {/* Orbit */}
      <div className="absolute top-full left-1/2 h-0 w-0 animate-spin-slow hover:[animation-play-state:paused]">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`absolute flex flex-col overflow-hidden rounded-[14px] p-[0.7em] text-[clamp(10px,1.05vw,14px)] shadow-[0_18px_40px_-14px_rgba(22,35,42,0.45)] ${c.bg} ${c.fg}`}
            style={{
              width: "var(--w)",
              height: "var(--h)",
              left: "calc(var(--w) / -2)",
              top: "calc(var(--h) / -2)",
              transform: `rotate(${i * step}deg) translateY(calc(-1 * var(--r)))`,
            }}
          >
            <div className="flex items-start justify-between">
              <Tag>{c.corner}</Tag>
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
            </div>
            <div className="flex flex-1 items-center">{c.body}</div>
            <div className="flex items-end justify-between">
              <Tag>KC/{String(i + 1).padStart(2, "0")}</Tag>
              <Tag>'{String(new Date().getFullYear()).slice(2)}</Tag>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useViewport } from "../../lib/useViewport";
import { Emblem } from "../ui/Crosshairs";

/* Editorial "pitch deck" slides that travel along a curved arc as the page scrolls. */

function SlideChrome({ children, tone, tag }: { children: ReactNode; tone: "light" | "dark"; tag: string }) {
  const dim = tone === "dark" ? "text-sand/55" : "text-mirage/55";
  return (
    <div className="flex h-full flex-col p-[4.5%]">
      <div className={`flex items-center justify-between ${dim}`}>
        <div className="flex items-center gap-2">
          <Emblem className="h-4 w-4" />
          <span className="label text-[8px]">Kunal Charde</span>
        </div>
        <span className="label text-[8px]">{tag}</span>
      </div>
      <div className="relative flex-1">{children}</div>
      <div className={`flex justify-between font-sans font-medium tabular-nums text-[8px] tracking-widest uppercase ${dim}`}>
        <span>Portfolio</span>
        <span>Full-stack · AI</span>
      </div>
    </div>
  );
}

const Row = ({ k, children, tone }: { k: string; children: ReactNode; tone: "light" | "dark" }) => (
  <div className={`grid grid-cols-[38%_1fr] items-start gap-3 border-t py-[2.2%] ${tone === "dark" ? "border-sand/15" : "border-mirage/15"}`}>
    <span className="label text-[clamp(9px,1.05vw,13px)]">{k}</span>
    <span className="text-[clamp(8px,0.85vw,11px)] leading-snug opacity-75">{children}</span>
  </div>
);

const slides: { cls: string; node: ReactNode }[] = [
  {
    cls: "bg-blaze text-white",
    node: (
      <SlideChrome tone="dark" tag="Selected work">
        <span className="display absolute -top-[6%] right-0 text-[clamp(7rem,19vw,17rem)] leading-none text-sand/90">4</span>
        <div className="absolute bottom-[6%] left-0 max-w-[48%]">
          <p className="label text-[clamp(10px,1.2vw,15px)]">Case studies</p>
          <p className="mt-2 text-[clamp(9px,0.9vw,12px)] leading-snug opacity-85">
            Enterprise software, legal AI, knowledge assistants and healthcare. Each one built end to end and looked after all the way to launch.
          </p>
        </div>
      </SlideChrome>
    ),
  },
  {
    cls: "bg-mirage text-sand",
    node: (
      <SlideChrome tone="dark" tag="Process">
        <div className="absolute inset-0 flex flex-col justify-center">
          {["Discover", "Architect", "Build", "Deploy"].map((w, i) => (
            <div key={w} className="flex items-baseline gap-[3%] border-b border-sand/10 py-[0.6%]">
              <span className="w-[5%] font-sans font-medium tabular-nums text-[clamp(8px,0.8vw,11px)] text-blaze">0{i + 1}</span>
              <span className={`display text-[clamp(1.4rem,4.1vw,3.6rem)] ${i > 1 ? "text-outline text-sand/70" : ""}`}>{w}</span>
            </div>
          ))}
        </div>
      </SlideChrome>
    ),
  },
  {
    cls: "bg-paper text-mirage",
    node: (
      <SlideChrome tone="light" tag="01 · Enterprise CRM">
        <div className="absolute inset-0 grid grid-cols-[1.25fr_1fr] gap-[5%] pt-[5%]">
          <div>
            <p className="display text-[clamp(1.1rem,2.6vw,2.3rem)]">Enterprise CRM</p>
            <div className="mt-[6%]">
              <Row k="Problem" tone="light">Sales, sampling and approvals spread across fragmented processes.</Row>
              <Row k="Built" tone="light">Web app, Flutter field app and Node/Postgres backend with SAP sync.</Row>
              <Row k="Scale" tone="light">Analytics over 1.7M+ sales records.</Row>
            </div>
          </div>
          <div className="flex flex-col gap-[4%] rounded-md bg-mirage p-[6%]">
            <div className="h-[16%] rounded-sm bg-sand/15" />
            <div className="flex flex-1 items-end gap-[4%]">
              {[38, 55, 47, 70, 62, 84, 76, 95].map((h, i) => (
                <span key={i} className={`flex-1 rounded-t-sm ${i === 7 ? "bg-blaze" : "bg-sand/60"}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </SlideChrome>
    ),
  },
  {
    cls: "bg-mirage text-sand",
    node: (
      <SlideChrome tone="dark" tag="By the numbers">
        <div className="absolute inset-0 grid grid-cols-[1fr_1fr] gap-[5%] pt-[5%]">
          <div className="grid grid-cols-2 gap-[6%]">
            {[
              ["1.7M+", "sales records in analytics"],
              ["24+1", "courts indexed for AI search"],
              ["20+", "venture products shipped on"],
              ["3+", "years in production"],
            ].map(([n, l], i) => (
              <div key={n} className="border-t border-sand/15 pt-[8%]">
                <p className={`display text-[clamp(1.2rem,2.6vw,2.4rem)] ${i === 0 ? "text-blaze" : ""}`}>{n}</p>
                <p className="mt-1 text-[clamp(8px,0.8vw,11px)] opacity-65">{l}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-end">
            <div className="mb-[6%] flex gap-[3%]">
              <span className="h-3 flex-1 bg-blaze" />
              <span className="h-3 flex-1 bg-blaze/70" />
              <span className="h-3 flex-1 bg-sand" />
              <span className="h-3 w-3 bg-sea" />
            </div>
            {["Legal tech", "Healthcare", "Enterprise CRM", "FinTech", "AI infrastructure"].map((d, i) => (
              <div key={d} className="flex justify-between border-t border-sand/10 py-[1.2%] text-[clamp(8px,0.85vw,11px)]">
                <span className="label text-[clamp(8px,0.85vw,11px)]">{d}</span>
                <span className="font-sans font-medium tabular-nums opacity-50">0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </SlideChrome>
    ),
  },
  {
    cls: "bg-sea text-sand",
    node: (
      <SlideChrome tone="dark" tag="02 · Legal AI">
        <div className="absolute inset-0 flex flex-col justify-between pt-[5%]">
          <p className="display max-w-[80%] text-[clamp(1.4rem,3.6vw,3.2rem)]">
            Legal document <span className="text-blaze">intelligence</span>
          </p>
          <div className="grid grid-cols-3 gap-[4%]">
            {["Scrape & normalize judgments", "Index, search & summarize", "Answer on web & WhatsApp"].map((s, i) => (
              <div key={s} className="border-t border-sand/25 pt-[6%] text-[clamp(8px,0.85vw,11px)] leading-snug">
                <span className="mb-1 block font-sans font-medium tabular-nums text-blaze">0{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </SlideChrome>
    ),
  },
  {
    cls: "bg-paper text-mirage",
    node: (
      <SlideChrome tone="light" tag="03 · Knowledge assistant">
        <div className="absolute inset-0 grid grid-cols-[1fr_1.1fr] gap-[5%] pt-[5%]">
          <div className="flex flex-col justify-center gap-[5%] rounded-md bg-sand-2 p-[6%]">
            <div className="ml-auto w-[75%] rounded-lg bg-mirage px-[6%] py-[4%] text-[clamp(7px,0.75vw,10px)] text-sand">
              What's our leave carry-forward policy?
            </div>
            <div className="w-[85%] rounded-lg border border-mirage/15 bg-paper px-[6%] py-[5%]">
              <div className="h-1.5 w-full rounded-full bg-mirage/25" />
              <div className="mt-1.5 h-1.5 w-[70%] rounded-full bg-mirage/25" />
              <span className="mt-2 inline-block rounded bg-blaze/15 px-1.5 py-0.5 font-sans font-medium tabular-nums text-[clamp(6px,0.6vw,8px)] text-blaze-ink">
                policy.pdf · p.4
              </span>
            </div>
          </div>
          <div>
            <p className="display text-[clamp(1.1rem,2.5vw,2.2rem)]">RAG assistant</p>
            <div className="mt-[6%]">
              <Row k="Ingest" tone="light">PDF, DOCX, CSV, SOPs, FAQs and tickets.</Row>
              <Row k="Govern" tone="light">Guardrails, audit logs, analytics.</Row>
              <Row k="Deploy" tone="light">Web chat, Slack, Teams, CRMs.</Row>
            </div>
          </div>
        </div>
      </SlideChrome>
    ),
  },
  {
    cls: "bg-blaze text-white",
    node: (
      <SlideChrome tone="dark" tag="Let's build">
        <p className="absolute top-[8%] left-0 max-w-[42%] text-[clamp(9px,0.9vw,12px)] leading-snug opacity-90">
          Web apps, AI and automation, shaped together with you and cared for long after launch.
        </p>
        <span className="display absolute right-[-2%] bottom-[-4%] text-[clamp(2.6rem,7.6vw,6.8rem)] leading-none whitespace-nowrap text-mirage normal-case">
          Kunal C.
        </span>
      </SlideChrome>
    ),
  },
];

function ArcSlide({ i, total, progress, w, h, children, cls }: {
  i: number;
  total: number;
  progress: MotionValue<number>;
  w: number;
  h: number;
  children: ReactNode;
  cls: string;
}) {
  const mobile = w < 768;
  const cardW = mobile ? w * 0.84 : Math.min(w * 0.5, 700);
  const cardH = cardW * 0.62;
  const R = h * (mobile ? 2.2 : 1.25);
  const stepRad = (cardH * 0.8) / R; // neighbouring slides overlap like a fanned deck

  // t = this slide's distance (in slides) from the centre of the arc.
  const t = useTransform(progress, (p) => i - p * (total - 1));
  const a = useTransform(t, (v) => v * stepRad);
  const x = useTransform(a, (v) => R - R * Math.cos(v) - cardW / 2);
  const y = useTransform(a, (v) => R * Math.sin(v) - cardH / 2);
  const rotate = useTransform(a, (v) => (v * 180) / Math.PI);
  const rotateY = useTransform(t, (v) => v * -4);
  const opacity = useTransform(t, (v) => (Math.abs(v) > 3.4 ? 0 : 1));

  return (
    <motion.div
      className={`absolute top-1/2 left-1/2 overflow-hidden rounded-[10px] shadow-[0_30px_60px_-20px_rgba(22,35,42,0.55)] ${cls}`}
      style={{ width: cardW, height: cardH, x, y, rotate, rotateY, opacity, zIndex: i }}
    >
      {children}
    </motion.div>
  );
}

export function Showreel() {
  const ref = useRef<HTMLDivElement>(null);
  const { w, h } = useViewport();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  if (reduced) {
    return (
      <div className="container-page grid gap-6 py-16 md:grid-cols-2" aria-hidden>
        {slides.map((s, i) => (
          <div key={i} className={`aspect-[1/0.62] overflow-hidden rounded-[10px] ${s.cls}`}>
            {s.node}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[340vh]" aria-hidden>
      <div className="sticky top-0 h-screen overflow-hidden bg-[radial-gradient(ellipse_at_40%_45%,#eef4f5_0%,#d5e1e4_60%,#c3d2d6_100%)] [perspective:1600px]">
        {slides.map((s, i) => (
          <ArcSlide key={i} i={i} total={slides.length} progress={scrollYProgress} w={w} h={h} cls={s.cls}>
            {s.node}
          </ArcSlide>
        ))}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-sans font-medium tabular-nums text-[10px] tracking-[0.2em] text-mirage/50 uppercase">
          Scroll ↓
        </div>
      </div>
    </div>
  );
}

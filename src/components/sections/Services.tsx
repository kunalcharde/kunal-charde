import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { services, type Service } from "../../data/content";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

// Card colour per service, cycling through the palette.
const tones = [
  { card: "bg-blaze text-mirage", soft: "bg-mirage/10", chip: "border-mirage/25", muted: "text-mirage/75" },
  { card: "bg-sea text-sand", soft: "bg-sand/10", chip: "border-sand/25", muted: "text-sand/75" },
  { card: "bg-mirage-2 text-sand", soft: "bg-sand/[0.07]", chip: "border-sand/20", muted: "text-sand/70" },
  { card: "bg-paper text-mirage ring-1 ring-mirage/10", soft: "bg-mirage/[0.06]", chip: "border-mirage/20", muted: "text-muted" },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// Each card rests for a while at its slot; the move happens in the middle 60% of its scroll segment.
const settle = (x: number) => clamp01((x - 0.2) / 0.6);

function CardBody({ s, i }: { s: Service; i: number }) {
  const t = tones[i % tones.length];
  return (
    <div className={`grid h-full gap-8 rounded-[28px] p-7 shadow-[0_40px_80px_-40px_rgba(22,35,42,0.55)] sm:p-10 md:grid-cols-[1.35fr_1fr] lg:p-12 ${t.card}`}>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className="label text-[11px] opacity-70">Services</span>
          <span className="font-mono text-sm opacity-70">({String(i + 1).padStart(2, "0")})</span>
        </div>
        <h3 className="display mt-6 text-[1.9rem] text-balance sm:text-5xl">{s.title}</h3>
        <p className={`mt-5 max-w-xl text-[15px] leading-relaxed sm:text-lg ${t.muted}`}>{s.description}</p>
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {s.items.map((item) => (
            <li key={item} className={`rounded-full border px-3 py-1.5 text-xs sm:text-[13px] ${t.chip}`}>
              {item}
            </li>
          ))}
        </ul>
        <Link
          to="/contact"
          className="group mt-auto inline-flex items-center gap-2 self-start pt-8 text-sm font-medium"
        >
          Tell me about it
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-current/30 transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      {/* Visual: the service icon inside soft rings */}
      <div aria-hidden className={`relative hidden items-center justify-center overflow-hidden rounded-[22px] md:flex ${t.soft}`}>
        <span className="absolute h-[78%] w-[78%] rounded-full border border-current opacity-10" />
        <span className="absolute h-[56%] w-[56%] rounded-full border border-current opacity-15" />
        <span className="absolute h-[34%] w-[34%] rounded-full border border-dashed border-current opacity-25" />
        <s.icon className="relative h-20 w-20 lg:h-24 lg:w-24" strokeWidth={1.25} />
        <span className="display absolute right-5 bottom-3 text-[5rem] leading-none opacity-10">{String(i + 1).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

function StackCard({ s, i, n, progress }: { s: Service; i: number; n: number; progress: MotionValue<number> }) {
  // t: 0 when this card is in place, negative while it waits below, positive as it leaves upwards.
  const t = useTransform(progress, (v) => v * (n - 1) - i);
  const y = useTransform(t, (v) => (v < 0 ? `${(1 - settle(1 + v)) * 120}%` : `${-settle(v) * 118}%`));
  const rotateX = useTransform(t, (v) => (v > 0 ? settle(v) * 38 : 0));
  const scale = useTransform(t, (v) => (v > 0 ? 1 - settle(v) * 0.08 : 1));
  const visibility = useTransform(t, (v) => (v < -1.05 || v > 1.05 ? "hidden" : "visible"));

  return (
    <motion.div className="absolute inset-0" style={{ y, rotateX, scale, visibility, zIndex: n - i, transformPerspective: 1400 }}>
      <CardBody s={s} i={i} />
    </motion.div>
  );
}

/** Service cards stacked in one spot; scrolling tilts the current card back and lifts it away to reveal the next. */
function ServiceStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = services.length;

  return (
    <div ref={ref} className="relative" style={{ height: `${n * 85 + 15}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container-page relative h-[76vh] max-h-[720px] sm:h-[70vh]">
          {services.map((s, i) => (
            <StackCard key={s.title} s={s} i={i} n={n} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Services() {
  const reduced = useReducedMotion();
  return (
    <section id="services" aria-labelledby="services-title" className="pt-24 pb-10 md:pt-32">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="services-title"
            eyebrow="Services"
            title={
              <>
                What we can <span className="text-blaze">build</span> together
              </>
            }
            lead="Whether it's a first small version or a full platform, we'll shape it around the problem you care about, and I'll keep looking after it once it's live."
          />
          <Reveal delay={0.1} className="shrink-0">
            <ButtonLink href="/contact" variant="secondary">
              Tell me about your idea
              <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
        </div>
      </div>

      {reduced ? (
        // Reduced motion: the same cards, simply stacked down the page.
        <ul className="container-page mt-14 space-y-6">
          {services.map((s, i) => (
            <li key={s.title}>
              <CardBody s={s} i={i} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <ServiceStack />
        </div>
      )}
    </section>
  );
}

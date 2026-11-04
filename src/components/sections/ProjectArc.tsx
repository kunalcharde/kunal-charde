import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { projectNotes } from "../../data/content";
import { useViewport } from "../../lib/useViewport";
import { Reveal } from "../ui/Reveal";

type Note = (typeof projectNotes)[number];

const tones = [
  "bg-paper text-mirage ring-1 ring-mirage/10",
  "bg-mirage-2 text-sand",
  "bg-sand-2 text-mirage ring-1 ring-mirage/10",
  "bg-sea text-sand",
];

const DEG_PER_SEC = 2.6;

function NoteCard({ note, i }: { note: Note; i: number }) {
  return (
    <div className={`flex h-full flex-col rounded-[22px] p-6 shadow-[0_28px_50px_-30px_rgba(22,35,42,0.55)] ${tones[i % tones.length]}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="label text-[10px] opacity-70">{note.sector}</span>
        <span className="font-sans font-medium tabular-nums text-[11px] opacity-50">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <p className="mt-6 text-[17px] leading-snug sm:text-lg">{note.text}</p>
      <span className="mt-auto inline-flex self-start rounded-full border border-current/25 px-2.5 py-1 text-[11px] opacity-80">{note.kind}</span>
    </div>
  );
}

function ArcCard({
  note,
  i,
  offset,
  step,
  span,
  radius,
  edge,
  w,
  h,
}: {
  note: Note;
  i: number;
  offset: MotionValue<number>;
  step: number;
  span: number;
  radius: number;
  edge: number;
  w: number;
  h: number;
}) {
  // Angle on the wheel, wrapped so cards leaving one side re-enter on the other.
  const angle = useTransform(offset, (o) => ((((i * step - o) % span) + span) % span) - span / 2);
  const transform = useTransform(angle, (a) => `rotate(${a}deg) translateY(${-radius}px)`);
  const opacity = useTransform(angle, (a) => Math.max(0, Math.min(1, (edge - Math.abs(a)) / 6)));
  const visibility = useTransform(angle, (a) => (Math.abs(a) > edge ? "hidden" : "visible"));

  return (
    <motion.div className="absolute" style={{ width: w, height: h, left: -w / 2, top: -h / 2, transform, opacity, visibility }}>
      <NoteCard note={note} i={i} />
    </motion.div>
  );
}

/** Project notes standing on a huge, slow-turning wheel; only the top of the arc is on screen. */
export function ProjectArc() {
  const ref = useRef<HTMLElement>(null);
  const paused = useRef(false);
  const inView = useInView(ref, { amount: 0.2 });
  const reduced = useReducedMotion();
  const { w: vw } = useViewport();
  const offset = useMotionValue(0);

  const mobile = vw < 768;
  const cardW = mobile ? 236 : 290;
  const cardH = mobile ? 300 : 360;
  const radius = mobile ? 900 : 1500;
  const step = (((cardW + (mobile ? 22 : 30)) / radius) * 180) / Math.PI;
  const span = step * projectNotes.length;
  // Hide cards once they're past the screen edge (plus a margin).
  const edge = Math.min(span / 2 - step / 2, (Math.asin(Math.min(1, (vw / 2 + cardW) / radius)) * 180) / Math.PI);
  const centerY = 56 + radius + cardH / 2;
  const height = 56 + cardH + radius * (1 - Math.cos((Math.min(edge, 40) * Math.PI) / 180)) + 40;

  useAnimationFrame((_, delta) => {
    if (reduced || paused.current || !inView) return;
    offset.set(offset.get() + (delta / 1000) * DEG_PER_SEC);
  });

  return (
    <section ref={ref} aria-labelledby="arc-title" className="overflow-hidden pt-20 pb-6 md:pt-28">
      <Reveal className="container-page">
        <h2 id="arc-title" className="display text-4xl leading-[0.95] sm:text-6xl">
          Trusted with
          <br />
          <span className="text-subtle">25+ projects</span>
        </h2>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
          A few of the things we've built together, across law, health, finance and more.
        </p>
      </Reveal>

      {reduced ? (
        <ul className="container-page mt-10 flex snap-x gap-4 overflow-x-auto pb-4">
          {projectNotes.map((n, i) => (
            <li key={i} className="shrink-0 snap-start" style={{ width: cardW, height: cardH }}>
              <NoteCard note={n} i={i} />
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="relative mt-4"
          style={{ height }}
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          {/* The list stays readable in order for screen readers; the wheel is just its presentation. */}
          <ul className="sr-only">
            {projectNotes.map((n, i) => (
              <li key={i}>
                {n.sector}, {n.kind}: {n.text}
              </li>
            ))}
          </ul>
          <div aria-hidden className="absolute left-1/2 h-0 w-0" style={{ top: centerY }}>
            {projectNotes.map((n, i) => (
              <ArcCard
                key={i}
                note={n}
                i={i}
                offset={offset}
                step={step}
                span={span}
                radius={radius}
                edge={edge}
                w={cardW}
                h={cardH}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ArchLayer, CaseStudyDetail } from "../../data/caseStudyDetails";

type Tone = NonNullable<ArchLayer["tone"]> | "default";

// Chip styles on the dark canvas: quiet when the layer is idle, bright when the request passes through it.
const chips: Record<Tone, { idle: string; on: string }> = {
  default: { idle: "border-sand/15 bg-sand/[0.06] text-sand/75", on: "border-paper bg-paper text-mirage" },
  core: { idle: "border-blaze/40 bg-blaze/15 text-[#ffb27f]", on: "border-blaze bg-blaze text-white" },
  external: { idle: "border-dashed border-sand/30 bg-transparent text-sand/65", on: "border-dashed border-sand bg-sand/10 text-sand" },
  infra: { idle: "border-transparent bg-sand/10 text-sand/65", on: "border-sand bg-sand text-mirage" },
};

const STEP_MS = 3600;

type Props = { layers: ArchLayer[]; flow: CaseStudyDetail["flow"] };

/**
 * The system drawn as a metro line: each layer is a station on a rail, and a glowing request token travels between the
 * stations a step touches, lighting those layers up. A narration panel tells the step alongside, with play/pause and
 * previous/next. Auto-plays while on screen.
 */
export function ArchitectureDiagram({ layers, flow }: Props) {
  const ref = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const laneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [centers, setCenters] = useState<number[]>([]);

  // Vertical centre of each lane, measured so the token and the lit rail segment line up with the stations.
  useLayoutEffect(() => {
    // Measured against the rail's own box (not offsetTop), so entrance animations on the rows can't skew it.
    const measure = () => {
      const rail = railRef.current?.getBoundingClientRect();
      if (!rail) return;
      setCenters(
        laneRefs.current.map((el) => {
          if (!el) return 0;
          const r = el.getBoundingClientRect();
          return r.top - rail.top + r.height / 2;
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (railRef.current) ro.observe(railRef.current);
    return () => ro.disconnect();
  }, [layers]);

  useEffect(() => {
    if (!playing || !inView) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % flow.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, inView, step, flow.length]);

  const go = (s: number) => setStep((s + flow.length) % flow.length);
  const at = [...flow[step].at].sort((a, b) => a - b);
  const active = new Set(at);
  const lo = at[0];
  const hi = at[at.length - 1];
  const ready = centers.length === layers.length && centers.every((c) => c > 0);

  // The token jumps to the first station of the step, then glides down to the last one (plain CSS transition).
  const [token, setToken] = useState({ top: 0, glide: false });
  useEffect(() => {
    if (!ready) return;
    setToken({ top: centers[lo], glide: false });
    const t = window.setTimeout(() => setToken({ top: centers[hi], glide: true }), 60);
    return () => window.clearTimeout(t);
  }, [ready, centers, lo, hi, step]);
  const glideSeconds = Math.max(0.5, (hi - lo) * 0.45);

  return (
    <figure ref={ref} className="overflow-hidden rounded-[22px] border border-mirage/15 bg-paper">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Canvas */}
        <div
          className="relative bg-mirage p-5 sm:p-7"
          style={{ backgroundImage: "radial-gradient(rgba(228,238,240,0.09) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
        >
          <div ref={railRef} className="relative">
            {/* Rail */}
            {ready && (
              <>
                <span
                  aria-hidden
                  className="absolute left-[11px] w-[2px] rounded-full bg-sand/15"
                  style={{ top: centers[0], height: centers[centers.length - 1] - centers[0] }}
                />
                <span
                  aria-hidden
                  data-rail-lit
                  className="absolute left-[11px] w-[2px] rounded-full bg-blaze shadow-[0_0_12px_rgba(255,91,4,0.7)] transition-[top,height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ top: centers[lo], height: Math.max(0, centers[hi] - centers[lo]) }}
                />
                {/* Request token */}
                <span
                  aria-hidden
                  data-token
                  className="absolute left-[3px] z-10 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-blaze shadow-[0_0_0_4px_rgba(255,91,4,0.25),0_0_18px_rgba(255,91,4,0.9)]"
                  style={{
                    top: token.top,
                    transition: token.glide ? `top ${glideSeconds}s cubic-bezier(0.45, 0, 0.25, 1)` : "none",
                  }}
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-blaze/60" />
                </span>
              </>
            )}

            <ol className="space-y-3">
              {layers.map((layer, i) => {
                const on = active.has(i);
                const tone = chips[layer.tone ?? "default"];
                return (
                  <motion.li
                    key={layer.name}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-[24px_1fr] items-center gap-4"
                  >
                    {/* Station */}
                    <span className="relative flex justify-center">
                      <span
                        className={`h-3 w-3 rounded-full border-2 transition-colors duration-500 ${
                          on ? "border-blaze bg-mirage" : "border-sand/30 bg-mirage"
                        }`}
                      />
                    </span>
                    <div
                      ref={(el) => {
                        laneRefs.current[i] = el;
                      }}
                      className={`rounded-xl border px-3.5 py-3 transition-all duration-500 ${
                        on ? "border-blaze/60 bg-blaze/[0.08] shadow-[0_0_24px_-8px_rgba(255,91,4,0.6)]" : "border-sand/10 bg-sand/[0.03]"
                      }`}
                    >
                      <p
                        className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-500 ${
                          on ? "text-blaze" : "text-sand/45"
                        }`}
                      >
                        {layer.name}
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {layer.nodes.map((n, k) => (
                          <motion.li
                            key={`${n}-${on ? step : "idle"}`}
                            initial={on ? { scale: 0.9, y: 2 } : false}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 16, delay: on ? 0.15 + k * 0.05 : 0 }}
                            whileHover={{ y: -2 }}
                            className={`cursor-default rounded-md border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors duration-500 ${
                              on ? tone.on : tone.idle
                            }`}
                          >
                            {n}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Narration */}
        <div className="flex flex-col border-t border-mirage/10 p-6 lg:border-t-0 lg:border-l">
          <p className="label text-[11px] text-subtle">How a request moves through it</p>
          <p className="mt-5 font-mono text-sm">
            <span className="text-2xl text-blaze-ink">{String(step + 1).padStart(2, "0")}</span>
            <span className="text-subtle"> / {String(flow.length).padStart(2, "0")}</span>
          </p>

          <div className="relative mt-4 min-h-[8.5rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-lg leading-relaxed text-mirage">{flow[step].text}</p>
                <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-subtle">
                  {at.map((i, k) => (
                    <span key={i} className="flex items-center gap-1.5">
                      {k > 0 && <span aria-hidden>→</span>}
                      <span className="rounded-full bg-blaze/10 px-2 py-0.5 font-mono text-blaze-ink">{layers[i].name}</span>
                    </span>
                  ))}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Segmented progress */}
          <div className="mt-6 flex gap-1.5" role="tablist" aria-label="Steps">
            {flow.map((f, i) => (
              <button
                key={f.text}
                type="button"
                role="tab"
                aria-selected={i === step}
                aria-label={`Step ${i + 1}`}
                onClick={() => go(i)}
                className="group relative h-6 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-mirage/10 transition-colors group-hover:bg-mirage/20">
                  {i < step && <span className="absolute inset-0 bg-blaze/50" />}
                  {i === step && (
                    <motion.span
                      key={`${step}-${playing && inView}`}
                      className="absolute inset-0 origin-left bg-blaze"
                      initial={{ scaleX: playing && inView ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: playing && inView ? STEP_MS / 1000 : 0, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 lg:mt-auto lg:pt-6">
            <button
              type="button"
              onClick={() => go(step - 1)}
              aria-label="Previous step"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-mirage/20 transition-colors hover:border-mirage hover:bg-mirage hover:text-sand"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-mirage text-sm font-medium text-sand transition-colors hover:bg-blaze"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => go(step + 1)}
              aria-label="Next step"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-mirage/20 transition-colors hover:border-mirage hover:bg-mirage hover:text-sand"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-mirage/10 px-5 py-3.5 text-xs text-subtle sm:px-7">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-blaze" /> Core of the system
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border border-dashed border-mirage/50" /> Outside systems
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-mirage" /> Infrastructure
        </span>
        <span className="sm:ml-auto">Simplified to keep client details private.</span>
      </figcaption>
    </figure>
  );
}

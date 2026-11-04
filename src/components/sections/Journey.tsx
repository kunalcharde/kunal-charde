import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { milestones, profile, services } from "../../data/content";
import { useViewport } from "../../lib/useViewport";
import { ButtonLink } from "../ui/Button";
import { SHIP, SideContainer, SideTruck, TopContainer, TopShip, TopTruck } from "../visuals/JourneyArt";

/*
  "How your idea ships": a scroll-scrubbed story told with freight, because software ships in containers too.

  01 Dock         a CI/CD crane loads YOUR-IDEA onto the truck
  02 Road         the truck rolls past everything I build (the cargo manifest)
  03 Checkpoints  top-down: the road turns and every gate lifts as the work passes it
  04 Port         the container is craned onto a ship stacked with the rest of the system
  05 Production   the ship sails out
*/

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Scroll timeline (fractions of the section's scroll distance).
const T = {
  load: [0.02, 0.09],
  craneOut: [0.09, 0.13],
  pan: [0.13, 0.2],
  marquee: [0.13, 0.4],
  manifest: [0.19, 0.37],
  driveOff: [0.35, 0.41],
  fill: [0.36, 0.42],
  world: 0.42,
  reveal: [0.42, 0.47],
  travel: [0.42, 0.85],
  heading: [0.55, 0.58, 0.82, 0.85],
  transfer: [0.86, 0.91],
  panSea: [0.89, 0.95],
  sail: [0.91, 0.995],
  finale: [0.93, 0.97],
} as const;

const HERO_TITLE = `${profile.name}, ${profile.role}. Turning ideas into scalable digital products, together.`;

const chapters = [
  { at: 0, label: "Dock" },
  { at: 0.13, label: "Road" },
  { at: 0.42, label: "Checkpoints" },
  { at: 0.85, label: "Port" },
  { at: 0.93, label: "Production" },
];

function geometry(w: number, h: number) {
  const mobile = w < 768;

  // Side view
  const TW = mobile ? w * 0.92 : Math.min(w * 0.56, 800);
  const TH = TW * 0.3;
  const groundY = h * (mobile ? 0.64 : 0.74);
  const truckX = (w - TW) / 2;
  const CW = TW * 0.7;
  const CH = (CW * 128) / 420;
  const conX = truckX + TW * (20 / 600);
  const restTop = groundY - TH + TH * (140 / 180) - CH;
  const beamY = groundY - TH - CH - h * 0.14;
  const beamH = Math.max(10, TW * 0.032);
  const liftTop = beamY + beamH + h * 0.04;
  const panTo = h * (mobile ? 0.3 : 0.34);
  const panBy = groundY - panTo;

  // Top-down world
  const cx = mobile ? w * 0.15 : w * 0.5;
  const rw = mobile ? 50 : 92;
  const y0 = h * 0.3;
  const R = mobile ? w * 0.1 : Math.min(w * 0.13, h * 0.22);
  const xStart = -w * 0.15;
  const Lh = cx - R - xStart;
  const La = (Math.PI * R) / 2;
  const L = h * 3.4;
  const pierY = y0 + R + L;
  const truckLen = rw * 1.9;
  const truckWid = rw * 0.62;
  const S = Lh + La + L - truckLen * 0.75;
  const truckEndY = y0 + R + (S - Lh - La);

  // Port
  const shipW = mobile ? w * 0.34 : Math.min(200, w * 0.14);
  const shipH = (shipW * SHIP.h) / SHIP.w;
  const shipX = cx + rw / 2 + (mobile ? 12 : 36);
  const slotCx = shipX + ((SHIP.col0 + 2 + SHIP.slotW / 2) / SHIP.w) * shipW;
  const slotCyRel = ((SHIP.row0 + 3 + SHIP.slotH / 2) / SHIP.h) * shipH;
  const shipY = truckEndY - slotCyRel;
  const seaTop = shipY - h * 0.06;

  const firstGate = y0 + R + h * 0.5;
  const lastGate = seaTop - h * 0.45;
  const gates = milestones.map((_, i) => lerp(firstGate, lastGate, i / (milestones.length - 1)));
  const cardW = mobile ? w - (cx + rw / 2 + 14) - 14 : Math.min(380, w * 0.3);

  return {
    h, mobile, TW, TH, groundY, truckX, CW, CH, conX, restTop, beamY, beamH, liftTop, panTo, panBy,
    cx, rw, y0, R, xStart, Lh, La, L, pierY, truckLen, truckWid, S, truckEndY,
    shipW, shipH, shipX, shipY, slotCx, slotCyRel, seaTop, gates, cardW,
  };
}
type Geo = ReturnType<typeof geometry>;

/** Position and heading of the truck after travelling `s` px along the road. */
function pathAt(g: Geo, s: number) {
  if (s < g.Lh) return { x: g.xStart + s, y: g.y0, a: 0 };
  if (s < g.Lh + g.La) {
    const t = (s - g.Lh) / g.R;
    return { x: g.cx - g.R + g.R * Math.sin(t), y: g.y0 + g.R - g.R * Math.cos(t), a: (t * 180) / Math.PI };
  }
  return { x: g.cx, y: g.y0 + g.R + (s - g.Lh - g.La), a: 90 };
}

const travelS = (g: Geo, p: number) => {
  const t = seg(p, T.travel[0], T.travel[1]);
  return g.S * (0.65 * t + 0.35 * t * t * (3 - 2 * t));
};

const camera = (g: Geo, p: number) => {
  const truckY = pathAt(g, travelS(g, p)).y;
  // Keep the truck ~45% down the screen once it's past the turn, then drift down over the sea at the end.
  const follow = Math.min(Math.max(0, truckY - g.h * 0.45), g.truckEndY - g.h * 0.45);
  return follow + ease(seg(p, T.panSea[0], T.panSea[1])) * (g.mobile ? 0.45 : 0.55) * g.h;
};

/* ------------------------------------------------------------------ */
/* 01–02: side view                                                    */
/* ------------------------------------------------------------------ */

function SideScene({ p, g, w, h }: { p: MotionValue<number>; g: Geo; w: number; h: number }) {
  const spin = useTransform(p, (v) => v * 9000);
  const conTop = useTransform(p, (v) => lerp(g.liftTop, g.restTop, ease(seg(v, T.load[0], T.load[1]))));
  const cableH = useTransform(conTop, (v) => Math.max(0, v - (g.beamY + g.beamH * 1.8)));
  const craneY = useTransform(p, (v) => -ease(seg(v, T.craneOut[0], T.craneOut[1])) * h);
  const layerY = useTransform(p, (v) => -ease(seg(v, T.pan[0], T.pan[1])) * g.panBy);
  const truckDX = useTransform(p, (v) => ease(seg(v, T.driveOff[0], T.driveOff[1])) * w);
  const marqueeX = useTransform(p, (v) => lerp(w * 0.7, -w * 1.9, seg(v, T.marquee[0], T.marquee[1])));
  const marqueeO = useTransform(p, (v) => seg(v, 0.12, 0.16));
  const laneX = useTransform(p, (v) => `${-v * 9000}px 0`);
  const bandO = useTransform(p, (v) => seg(v, 0.18, 0.22));
  const cardStep = g.mobile ? 250 : 300;
  const manifestX = useTransform(p, (v) =>
    lerp(w * 0.55, -(services.length * cardStep - w * (g.mobile ? 0.9 : 0.95)), seg(v, T.manifest[0], T.manifest[1])),
  );
  const fill = useTransform(p, (v) => seg(v, T.fill[0], T.fill[1]));
  const legW = Math.max(8, g.TW * 0.022);
  // The gantry straddles the whole rig so its legs never cross the cab.
  const legL = g.truckX - g.TW * 0.04;
  const legR = g.truckX + g.TW * 1.03;

  return (
    <>
      <motion.div className="absolute inset-0" style={{ y: layerY }}>
        {/* Marquee behind the truck */}
        <motion.p
          aria-hidden
          className="display absolute whitespace-nowrap text-mirage/[0.09]"
          style={{
            x: marqueeX,
            opacity: marqueeO,
            top: g.groundY - (g.mobile ? w * 0.19 : Math.min(h * 0.26, w * 0.18)) * 0.86,
            fontSize: g.mobile ? w * 0.19 : Math.min(h * 0.26, w * 0.18),
          }}
        >
          What I ship ✦ What I ship
        </motion.p>

        {/* Road band */}
        <div className="absolute inset-x-0 bg-mirage" style={{ top: g.groundY, height: h * 1.4 }}>
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-[14px] h-[3px] opacity-40"
            style={{ backgroundImage: "repeating-linear-gradient(90deg,#E4EEF0 0 34px,transparent 34px 70px)", backgroundPosition: laneX }}
          />
          <motion.div style={{ opacity: bandO }} className="absolute inset-x-0" >
            <div className="container-page grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end" style={{ paddingTop: h * 0.07 }}>
              <h3 className="display text-[1.6rem] text-sand sm:text-4xl">
                Everything your idea needs. <span className="text-sand/35">Looked after by one person.</span>
              </h3>
              <p className="hidden max-w-md text-sm leading-relaxed text-sand/65 lg:block">
                Web apps, AI, backend, automation, cloud and mobile. Whatever your idea needs, we build it together, and I
                look after every piece of it like it's my own.
              </p>
            </div>
            <motion.ul className="absolute flex gap-4" style={{ x: manifestX, top: h * (g.mobile ? 0.27 : 0.31), left: 0 }}>
              {services.map((s, i) => (
                <li
                  key={s.title}
                  className="flex shrink-0 flex-col rounded-[16px] border border-sand/15 bg-mirage-2 p-5 text-sand"
                  style={{ width: cardStep - 16, height: h * (g.mobile ? 0.24 : 0.22) }}
                >
                  <div className="flex items-center justify-between">
                    <s.icon className="h-5 w-5 text-blaze" aria-hidden />
                    <span className="font-mono text-[10px] text-sand/45">MANIFEST 0{i + 1}/0{services.length}</span>
                  </div>
                  <p className="label mt-auto text-[13px] leading-snug">{s.title}</p>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-sand/60">{s.items.join(" · ")}</p>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Truck + container */}
        <motion.div className="absolute" style={{ x: truckDX, left: 0, top: 0, width: w, height: h }}>
          <div className="absolute" style={{ left: g.truckX, top: g.groundY - g.TH, width: g.TW, height: g.TH }}>
            <SideTruck spin={spin} />
          </div>
          <motion.div className="absolute" style={{ left: g.conX, top: conTop, width: g.CW, height: g.CH }}>
            <SideContainer label="YOUR-IDEA" sub="v1.0.0 · ready to ship" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* CI/CD gantry crane */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: craneY }} aria-hidden>
        {[legL, legR].map((x) => (
          <div
            key={x}
            className="absolute"
            style={{
              left: x,
              top: g.beamY,
              width: legW,
              height: g.groundY - g.beamY,
              background: "repeating-linear-gradient(-45deg,#16232A 0 10px,#FF5B04 10px 20px)",
            }}
          />
        ))}
        <div
          className="absolute flex items-center justify-center bg-mirage font-mono text-[10px] tracking-[0.25em] text-sand"
          style={{ left: legL - legW, top: g.beamY, width: legR - legL + legW * 3, height: g.beamH }}
        >
          CI/CD
        </div>
        <div
          className="absolute bg-blaze"
          style={{ left: g.conX + g.CW * 0.4, top: g.beamY + g.beamH, width: g.CW * 0.2, height: g.beamH * 0.8 }}
        />
        {[0.28, 0.72].map((f) => (
          <motion.div
            key={f}
            className="absolute w-[2px] bg-mirage"
            style={{ left: g.conX + g.CW * f, top: g.beamY + g.beamH * 1.8, height: cableH }}
          />
        ))}
        <motion.div
          className="absolute h-[5px] bg-mirage"
          style={{ left: g.conX + g.CW * 0.15, width: g.CW * 0.7, top: useTransform(conTop, (v) => v - 5) }}
        />
      </motion.div>

      {/* Darkness rising over the sky before the camera flips to top-down */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 origin-bottom bg-mirage"
        style={{ height: g.panTo + 2, scaleY: fill }}
      />

    </>
  );
}

/* ------------------------------------------------------------------ */
/* 03–05: top-down world                                               */
/* ------------------------------------------------------------------ */

function Gate({ p, g, i, y }: { p: MotionValue<number>; g: Geo; i: number; y: number }) {
  const m = milestones[i];
  // Truck nose position drives the barrier and the check mark.
  const nose = useTransform(p, (v) => pathAt(g, travelS(g, v)).y + g.truckLen / 2);
  const armRotate = useTransform(nose, (n) => -82 * clamp01((n - (y - g.rw * 3.2)) / (g.rw * 1.6)));
  const passed = useTransform(nose, (n) => (n > y + g.truckLen * 0.2 ? 1 : 0));
  const checkBg = useTransform(passed, (v) => (v ? "#FF5B04" : "rgba(22,35,42,0.08)"));
  const checkColor = useTransform(passed, (v) => (v ? "#ffffff" : "rgba(22,35,42,0.35)"));
  const cardH = g.mobile ? 150 : 170;

  return (
    <>
      {/* Barrier */}
      <div className="absolute h-3 w-3 rounded-sm bg-mirage" style={{ left: g.cx - g.rw / 2 - 14, top: y - 6 }} />
      <motion.div
        className="absolute h-[6px] origin-left rounded-full"
        style={{
          left: g.cx - g.rw / 2 - 8,
          top: y - 3,
          width: g.rw + 14,
          rotate: armRotate,
          background: "repeating-linear-gradient(90deg,#FF5B04 0 10px,#F7FAFB 10px 20px)",
        }}
      />
      <div className="absolute font-mono text-[10px] text-mirage/50" style={{ left: g.cx - g.rw / 2 - 40, top: y + 10 }}>
        {g.mobile ? "" : `0${i + 1}`}
      </div>
      {/* Milestone card */}
      <div
        className="absolute flex flex-col rounded-[16px] border border-mirage/15 bg-paper p-4 shadow-[0_18px_40px_-24px_rgba(22,35,42,0.5)] sm:p-5"
        style={{ left: g.cx + g.rw / 2 + (g.mobile ? 12 : 44), top: y - cardH / 2, width: g.cardW, minHeight: cardH }}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xs text-blaze-ink">0{i + 1}</span>
          <span className="font-mono text-[10px] tracking-wider text-subtle uppercase">Checkpoint</span>
        </div>
        <h3 className="display mt-2 text-xl sm:text-2xl">{m.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{m.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <motion.span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: checkBg, color: checkColor }}>
            <Check className="h-3 w-3" strokeWidth={3} />
          </motion.span>
          <span className="font-mono text-[11px] text-mirage/70">{m.check}</span>
        </div>
      </div>
    </>
  );
}

function WorldScene({ p, g, w, h }: { p: MotionValue<number>; g: Geo; w: number; h: number }) {
  const show = useTransform(p, (v) => (v >= T.world ? 1 : 0));
  const dark = useTransform(p, (v) => 1 - seg(v, T.reveal[0], T.reveal[1]));
  const camY = useTransform(p, (v) => -camera(g, v));
  const pos = useTransform(p, (v) => pathAt(g, travelS(g, v)));
  const truckX = useTransform(pos, (q) => q.x - g.truckLen / 2);
  const truckY = useTransform(pos, (q) => q.y - g.truckWid / 2);
  const truckA = useTransform(pos, (q) => q.a);

  const transferT = useTransform(p, (v) => ease(seg(v, T.transfer[0], T.transfer[1])));
  const onTruck = useTransform(transferT, (t) => (t > 0 ? 0 : 1));
  const sail = useTransform(p, (v) => ease(seg(v, T.sail[0], T.sail[1])));
  const shipDY = useTransform(sail, (s) => s * h * 1.5);
  const shipDX = useTransform(sail, (s) => s * s * (g.mobile ? w * 0.1 : w * 0.06));

  // Flying container: from the truck bed (vertical, heading down) into ship slot 0, then away with the ship.
  const fromW = g.truckWid * 0.86;
  const fromH = g.truckLen * 0.7;
  const fromCx = g.cx;
  const fromCy = g.truckEndY - g.truckLen * 0.13;
  const toW = (SHIP.slotW / SHIP.w) * g.shipW;
  const toH = (SHIP.slotH / SHIP.h) * g.shipH;
  const fly = useTransform([transferT, shipDY, shipDX], ([t, dy, dx]: number[]) => ({
    cx: lerp(fromCx, g.slotCx, t) + dx,
    cy: lerp(fromCy, g.shipY + g.slotCyRel, t) + dy,
    w: lerp(fromW, toW, t),
    h: lerp(fromH, toH, t),
    s: 1 + 0.3 * Math.sin(Math.PI * t),
  }));
  const flyO = useTransform(transferT, (t) => (t > 0 ? 1 : 0));

  const roadD = `M ${g.xStart - 300} ${g.y0} H ${g.cx - g.R} A ${g.R} ${g.R} 0 0 1 ${g.cx} ${g.y0 + g.R} V ${g.pierY + h * 0.02}`;
  const worldH = g.pierY + h * 3;

  return (
    <motion.div className="absolute inset-0 bg-sand" style={{ opacity: show }}>
      <motion.div className="absolute inset-x-0 top-0" style={{ y: camY, height: worldH }}>
        {/* Sea */}
        <div
          className="absolute inset-x-0 bg-sea"
          style={{
            top: g.seaTop,
            height: worldH - g.seaTop,
            backgroundImage:
              "repeating-linear-gradient(170deg,rgba(228,238,240,0.05) 0 2px,transparent 2px 46px),repeating-linear-gradient(10deg,rgba(0,0,0,0.08) 0 1px,transparent 1px 38px)",
          }}
        />
        <div className="absolute inset-x-0 h-2 bg-mirage-3" style={{ top: g.seaTop - 2 }} />

        {/* Road */}
        <svg className="absolute top-0 left-0 overflow-visible" width={w} height={worldH} aria-hidden>
          <path d={roadD} fill="none" stroke="#16232A" strokeWidth={g.rw} />
          <path d={roadD} fill="none" stroke="#E4EEF0" strokeOpacity=".45" strokeWidth="2" strokeDasharray="16 20" />
          <rect x={g.cx - g.rw / 2 - 6} y={g.seaTop - 2} width={g.rw + 12} height={g.pierY - g.seaTop + h * 0.04} fill="#2a3d46" />
          <path d={`M ${g.cx} ${g.seaTop} V ${g.pierY}`} stroke="#E4EEF0" strokeOpacity=".3" strokeWidth="2" strokeDasharray="6 10" />
        </svg>

        {g.gates.map((y, i) => (
          <Gate key={i} p={p} g={g} i={i} y={y} />
        ))}

        {/* Ship */}
        <motion.div
          className="absolute"
          style={{ left: g.shipX, top: g.shipY, width: g.shipW, height: g.shipH, x: shipDX, y: shipDY }}
        >
          <motion.div
            aria-hidden
            className="absolute -top-[30%] left-[10%] h-[40%] w-[80%] rounded-full bg-sand/25 blur-xl"
            style={{ opacity: sail }}
          />
          <TopShip />
        </motion.div>

        {/* Truck */}
        <motion.div
          className="absolute"
          style={{ x: truckX, y: truckY, rotate: truckA, width: g.truckLen, height: g.truckWid, left: 0, top: 0 }}
        >
          <TopTruck />
          <motion.div
            className="absolute"
            style={{ opacity: onTruck, left: g.truckLen * 0.02, top: g.truckWid * 0.07, width: g.truckLen * 0.7, height: g.truckWid * 0.86 }}
          >
            <TopContainer />
          </motion.div>
        </motion.div>

        {/* Container being craned onto the ship */}
        <motion.div
          className="absolute rounded-[2px] shadow-[0_14px_24px_-8px_rgba(0,0,0,0.5)]"
          style={{
            opacity: flyO,
            left: useTransform(fly, (f) => f.cx - f.w / 2),
            top: useTransform(fly, (f) => f.cy - f.h / 2),
            width: useTransform(fly, (f) => f.w),
            height: useTransform(fly, (f) => f.h),
            scale: useTransform(fly, (f) => f.s),
            background: "repeating-linear-gradient(0deg,#FF5B04 0 8px,#e45103 8px 11px)",
          }}
        />
      </motion.div>

      {/* Dark curtain lifting off the world */}
      <motion.div aria-hidden className="absolute inset-0 bg-mirage" style={{ opacity: dark }} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Overlays                                                            */
/* ------------------------------------------------------------------ */

function Overlays({ p, g, w, h }: { p: MotionValue<number>; g: Geo; w: number; h: number }) {
  const headingO = useTransform(p, [...T.heading], [0, 1, 1, 0]);
  const portO = useTransform(p, [0.85, 0.87, 0.91, 0.93], [0, 1, 1, 0]);
  const finaleO = useTransform(p, (v) => seg(v, T.finale[0], T.finale[1]));
  const finaleY = useTransform(finaleO, (v) => (1 - v) * 24);
  const finalePE = useTransform(finaleO, (v) => (v > 0.5 ? "auto" : "none"));

  return (
    <>
      {/* Progress */}
      <div className="pointer-events-none absolute right-5 bottom-5 left-5 sm:right-8 sm:left-8" aria-hidden>
        <div className="relative h-[3px] rounded-full bg-mirage/15">
          <motion.div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-blaze" style={{ scaleX: p }} />
          {chapters.slice(1).map((c) => (
            <span key={c.label} className="absolute top-1/2 h-2 w-[2px] -translate-y-1/2 bg-mirage/40" style={{ left: `${c.at * 100}%` }} />
          ))}
        </div>
      </div>

      {/* Checkpoints heading */}
      <motion.div
        className={g.mobile ? "absolute inset-x-0 top-0 bg-gradient-to-b from-sand via-sand/95 to-transparent px-5 pt-14 pb-10" : "absolute"}
        style={g.mobile ? { opacity: headingO } : { opacity: headingO, left: w * 0.06, top: h * 0.36, width: w * 0.34 }}
      >
        <h3 className="display text-[1.6rem] break-words sm:text-4xl xl:text-5xl">
          Cared for at <span className="text-blaze">every</span> <span className="text-outline">milestone.</span>
        </h3>
        <p className="mt-4 hidden max-w-xs text-sm leading-relaxed text-muted sm:block">
          We check in together at every step on the way to launch, so nothing important slips through and you always know
          where your idea is.
        </p>
      </motion.div>

      {/* Port caption */}
      <motion.div
        className={`pointer-events-none absolute ${g.mobile ? "rounded-2xl bg-mirage/85 p-5 backdrop-blur" : ""}`}
        style={{ opacity: portO, left: g.mobile ? w * 0.06 : w * 0.06, top: h * (g.mobile ? 0.14 : 0.3), width: g.mobile ? w * 0.88 : w * 0.34 }}
      >
        <p className="display text-2xl text-sand sm:text-4xl">Settled in safely with the rest of your system.</p>
      </motion.div>

      {/* Finale */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-sand"
        style={{ opacity: finaleO, y: finaleY, pointerEvents: finalePE }}
      >
        <h3 className="display max-w-4xl text-[2.2rem] text-balance sm:text-6xl lg:text-7xl">
          Software that works <span className="text-blaze">as hard as you do.</span>
        </h3>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-sand/75 sm:text-base">
          Built with you, cared for like my own, and looked after long after launch. Bring me your idea and let's take it
          the rest of the way together.
        </p>
        <ButtonLink href="/contact" variant="accent" size="lg" className="mt-8">
          Let's build it together
          <ArrowUpRight className="h-4 w-4" />
        </ButtonLink>
      </motion.div>
    </>
  );
}

function Stage({ p, w, h }: { p: MotionValue<number>; w: number; h: number }) {
  const g = useMemo(() => geometry(w, h), [w, h]);
  const sideO = useTransform(p, (v) => (v < T.world ? 1 : 0));
  return (
    <div className="absolute inset-0 bg-sand">
      <motion.div className="absolute inset-0" style={{ opacity: sideO }}>
        <SideScene p={p} g={g} w={w} h={h} />
      </motion.div>
      <WorldScene p={p} g={g} w={w} h={h} />
      <Overlays p={p} g={g} w={w} h={h} />
    </div>
  );
}

/** Reduced-motion version: the same story as a simple list, ending on the call to action. */
function StaticJourney() {
  return (
    <section id="top" aria-labelledby="hero-title" className="pt-24 pb-24">
      <h1 id="hero-title" className="sr-only">
        {HERO_TITLE}
      </h1>
      <div className="container-page">
        <h2 id="process" className="display text-3xl sm:text-5xl">
          How your idea <span className="text-blaze">ships.</span>
        </h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {milestones.map((m, i) => (
            <li key={m.title} className="rounded-[16px] border border-mirage/15 bg-paper p-6">
              <span className="font-mono text-xs text-blaze-ink">0{i + 1}</span>
              <h3 className="display mt-2 text-2xl">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 rounded-[22px] bg-sea p-8 text-sand sm:p-12">
          <p className="display max-w-3xl text-3xl sm:text-5xl">
            Software that works <span className="text-blaze">as hard as you do.</span>
          </p>
          <ButtonLink href="/contact" variant="accent" size="lg" className="mt-8">
            Let's build it together
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { w, h } = useViewport();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  if (reduced) return <StaticJourney />;

  return (
    <section id="top" ref={ref} aria-labelledby="hero-title" data-nav-reveal={T.finale[0]} className="relative h-[900vh]">
      <h1 id="hero-title" className="sr-only">
        {HERO_TITLE}
      </h1>
      <span id="process" aria-hidden className="absolute left-0" style={{ top: "440vh" }} />
      <div className="sticky top-0 h-screen overflow-hidden">
        <Stage key={`${w}x${h}`} p={scrollYProgress} w={w} h={h} />
      </div>
    </section>
  );
}

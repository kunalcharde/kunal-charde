import { motion, type MotionValue } from "framer-motion";

// Flat vector artwork for the "How your idea ships" story, drawn in the site palette.

const C = {
  mirage: "#16232A",
  mirage2: "#1e2f37",
  mirage3: "#2a3d46",
  blaze: "#FF5B04",
  blazeDark: "#c74300",
  sea: "#075056",
  sand: "#E4EEF0",
  paper: "#F7FAFB",
};

function Wheel({ cx, cy, spin }: { cx: number; cy: number; spin: MotionValue<number> }) {
  return (
    <motion.g style={{ rotate: spin, transformBox: "fill-box", transformOrigin: "center" }}>
      <circle cx={cx} cy={cy} r="19" fill={C.mirage} />
      <circle cx={cx} cy={cy} r="9.5" fill={C.sand} />
      <path d={`M${cx - 9} ${cy}h18M${cx} ${cy - 9}v18`} stroke={C.mirage} strokeWidth="2.5" />
    </motion.g>
  );
}

/** Side view of the truck and empty trailer bed (the container is drawn separately so the crane can lower it). */
export function SideTruck({ spin }: { spin: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 600 180" className="h-full w-full overflow-visible" aria-hidden>
      {/* trailer */}
      <rect x="14" y="140" width="436" height="11" rx="2" fill={C.mirage} />
      <rect x="300" y="151" width="12" height="18" fill={C.mirage3} />
      <rect x="30" y="151" width="110" height="6" fill={C.mirage3} />
      <rect x="330" y="151" width="100" height="6" fill={C.mirage3} />
      {/* cab */}
      <rect x="458" y="16" width="7" height="42" rx="2" fill={C.mirage3} />
      <path d="M450 152V62q0-22 22-22h66q18 0 28 18l24 46q4 8 4 18v30Z" fill={C.mirage} />
      <path d="M506 54h32q10 0 15 9l17 35h-64Z" fill={C.sea} />
      <path d="M512 58h20l-14 36h-6Z" fill={C.sand} opacity=".18" />
      <rect x="450" y="118" width="144" height="6" fill={C.blaze} />
      <rect x="586" y="126" width="12" height="26" rx="2" fill={C.mirage3} />
      <rect x="588" y="110" width="8" height="8" rx="1" fill={C.sand} />
      <path d="M498 60v58" stroke={C.mirage3} strokeWidth="2" />
      <text x="463" y="102" fill={C.sand} fontSize="15" fontWeight="800" fontFamily="var(--font-display)" style={{ fontStretch: "125%" }}>
        KC
      </text>
      {[60, 104, 362, 406, 488, 560].map((x) => (
        <Wheel key={x} cx={x} cy={160} spin={spin} />
      ))}
    </svg>
  );
}

/** A shipping container, side view. */
export function SideContainer({ label, sub, color = C.blaze, ink = C.mirage }: { label: string; sub?: string; color?: string; ink?: string }) {
  return (
    <svg viewBox="0 0 420 128" className="h-full w-full" aria-hidden>
      <rect width="420" height="128" rx="3" fill={color} />
      {Array.from({ length: 27 }, (_, i) => (
        <rect key={i} x={36 + i * 14} y="8" width="5" height="112" fill="#000" opacity=".09" />
      ))}
      <rect width="420" height="8" fill="#000" opacity=".16" />
      <rect y="120" width="420" height="8" fill="#000" opacity=".16" />
      <rect x="0" y="0" width="30" height="128" fill="#000" opacity=".12" />
      <path d="M10 14v100M20 14v100" stroke="#000" strokeOpacity=".22" strokeWidth="3" />
      <rect x="128" y="36" width="230" height="58" rx="4" fill={C.paper} opacity=".95" />
      <text x="243" y="68" textAnchor="middle" fill={ink} fontSize="26" fontWeight="800" fontFamily="var(--font-display)" style={{ fontStretch: "125%" }}>
        {label}
      </text>
      {sub && (
        <text x="243" y="85" textAnchor="middle" fill={ink} opacity=".6" fontSize="11" fontFamily="var(--font-sans)">
          {sub}
        </text>
      )}
    </svg>
  );
}

/** Top-down truck pointing right: chassis + cab. The container sits on top as its own element. */
export function TopTruck() {
  return (
    <svg viewBox="0 0 190 60" className="h-full w-full overflow-visible" aria-hidden>
      <rect x="2" y="6" width="142" height="48" rx="3" fill={C.mirage3} />
      <rect x="146" y="5" width="42" height="50" rx="7" fill={C.mirage} />
      <rect x="174" y="10" width="9" height="40" rx="3" fill={C.sea} />
      <rect x="150" y="5" width="18" height="50" fill={C.blaze} opacity=".9" />
      <rect x="186" y="12" width="4" height="6" rx="1" fill={C.sand} />
      <rect x="186" y="42" width="4" height="6" rx="1" fill={C.sand} />
    </svg>
  );
}

/** A container seen from above (long axis horizontal). */
export function TopContainer({ color = C.blaze, label }: { color?: string; label?: string }) {
  return (
    <svg viewBox="0 0 140 48" className="h-full w-full" aria-hidden preserveAspectRatio="none">
      <rect width="140" height="48" rx="2" fill={color} />
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={8 + i * 12} y="3" width="4" height="42" fill="#000" opacity=".1" />
      ))}
      {label && (
        <text x="70" y="29" textAnchor="middle" fill={C.mirage} fontSize="12" fontWeight="700" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </svg>
  );
}

// Services stacked on deck. Slot 0 is left empty for the container the truck delivers.
const deck = [
  { c: null, l: "" },
  { c: C.sea, l: "api" },
  { c: C.sand, l: "web" },
  { c: C.mirage3, l: "db" },
  { c: C.paper, l: "rag" },
  { c: C.blaze, l: "auth" },
  { c: C.sea, l: "jobs" },
  { c: C.sand, l: "cache" },
  { c: C.mirage3, l: "search" },
  { c: C.paper, l: "cron" },
  { c: C.sea, l: "cdn" },
  { c: C.sand, l: "mail" },
  { c: C.blaze, l: "pay" },
  { c: C.mirage3, l: "queue" },
  { c: C.paper, l: "logs" },
  { c: C.sea, l: "auth" },
  { c: C.sand, l: "files" },
  { c: C.mirage3, l: "ml" },
  { c: C.paper, l: "admin" },
  { c: C.sea, l: "crm" },
];

/** Ship slot geometry in the 220×700 ship viewBox (4 columns × 5 rows, containers lying along the hull). */
export const SHIP = { w: 220, h: 700, col0: 30, colW: 40, row0: 120, rowH: 84, slotW: 36, slotH: 78 };

/** Container ship seen from above, bow pointing down. */
export function TopShip() {
  return (
    <svg viewBox={`0 0 ${SHIP.w} ${SHIP.h}`} className="h-full w-full overflow-visible" aria-hidden>
      <path d="M110 700Q28 640 18 556V44Q18 10 52 10h116q34 0 34 34v512q-10 84-92 144Z" fill={C.mirage} />
      <path d="M110 684Q40 630 30 552V50q0-28 28-28h104q28 0 28 28v502q-10 78-80 132Z" fill={C.mirage2} />
      <rect x="44" y="34" width="132" height="66" rx="6" fill={C.sand} />
      <rect x="56" y="44" width="108" height="10" rx="2" fill={C.sea} />
      <rect x="98" y="62" width="24" height="30" rx="3" fill={C.mirage3} />
      {deck.map((d, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = SHIP.col0 + col * SHIP.colW + 2;
        const y = SHIP.row0 + row * SHIP.rowH + 3;
        if (!d.c)
          return (
            <rect key={i} x={x} y={y} width={SHIP.slotW} height={SHIP.slotH} rx="2" fill="none" stroke={C.blaze} strokeDasharray="4 4" strokeWidth="1.5" />
          );
        return (
          <g key={i}>
            <rect x={x} y={y} width={SHIP.slotW} height={SHIP.slotH} rx="2" fill={d.c} />
            {Array.from({ length: 6 }, (_, k) => (
              <rect key={k} x={x + 3} y={y + 6 + k * 12} width={SHIP.slotW - 6} height="3" fill="#000" opacity=".1" />
            ))}
            <text
              x={x + SHIP.slotW / 2}
              y={y + SHIP.slotH / 2}
              transform={`rotate(-90 ${x + SHIP.slotW / 2} ${y + SHIP.slotH / 2})`}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={d.c === C.mirage3 || d.c === C.sea ? C.sand : C.mirage}
              fontSize="11"
              fontWeight="700"
              fontFamily="var(--font-sans)"
            >
              {d.l}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

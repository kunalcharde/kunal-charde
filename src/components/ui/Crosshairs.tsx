/** Registration "+" marks in the corners of a poster area, as in print layouts. */
export function Crosshairs({ className = "" }: { className?: string }) {
  const marks = ["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0", "top-0 left-1/2", "bottom-0 left-1/2"];
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {marks.map((pos) => (
        <span key={pos} className={`absolute ${pos} -translate-x-1/2 -translate-y-1/2 text-[13px] leading-none text-mirage/35`}>
          +
        </span>
      ))}
    </div>
  );
}

/** The site mark: a "K" inside a rounded quatrefoil, echoing the reference's emblem cards. */
export function Emblem({ className = "", stroke = "currentColor" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none" stroke={stroke} strokeWidth="5">
      <path d="M32 6c7 0 11 5 12 10 5 1 10 5 10 12v8c0 7-5 11-10 12-1 5-5 10-12 10s-11-5-12-10c-5-1-10-5-10-12v-8c0-7 5-11 10-12 1-5 5-10 12-10Z" />
      <path d="M27 21v22M27 33l11-12M30.5 30l8.5 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

import type { CSSProperties } from "react";

/** A word drawn twice — solid over outline — with the two layers trading places in a wave from left to right. */
export function WaveWord({ word, className = "" }: { word: string; className?: string }) {
  return (
    <span className={`inline-flex whitespace-nowrap ${className}`} role="img" aria-label={word}>
      {[...word].map((ch, i) => (
        <span key={i} className="wave-letter" style={{ "--i": i } as CSSProperties} aria-hidden>
          <span>{ch}</span>
          <span>{ch}</span>
        </span>
      ))}
    </span>
  );
}

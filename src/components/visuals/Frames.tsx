import type { ReactNode } from "react";

export function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-sand/10 bg-mirage text-sand shadow-2xl shadow-mirage/30">
      <div className="flex items-center gap-3 border-b border-sand/10 px-3.5 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        </div>
        <div className="mx-auto w-full max-w-[220px] truncate rounded-md bg-white/[0.04] px-3 py-1 text-center font-mono text-[10px] text-sand/45">
          {url}
        </div>
        <div className="w-[42px]" />
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[184px] shrink-0 rounded-[28px] border border-slate-700/70 bg-[#05070c] p-2 shadow-2xl shadow-mirage/40">
      <div className="absolute top-3.5 left-1/2 z-10 h-3.5 w-14 -translate-x-1/2 rounded-full bg-black" />
      <div className="overflow-hidden rounded-[21px] bg-mirage text-sand">{children}</div>
    </div>
  );
}

/** Placeholder text line used inside mockups. */
export function Line({ w, className = "" }: { w: string; className?: string }) {
  return <div className={`h-1.5 rounded-full bg-sand/20 ${className}`} style={{ width: w }} />;
}

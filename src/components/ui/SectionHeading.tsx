import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
};

export function SectionHeading({ eyebrow, index, title, lead, id, tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <Reveal className="max-w-4xl">
      <p className={`eyebrow ${dark ? "text-sand/60" : ""}`}>
        {index && <span className="text-blaze">{index}</span>}
        <span className={`h-px w-8 ${dark ? "bg-sand/30" : "bg-mirage/30"}`} aria-hidden />
        {eyebrow}
      </p>
      <h2 id={id} className="section-title mt-5">
        {title}
      </h2>
      {lead && <p className={`section-lead ${dark ? "text-sand/70" : ""}`}>{lead}</p>}
    </Reveal>
  );
}

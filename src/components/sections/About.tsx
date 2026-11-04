import { Check } from "lucide-react";
import { domains } from "../../data/content";
import { Emblem } from "../ui/Crosshairs";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

// The track record, told through what's been built rather than who it was built for.
const highlights = [
  {
    n: "4+",
    label: "Years shipping software",
    text: "From first prototypes to platforms people use every day, taken all the way to production and looked after afterwards.",
  },
  {
    n: "25+",
    label: "Projects shipped",
    text: "Enterprise CRMs, AI legal research, knowledge assistants, healthcare apps, fintech websites and mobile apps.",
  },
  { n: "9+", label: "Sectors worked in", text: "Different worlds, same care. A few of them:" },
];

// Things I can help you with, phrased as what we'd make together.
const strengths = [
  "Web apps, from first screen to full platform",
  "AI and LLM features that genuinely help",
  "Enterprise software and ERP connections",
  "Backends and APIs built to last",
  "Cloud setup and a calm launch day",
  "Looking after it all, end to end",
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 md:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <div>
          <SectionHeading
            id="about-title"
            eyebrow="About"
            title={
              <>
                Hi, this is <span className="text-blaze">Kunal.</span>
              </>
            }
          />
          <Reveal delay={0.05} className="mt-8 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            <p>
              I'm a software engineer, and what I love most is sitting with someone's idea, understanding why it
              matters to them, and slowly turning it into something real that people can use.
            </p>
            <p>
              Over the past four years I've shipped more than 25 projects across legal tech, healthcare, fintech, enterprise
              CRM and AI, working alongside founders, product teams and enterprise clients. Every one of them taught me that
              good software comes from listening first.
            </p>
            <p className="font-medium text-mirage">
              Your product might start as yours, but once we begin, it becomes a little bit mine too. I'll care about the
              details, check in often, and stay with it long after it goes live. We're building this together.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {strengths.map((s) => (
                <li key={s} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blaze text-white">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:pt-6">
          <div className="relative overflow-hidden rounded-[22px] bg-mirage p-7 text-sand sm:p-8">
            <Emblem className="absolute -top-10 -right-10 h-44 w-44 text-sand/[0.05]" />
            <p className="label relative text-sand/60">The journey so far</p>
            <ul className="relative mt-4 divide-y divide-sand/10">
              {highlights.map((h, i) => (
                <li key={h.label} className="py-6 last:pb-0">
                  <div className="flex items-baseline gap-4">
                    <span className="display text-4xl text-blaze sm:text-5xl">{h.n}</span>
                    <span className="label text-[13px]">{h.label}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-sand/70">{h.text}</p>
                  {i === highlights.length - 1 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {domains.map((d) => (
                        <li key={d} className="rounded-full border border-sand/20 px-2.5 py-1 text-xs text-sand/80">
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

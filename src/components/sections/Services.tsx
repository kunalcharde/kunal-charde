import { ArrowUpRight } from "lucide-react";
import { services } from "../../data/content";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-24 md:py-32">
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

        <ul className="mt-14 border-t border-mirage">
          {services.map((s, i) => (
            <li key={s.title} className="group relative border-b border-mirage/25">
              {/* Hover fill rises from the bottom of the row */}
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-mirage transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
              />
              <Reveal
                delay={0.03 * i}
                className="relative grid gap-4 px-1 py-8 transition-colors duration-300 group-hover:text-sand sm:px-4 md:grid-cols-[72px_1.1fr_1.2fr_1fr] md:items-start md:gap-8"
              >
                <span className="font-mono text-sm text-blaze">0{i + 1}</span>
                <div className="flex items-start gap-4">
                  <s.icon className="mt-1 h-5 w-5 shrink-0 text-blaze" aria-hidden />
                  <h3 className="display text-xl leading-[1.05] sm:text-2xl">{s.title}</h3>
                </div>
                <p className="text-[15px] leading-relaxed text-muted transition-colors group-hover:text-sand/70">{s.description}</p>
                <ul className="flex flex-wrap gap-1.5 md:justify-end">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-mirage/20 px-2.5 py-1 text-xs transition-colors group-hover:border-sand/25 group-hover:text-sand/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

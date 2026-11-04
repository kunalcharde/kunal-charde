import { ArrowUpRight, Briefcase, Code2, Eye, Layers, Rocket, Sparkles } from "lucide-react";
import { reasons } from "../../data/content";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const icons = [Briefcase, Rocket, Sparkles, Code2, Layers, Eye];

export function WhyMe() {
  return (
    <section aria-labelledby="why-title" className="py-24 md:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="why-title"
            eyebrow="Why build with me"
            title={
              <>
                Someone in your corner, from idea to <span className="text-blaze">launch and beyond.</span>
              </>
            }
            lead="I'll treat your product with the same care you do, and I've built enough of them to help you around the bumps along the way."
          />
          <Reveal delay={0.1} className="mt-8">
            <ButtonLink href="/contact" variant="accent" size="lg">
              Let's build together
              <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map((r, i) => {
            const Icon = icons[i];
            return (
              <Reveal
                key={r.title}
                delay={(i % 2) * 0.06}
                className="group rounded-[18px] border border-mirage/15 bg-paper p-7 transition-colors duration-300 hover:border-mirage hover:bg-mirage hover:text-sand"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blaze/10 text-blaze-ink transition-colors group-hover:bg-blaze group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="font-sans font-medium tabular-nums text-xs opacity-40">0{i + 1}</span>
                </div>
                <h3 className="label mt-6 text-sm">{r.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted transition-colors group-hover:text-sand/70">{r.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { caseStudyDetails } from "../../data/caseStudyDetails";
import { caseStudies, clientWork, domains, type CaseStudy } from "../../data/content";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { ProjectMockup } from "../visuals/Mockups";
import { projectPanel } from "../visuals/panels";

const glance = [
  { n: "4+", label: "years shipping software" },
  { n: "25+", label: "projects shipped" },
  { n: "9+", label: "sectors worked in" },
];

// Page rhythm: a wide feature, two side by side, then a wide one mirrored.
const layout: ("wide" | "wide-flip" | "tall")[] = ["wide", "tall", "tall", "wide-flip"];

/** First sentence of the role write-up, for a one-line "my part" on the card. */
const shortRole = (id: string) => caseStudyDetails[id]?.role.split(/(?<=\.)\s/)[0] ?? "";

function ProjectCard({ study, index, variant }: { study: CaseStudy; index: number; variant: "wide" | "wide-flip" | "tall" }) {
  const wide = variant !== "tall";
  const shown = study.stack.slice(0, wide ? 6 : 4);
  const more = study.stack.length - shown.length;

  return (
    <Link
      to={`/work/${study.id}`}
      className={`group grid h-full overflow-hidden rounded-[24px] border border-mirage/15 bg-paper transition-all duration-300 hover:-translate-y-1 hover:border-mirage/40 hover:shadow-[0_30px_60px_-34px_rgba(22,35,42,0.55)] ${
        wide ? "lg:grid-cols-[1.12fr_1fr]" : ""
      }`}
    >
      {/* Visual */}
      <div
        className={`relative flex items-center justify-center overflow-hidden px-5 py-10 sm:px-10 ${projectPanel(index)} ${
          variant === "wide-flip" ? "lg:order-2" : ""
        }`}
      >
        <div className="w-full max-w-[560px] transition-transform duration-500 ease-out group-hover:scale-[1.02]">
          <ProjectMockup kind={study.mockup} />
        </div>
      </div>

      {/* Story */}
      <div className={`flex flex-col p-6 sm:p-8 ${wide ? "lg:p-11" : ""}`}>
        <div className="flex items-center gap-3 text-xs">
          <span className="font-sans font-medium tabular-nums text-blaze-ink">0{index + 1}</span>
          <span className="h-px w-6 bg-mirage/20" aria-hidden />
          <span className="label text-[10px] text-subtle">{study.category}</span>
        </div>
        <h2 className={`display mt-4 text-balance ${wide ? "text-2xl sm:text-[2.1rem]" : "text-xl sm:text-2xl"}`}>{study.name}</h2>
        <p className={`mt-4 text-[15px] leading-relaxed text-muted ${wide ? "" : "line-clamp-3"}`}>{study.overview}</p>

        <p className="mt-5 border-l-2 border-blaze pl-3 text-sm leading-relaxed text-mirage">{shortRole(study.id)}</p>

        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Main technologies">
          {shown.map((t) => (
            <li key={t} className="rounded-full border border-mirage/15 px-2.5 py-1 font-sans font-medium tabular-nums text-[11px] text-muted">
              {t}
            </li>
          ))}
          {more > 0 && <li className="rounded-full bg-mirage/[0.06] px-2.5 py-1 font-sans font-medium tabular-nums text-[11px] text-subtle">+{more}</li>}
        </ul>

        <span className="mt-auto flex items-center justify-between pt-8 text-sm font-medium">
          Read how we built it
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-mirage/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-blaze group-hover:bg-blaze group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </span>
      </div>
    </Link>
  );
}

/** The Work page: an overview, the four case studies in an editorial rhythm, then client websites and apps. */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="pt-28 pb-24 md:pt-32">
      <div className="container-page">
        {/* Header */}
        <header className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow">
              <span className="h-px w-8 bg-mirage/30" aria-hidden />
              Work
            </p>
            <h1 id="work-title" className="section-title mt-5">
              Products I've <span className="text-outline">cared for</span> all the way to <span className="text-blaze">launch.</span>
            </h1>
            <p className="section-lead">
              A few of the products I've helped bring to life. Open any of them to see the problem, how I solved it, and how
              it's put together.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="rounded-[24px] bg-mirage p-6 text-sand sm:p-8">
            <p className="label text-[11px] text-sand/55">At a glance</p>
            <dl className="mt-5 grid grid-cols-3 gap-4">
              {glance.map((g) => (
                <div key={g.label}>
                  <dt className="display text-3xl text-blaze sm:text-4xl">{g.n}</dt>
                  <dd className="mt-2 text-xs leading-snug text-sand/65">{g.label}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-sand/10 pt-5">
              {domains.map((d) => (
                <li key={d} className="rounded-full border border-sand/15 px-2.5 py-1 text-[11px] text-sand/75">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </header>

        {/* Case studies */}
        <div className="mt-16 flex items-baseline justify-between border-b border-mirage/15 pb-4">
          <h2 className="label text-[12px]">Case studies</h2>
          <span className="font-sans font-medium tabular-nums text-xs text-subtle">0{caseStudies.length} stories</span>
        </div>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {caseStudies.map((study, i) => (
            <li key={study.id} className={layout[i] === "tall" ? "" : "md:col-span-2"}>
              <Reveal delay={layout[i] === "tall" ? (i % 2) * 0.06 : 0} className="h-full">
                <ProjectCard study={study} index={i} variant={layout[i] ?? "tall"} />
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Client websites & apps */}
        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-mirage/15 pb-4">
            <div>
              <p className="eyebrow">
                <span className="h-px w-8 bg-mirage/30" aria-hidden />
                Built alongside
              </p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Websites &amp; apps made with growing businesses</h2>
            </div>
            <span className="font-sans font-medium tabular-nums text-xs text-subtle">0{clientWork.length} projects</span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {clientWork.map((p, i) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mirage/[0.06] font-sans font-medium tabular-nums text-xs text-blaze-ink transition-colors group-hover:bg-sand/10">
                      0{i + 1}
                    </span>
                    {p.url && (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current/25 transition-all duration-300 group-hover:rotate-45 group-hover:border-blaze group-hover:bg-blaze group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <h3 className="display mt-6 text-2xl">{p.name}</h3>
                  <p className="label mt-2 text-[10px] opacity-60">{p.type}</p>
                  <p className="mt-4 max-w-md text-sm leading-relaxed opacity-75">{p.description}</p>
                  <p className="mt-6 font-sans font-medium tabular-nums text-xs opacity-60">{p.url ? `${p.linkLabel} ↗` : "Happy to share the live link"}</p>
                </>
              );
              const cls =
                "group block h-full rounded-[20px] border border-mirage/15 bg-paper p-7 transition-all duration-300 sm:p-8";
              return (
                <Reveal key={p.name} delay={(i % 2) * 0.06}>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.name}, ${p.type} (opens in a new tab)`}
                      className={`${cls} hover:-translate-y-1 hover:border-mirage hover:bg-mirage hover:text-sand`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[24px] bg-blaze p-8 text-mirage sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="display text-2xl sm:text-3xl">Have an idea that's been on your mind?</p>
            <p className="mt-2 max-w-md text-sm text-mirage/80">
              Tell me about it, even if it's still rough. We'll think it through together, no pressure and no sales pitch.
            </p>
          </div>
          <ButtonLink href="/contact" size="lg" className="shrink-0">
            Let's talk it through
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

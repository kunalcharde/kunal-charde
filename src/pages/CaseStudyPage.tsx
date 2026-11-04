import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router";
import { caseStudyDetails } from "../data/caseStudyDetails";
import { caseStudies } from "../data/content";
import { ArchitectureDiagram } from "../components/visuals/ArchitectureDiagram";
import { ProjectMockup } from "../components/visuals/Mockups";
import { isDarkPanel, projectPanel } from "../components/visuals/panels";
import { usePageTitle } from "../lib/usePageTitle";
import { NotFound } from "./NotFound";

const chapters = [
  { id: "problem", n: "01", title: "The problem" },
  { id: "solution", n: "02", title: "How I solved it" },
  { id: "architecture", n: "03", title: "Architecture" },
  { id: "decisions", n: "04", title: "Decisions & trade-offs" },
];

/** Which chapter has crossed the upper third of the screen, for the side menu. */
function useActiveChapter() {
  const [active, setActive] = useState(chapters[0].id);
  useEffect(() => {
    const onScroll = () => {
      let current = chapters[0].id;
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = c.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return active;
}

function Chapter({ id, n, title, children }: { id: string; n: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-mirage/15 pt-12 pb-16 first:border-t-0 first:pt-0">
      <p className="font-mono text-xs text-blaze-ink">{n}</p>
      <h2 id={`${id}-title`} className="display mt-2 text-3xl break-words sm:text-4xl">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Long-form story for one project: the problem, how it was solved, the architecture and the trade-offs. */
export function CaseStudyPage() {
  const { id } = useParams();
  const index = caseStudies.findIndex((c) => c.id === id);
  const study = caseStudies[index];
  const detail = study ? caseStudyDetails[study.id] : undefined;
  const active = useActiveChapter();
  usePageTitle(study?.name);

  if (!study || !detail) return <NotFound />;
  const nextIndex = (index + 1) % caseStudies.length;
  const next = caseStudies[nextIndex];
  const dark = isDarkPanel(index);
  const nextDark = isDarkPanel(nextIndex);

  return (
    <article>
      {/* Hero band in the project's colour */}
      <header className={`${projectPanel(index)} ${dark ? "text-sand" : "text-mirage"}`}>
        <div className="container-page grid items-center gap-10 pt-28 pb-14 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pt-32 lg:pb-20">
          <div>
            <Link
              to="/work"
              className={`inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-100 ${dark ? "opacity-75" : "opacity-60"}`}
            >
              <ArrowLeft className="h-4 w-4" /> All work
            </Link>
            <p className="label mt-8 text-[11px] opacity-75">{study.category}</p>
            <h1 className="display mt-4 text-[2.1rem] text-balance break-words sm:text-5xl xl:text-[3.4rem]">{study.name}</h1>
            <p className={`mt-6 max-w-xl text-lg leading-relaxed text-pretty ${dark ? "text-sand/80" : "text-muted"}`}>{study.overview}</p>
          </div>
          <div>
            <ProjectMockup kind={study.mockup} />
            <p className="mt-3 font-mono text-[10px] opacity-60">Illustrative mockup. Real screens stay private.</p>
          </div>
        </div>
      </header>

      {/* Facts strip */}
      <div className="border-b border-mirage/15">
        <dl className="container-page grid gap-8 py-10 md:grid-cols-[1.3fr_1fr_1.4fr] md:gap-10">
          <div>
            <dt className="label text-[11px] text-subtle">My part in it</dt>
            <dd className="mt-3 text-sm leading-relaxed">{detail.role}</dd>
          </div>
          <div>
            <dt className="label text-[11px] text-subtle">Context</dt>
            <dd className="mt-3 text-sm leading-relaxed">{study.context}</dd>
          </div>
          <div>
            <dt className="label text-[11px] text-subtle">Built with</dt>
            <dd className="mt-3">
              <ul className="flex flex-wrap gap-1.5">
                {study.stack.map((t) => (
                  <li key={t} className="rounded-full bg-mirage px-2.5 py-1 font-mono text-[11px] text-sand">
                    {t}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      {/* Body: sticky chapter menu + reading column */}
      <div className="container-page grid gap-12 pt-16 pb-20 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16 lg:pt-20">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="label text-[11px] text-subtle">On this page</p>
            <ol className="mt-4 space-y-1 border-l border-mirage/15">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`-ml-px flex gap-3 border-l-2 py-2 pl-4 text-sm transition-colors ${
                      active === c.id ? "border-blaze font-medium text-mirage" : "border-transparent text-muted hover:text-mirage"
                    }`}
                  >
                    <span className="font-mono text-xs text-blaze-ink">{c.n}</span>
                    {c.title}
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-10 rounded-[18px] bg-mirage p-5 text-sand">
              <p className="text-sm leading-relaxed">Building something like this?</p>
              <Link to="/contact" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blaze hover:underline">
                Let's talk it through <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </aside>

        <div className="min-w-0 max-w-[860px]">
          <Chapter id="problem" n="01" title="The problem">
            <p className="text-xl leading-relaxed text-pretty text-mirage sm:text-2xl sm:leading-relaxed">{detail.problem[0]}</p>
            {detail.problem.slice(1).map((p) => (
              <p key={p} className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
                {p}
              </p>
            ))}
            <div className="mt-10 rounded-[18px] border border-mirage/15 bg-paper p-6 sm:p-8">
              <p className="label text-[12px]">What made it tricky</p>
              <ul className="mt-5 divide-y divide-mirage/10">
                {detail.challenges.map((c, i) => (
                  <li key={c} className="flex gap-4 py-3 text-[15px] leading-relaxed">
                    <span className="w-6 shrink-0 font-mono text-xs leading-[1.7rem] text-blaze-ink">0{i + 1}</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Chapter>

          <Chapter id="solution" n="02" title="How I solved it">
            <ol className="relative">
              {detail.approach.map((a, i) => (
                <li key={a.title} className="relative grid grid-cols-[40px_1fr] gap-5 pb-9 last:pb-0">
                  {i < detail.approach.length - 1 && (
                    <span aria-hidden className="absolute top-10 bottom-0 left-[19px] w-px bg-mirage/15" />
                  )}
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-mirage font-mono text-xs text-sand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="label text-[15px]">{a.title}</h3>
                    <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-muted">{a.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter id="architecture" n="03" title="Architecture">
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-muted">
              Here's how the pieces fit together. Watch a request travel through the system, or tap any step to jump to it.
            </p>
            <ArchitectureDiagram layers={detail.architecture} flow={detail.flow} />
          </Chapter>

          <Chapter id="decisions" n="04" title="Decisions & trade-offs">
            <ul className="divide-y divide-mirage/15 border-y border-mirage/15">
              {detail.decisions.map((d) => (
                <li key={d.title} className="grid gap-3 py-7 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] sm:gap-10">
                  <h3 className="display text-lg leading-snug sm:text-xl">{d.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{d.body}</p>
                </li>
              ))}
            </ul>
          </Chapter>

          {/* Reflection */}
          <blockquote className="relative overflow-hidden rounded-[22px] bg-mirage px-7 py-12 text-sand sm:px-12 sm:py-14">
            <span aria-hidden className="display absolute -top-6 right-6 text-[9rem] leading-none text-blaze/25">
              "
            </span>
            <p className="font-mono text-[11px] tracking-[0.2em] text-blaze uppercase">Looking back</p>
            <p className="relative mt-5 text-xl leading-relaxed sm:text-2xl sm:leading-relaxed">{detail.reflection}</p>
          </blockquote>
        </div>
      </div>

      {/* Next story */}
      <Link
        to={`/work/${next.id}`}
        className={`group block ${projectPanel(nextIndex)} ${nextDark ? "text-sand" : "text-mirage"}`}
      >
        <div className="container-page flex items-center justify-between gap-6 py-14 sm:py-20">
          <span className="min-w-0">
            <span className="label block text-[11px] opacity-70">Next story</span>
            <span className="display mt-4 block text-3xl break-words transition-transform duration-300 group-hover:translate-x-2 sm:text-5xl">
              {next.name}
            </span>
          </span>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-current/30 transition-all duration-300 group-hover:rotate-45 group-hover:bg-current/10 sm:h-16 sm:w-16">
            <ArrowUpRight className="h-6 w-6" />
          </span>
        </div>
      </Link>
    </article>
  );
}

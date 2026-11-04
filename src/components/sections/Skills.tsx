import { skillGroups } from "../../data/content";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="skills-title"
          eyebrow="What I build with"
          title={
            <>
              Tools I <span className="text-sea">trust</span> with your idea
            </>
          }
          lead="The tools I use every day on real products. I pick them because they're reliable and easy to look after for years, not because they're trendy."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-mirage/20 bg-mirage/20 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <div key={g.title} className={`group ${i === 2 ? "bg-sea text-sand" : "bg-paper"}`}>
              <Reveal delay={(i % 3) * 0.05} className="flex h-full flex-col p-7">
                <div className="flex items-baseline justify-between">
                  <h3 className="label text-[13px]">{g.title}</h3>
                  <span className={`font-sans font-medium tabular-nums text-[11px] ${i === 2 ? "text-sand/60" : "text-blaze-ink"}`}>
                    {String(g.items.length).padStart(2, "0")}
                  </span>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
                        i === 2
                          ? "border-sand/25 hover:border-blaze hover:bg-blaze hover:text-white"
                          : "border-mirage/20 hover:border-mirage hover:bg-mirage hover:text-sand"
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

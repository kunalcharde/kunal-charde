import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { About } from "../components/sections/About";
import { Journey } from "../components/sections/Journey";
import { Reveal } from "../components/ui/Reveal";
import { usePageTitle } from "../lib/usePageTitle";

const explore = [
  { to: "/work", title: "Selected work", text: "Products I've helped bring to life, and the people I built them with." },
  { to: "/services", title: "What we can build", text: "The things I love making, and the tools I trust with them." },
  { to: "/contact", title: "Share your idea", text: "Even if it's still rough. I'd love to hear it." },
];

/** The home page stays light: the story, a short introduction, and doors to everything else. */
export function Home() {
  usePageTitle();
  return (
    <>
      <Journey />
      <About />
      <section aria-label="Explore" className="pb-24 md:pb-32">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {explore.map((e, i) => (
            <Reveal key={e.to} delay={i * 0.06}>
              <Link
                to={e.to}
                className={`group flex h-full flex-col justify-between gap-10 rounded-[22px] border p-7 transition-colors duration-300 sm:p-8 ${
                  i === 2
                    ? "border-blaze bg-blaze text-mirage hover:bg-mirage hover:text-sand"
                    : "border-mirage/15 bg-paper hover:border-mirage hover:bg-mirage hover:text-sand"
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center self-end rounded-full border border-current/25 transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                <span>
                  <span className="display block text-2xl sm:text-3xl">{e.title}</span>
                  <span className="mt-2 block text-sm opacity-70">{e.text}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router";
import { profile } from "../../data/content";
import { Crosshairs, Emblem } from "../ui/Crosshairs";
import { CardWheel } from "../visuals/CardWheel";
import { WaveWord } from "../visuals/WaveWord";

const ease = [0.22, 1, 0.36, 1] as const;

const highlights = ["3+ years shipping production software", "20+ products built in a venture studio", "Web · Mobile · AI · Cloud"];

export function Hero() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="relative overflow-hidden pt-10">
      {/* Poster */}
      <div className="container-page">
        <div className="relative mt-6 px-2 pt-8 pb-10 sm:px-6 sm:pt-10">
          <Crosshairs />

          <div className="relative z-10 flex items-start justify-between">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="label text-[13px] sm:text-base"
            >
              Welcome
              <br />
              to my
            </motion.p>
            <Link to="/#about" aria-label="About Kunal" className="text-mirage transition-colors hover:text-blaze">
              <Emblem className="h-8 w-8 sm:h-9 sm:w-9" />
            </Link>
          </div>

          <div className="relative my-6 flex items-center justify-center sm:my-4">
            {/* Orange block behind the word */}
            <motion.div
              aria-hidden
              initial={{ scaleY: 0 }}
              viewport={{ once: true }} whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
              className="absolute top-1/2 left-1/2 h-[155%] w-[17%] min-w-[64px] origin-bottom -translate-x-1/2 -translate-y-1/2 bg-blaze sm:h-[178%]"
            />
            <span aria-hidden className="absolute top-1/2 left-0 hidden -translate-y-1/2 text-[10px] text-mirage sm:block">
              ▶
            </span>
            <span aria-hidden className="absolute top-1/2 right-0 hidden -translate-y-1/2 text-[10px] text-mirage sm:block">
              ◀
            </span>
            <h2 id="portfolio-title" className="relative">
              <span className="sr-only">
                {profile.name}, {profile.role}. Welcome to my portfolio.
              </span>
              <WaveWord word="PORTFOLIO" className="display py-[0.42em] text-[clamp(2.5rem,11.2vw,9.6rem)]" />
            </h2>
          </div>

          <div className="relative z-10 flex flex-wrap items-end justify-between gap-3">
            <p className="label text-[10px] sm:text-xs">{profile.name}</p>
            <Link
              to="/contact"
              className="order-last flex w-full items-center justify-center gap-2 rounded-full border border-mirage/20 bg-paper/70 px-3 py-1.5 text-xs text-mirage backdrop-blur transition-colors hover:border-mirage sm:order-none sm:w-auto"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blaze opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blaze" />
              </span>
              Open to new ideas
            </Link>
            <p className="label text-right text-[10px] sm:text-xs">Full-Stack &amp; AI Engineer</p>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} viewport={{ once: true }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.3 }}>
        <CardWheel />
      </motion.div>

      <div className="bg-mirage text-sand">
        <div className="border-t border-sand/10">
          <ul className="container-page flex flex-wrap gap-x-8 gap-y-2 py-5 font-sans font-medium tabular-nums text-[11px] tracking-wider text-sand/55 uppercase">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-blaze" aria-hidden />
                {h}
              </li>
            ))}
            <li className="sm:ml-auto">{profile.location}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

import { domains } from "../../data/content";

/** Scrolling strip of the domains I've built products in; sits above the footer on every page. */
export function TrustBar() {
  const items = [...domains, ...domains];
  return (
    <section aria-label="Domains" className="overflow-hidden bg-blaze py-3 text-mirage">
      <ul className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
        {items.map((d, i) => (
          <li key={i} aria-hidden={i >= domains.length} className="flex items-center gap-8">
            <span className="display text-lg sm:text-xl">{d}</span>
            <span className="text-sm">✦</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

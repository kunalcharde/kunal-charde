import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { navLinks, profile } from "../../data/content";
import { ButtonLink } from "../ui/Button";
import { Emblem } from "../ui/Crosshairs";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  // Hidden while the opening story plays; the hero section says where to reveal it via data-nav-reveal (0–1 of its scroll).
  const [hidden, setHidden] = useState(true);

  const { pathname } = useLocation();

  // Header style, visibility and the active item, recomputed on scroll and whenever the page changes.
  // Page links are active on their own page; "/#about" is active once the home page's About section is in view.
  useEffect(() => {
    setOpen(false);
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const story = document.querySelector<HTMLElement>("[data-nav-reveal]");
      if (story) {
        const at = story.offsetTop + Number(story.dataset.navReveal) * (story.offsetHeight - window.innerHeight);
        setHidden(window.scrollY < at);
      } else {
        setHidden(false);
      }
      let current = "";
      for (const { href } of navLinks) {
        const [path, hash] = href.split("#");
        if (!hash) {
          // A page link also stays active on its sub-pages (e.g. /work/enterprise-crm).
          if (pathname === path || pathname.startsWith(`${path}/`)) current = href;
          continue;
        }
        if (path !== pathname) continue;
        const el = document.getElementById(hash);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = href;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      inert={hidden}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open || pathname !== "/" ? "border-b border-line bg-sand/85 backdrop-blur-xl" : "border-b border-transparent"
      } ${hidden ? "pointer-events-none -translate-y-full opacity-0" : ""}`}
    >
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Emblem className="h-7 w-7 text-blaze" />
          <span className="label text-[13px]">{profile.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${
                  active === link.href ? "text-mirage" : "text-muted hover:text-mirage"
                }`}
              >
                {active === link.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-mirage/[0.07]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ButtonLink href="/contact" size="sm" className="max-sm:hidden">
            Let's Ship
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-mirage/20 text-mirage md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden md:hidden"
          >
            <ul className="container-page flex flex-col gap-1 pt-4">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className="display block border-b border-line py-5 text-3xl"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-6">
                <ButtonLink href="/contact" variant="accent" size="lg" className="w-full" onClick={() => setOpen(false)}>
                  Let's build it together
                  <ArrowUpRight className="h-4 w-4" />
                </ButtonLink>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

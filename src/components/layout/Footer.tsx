import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { Link, useLocation } from "react-router";
import { navLinks, profile } from "../../data/content";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { ButtonLink } from "../ui/Button";
import { Emblem } from "../ui/Crosshairs";

export function Footer() {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  return (
    <footer className="overflow-hidden bg-mirage text-sand">
      <div className="container-page pt-16">
        {/* No "start your project" pitch on the contact page itself — the form is right above. */}
        {pathname !== "/contact" && (
        <div className="flex flex-col gap-8 border-b border-sand/15 pb-12 md:flex-row md:items-end md:justify-between">
          <p className="display max-w-xl text-3xl sm:text-4xl">
            Got an idea you care about? <span className="text-blaze">Let's build it together.</span>
          </p>
          <ButtonLink href="/contact" variant="accent" size="lg" className="shrink-0">
            Say hello
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
        </div>
        )}

        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <Emblem className="h-8 w-8 text-blaze" />
              <span className="label text-sm">{profile.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand/60">{profile.role}</p>
            <a href={`mailto:${profile.email}`} className="mt-5 inline-flex items-center gap-2 text-sm hover:text-blaze">
              <Mail className="h-4 w-4 text-blaze" aria-hidden />
              {profile.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="label text-sand/50">Navigate</p>
            <ul className="mt-4 space-y-2.5">
              {[{ label: "Home", href: "/" }, ...navLinks].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-sand/70 transition-colors hover:text-blaze">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label text-sand/50">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-sand/70 transition-colors hover:text-blaze">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-sand/70 transition-colors hover:text-blaze">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-sm text-sand/70 transition-colors hover:text-blaze">
                  <Mail className="h-4 w-4" /> Email
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the page edge */}
      <p aria-hidden className="display -mb-[0.18em] text-center text-[8.6vw] leading-[0.8] whitespace-nowrap text-sand/[0.07] select-none">
        Kunal Charde
      </p>

      <div className="border-t border-sand/10">
        <div className="container-page flex flex-col-reverse gap-4 py-5 text-xs text-sand/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-blaze"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

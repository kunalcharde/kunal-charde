import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "../components/ui/Button";
import { usePageTitle } from "../lib/usePageTitle";

export function NotFound() {
  usePageTitle("Page not found");
  return (
    <section className="container-page flex min-h-[80vh] flex-col items-start justify-center pt-24">
      <p className="font-sans font-medium tabular-nums text-xs tracking-[0.2em] text-blaze-ink uppercase">404 · Lost at sea</p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">
        This container <span className="text-outline">never shipped.</span>
      </h1>
      <ButtonLink href="/" size="lg" className="mt-10">
        Back to the dock
        <ArrowUpRight className="h-4 w-4" />
      </ButtonLink>
    </section>
  );
}

import { ProjectArc } from "../components/sections/ProjectArc";
import { Services } from "../components/sections/Services";
import { Skills } from "../components/sections/Skills";
import { WhyMe } from "../components/sections/WhyMe";
import { usePageTitle } from "../lib/usePageTitle";

export function ServicesPage() {
  usePageTitle("Services");
  return (
    <div className="pt-8">
      <Services />
      <ProjectArc />
      <div className="border-t border-line">
        <Skills />
      </div>
      <div className="border-t border-line">
        <WhyMe />
      </div>
    </div>
  );
}

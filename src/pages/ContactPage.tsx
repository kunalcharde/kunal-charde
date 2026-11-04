import { Contact } from "../components/sections/Contact";
import { usePageTitle } from "../lib/usePageTitle";

export function ContactPage() {
  usePageTitle("Contact");
  return (
    <div className="bg-sea pt-10">
      <Contact />
    </div>
  );
}

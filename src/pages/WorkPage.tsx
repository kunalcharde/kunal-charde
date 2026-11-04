import { Work } from "../components/sections/Work";
import { usePageTitle } from "../lib/usePageTitle";

export function WorkPage() {
  usePageTitle("Work");
  return <Work />;
}

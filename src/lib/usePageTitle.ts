import { useEffect } from "react";

const SITE = "Kunal Charde";

/** Sets the browser tab title for a page ("Work — Kunal Charde"); pass nothing for the home page's full title. */
export function usePageTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} | ${SITE}` : `${SITE} | Full-Stack Developer & AI Solutions Consultant`;
  }, [page]);
}

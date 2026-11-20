import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const SITE = "https://kunal-charde.vercel.app";

/**
 * Puts the site's stylesheet straight into index.html instead of linking to it. A linked stylesheet is a separate
 * request the browser must finish before it shows anything; inline, the first view can paint as soon as the HTML
 * arrives. (The stylesheet is about 15 KB compressed, so the page stays small.)
 */
function inlineCss(): Plugin {
  return {
    name: "inline-css",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const html = Object.values(bundle).find((f) => f.type === "asset" && f.fileName === "index.html");
      if (!html || html.type !== "asset") return;
      let source = String(html.source);
      for (const file of Object.values(bundle)) {
        if (file.type !== "asset" || !file.fileName.endsWith(".css")) continue;
        const link = new RegExp(`<link[^>]+href="/${file.fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`);
        if (!link.test(source)) continue;
        source = source.replace(link, () => `<style>${String(file.source)}</style>`);
        delete bundle[file.fileName];
      }
      html.source = source;
    },
  };
}

/** Writes sitemap.xml and robots.txt from the site's pages, so a new case study is listed without extra work. */
function sitemap(): Plugin {
  return {
    name: "sitemap",
    apply: "build",
    async generateBundle() {
      const { caseStudies } = await import("./src/data/content");
      const paths = ["/", "/work", "/services", "/contact", ...caseStudies.map((c: { id: string }) => `/work/${c.id}`)];
      const urls = paths.map((p) => `  <url><loc>${SITE}${p === "/" ? "/" : p}</loc></url>`).join("\n");
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n` });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCss(), sitemap()],
});

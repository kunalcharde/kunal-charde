# Kunal Charde · Portfolio

Personal portfolio and freelance site for Kunal Charde, Full-Stack Developer & AI Solutions Consultant.

Built with React, TypeScript, Vite, Tailwind CSS v4, Framer Motion and Lucide icons.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Contact form

Submissions are delivered to your inbox by [Web3Forms](https://web3forms.com) (free, no backend needed).

1. Create an access key at web3forms.com using `kunalcharde1@gmail.com`.
2. Copy `.env.example` to `.env.local` (or set the variable in your host's dashboard) and fill in `VITE_WEB3FORMS_KEY`.
3. Rebuild/redeploy.

Without a key the form still works: it opens the visitor's email app with the enquiry pre-filled.

## Pages

| Route       | What's on it                                                              |
| ----------- | ------------------------------------------------------------------------- |
| `/`         | The "How your idea ships" story, About, and links to the other pages     |
| `/work`     | Project cards and client work (no heavy animation)                        |
| `/work/:id` | A project's full story: problem, approach, architecture, trade-offs       |
| `/services` | Services, the tools I build with, why build with me                       |
| `/contact`  | Contact form                                                              |

The orange domains strip and the footer appear on every page. Routing uses React Router (`src/App.tsx`);
page components live in `src/pages/`.

## Editing content

Long-form case study pages (problem, approach, architecture layers, request flow, decisions) live in `src/data/caseStudyDetails.ts`.
All copy lives in `src/data/content.ts`: services, case studies, client work, skills, process, experience and contact links.
Case-study visuals are illustrative mockups built in code (`src/components/visuals/Mockups.tsx`), not client screenshots.

## "How your idea ships" (the hero)

The page opens on a scroll-scrubbed story in `src/components/sections/Journey.tsx`, with no text at first so the animation
can speak for itself; the navbar and the call to action appear at the finale. As you scroll, a CI/CD crane loads a `YOUR-IDEA` container onto a truck,
the truck drives past the services manifest, then (top-down) passes a checkpoint gate for each step in `milestones`
(`src/data/content.ts`) before the container is craned onto a ship stacked with the rest of the system and sails to production.
Timings live in the `T` table at the top of the file; visitors with reduced motion get a static list instead.

## Design

Palette (defined as tokens in `src/index.css`):

| Name           | Hex       | Use                               |
| -------------- | --------- | --------------------------------- |
| Mirage         | `#16232A` | Text, dark sections and cards     |
| Blaze Orange   | `#FF5B04` | Accent blocks, CTAs, highlights   |
| Deep Sea Green | `#075056` | Secondary panels, contact section |
| Wild Sand      | `#E4EEF0` | Page background                   |

Display type is Archivo at its widest width; body copy is Geist.

## Structure

```
src/
  data/content.ts           all site copy
  lib/contact.ts            form validation + delivery
  components/
    layout/                 Navbar, Footer
  pages/                    Home, WorkPage, ServicesPage, ContactPage, NotFound
    sections/               Journey (hero), Hero (PORTFOLIO poster), TrustBar, Services, Work, Showreel, Skills, WhyMe, About, Contact
    visuals/                CardWheel, WaveWord, Mockups, Frames, JourneyArt
    ui/                     Button, Reveal, SectionHeading, Crosshairs/Emblem, BrandIcons
```

## Deploying

Any static host works (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront). Build command `npm run build`, output directory `dist`.
Because the site has real page URLs, the host must serve `index.html` for unknown paths: `vercel.json` (Vercel) and
`public/_redirects` (Netlify / Cloudflare Pages) already do this; on S3 + CloudFront, set the error document to `index.html`.
After choosing a domain, make the `og:image` / `twitter:image` URLs in `index.html` absolute (e.g. `https://yourdomain.com/og-image.png`) so link previews render on every platform.

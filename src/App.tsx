import { lazy, Suspense, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Outlet, Route, Routes, useLocation } from "react-router";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { TrustBar } from "./components/sections/TrustBar";
import { Home } from "./pages/Home";

// The home page loads eagerly; the other pages are split out so the story paints fast.
const WorkPage = lazy(() => import("./pages/WorkPage").then((m) => ({ default: m.WorkPage })));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage").then((m) => ({ default: m.CaseStudyPage })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

/**
 * New page → start at the top. Link with a hash (e.g. /#about) → scroll to that element,
 * retrying for a moment because lazily loaded pages mount a little after navigation.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    let frame = 0;
    let tries = 0;
    const seek = () => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "instant" });
      else if (tries++ < 60) frame = requestAnimationFrame(seek);
    };
    seek();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

function Layout() {
  return (
    <>
      <ScrollManager />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Outlet />
        </Suspense>
      </main>
      {/* Experience + domains strip sits above the footer on every page */}
      <TrustBar />
      <Footer />
      {/* Vercel Web Analytics: page views across every route */}
      <Analytics />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="work" element={<WorkPage />} />
            <Route path="work/:id" element={<CaseStudyPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}

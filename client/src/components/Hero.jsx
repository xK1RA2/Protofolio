import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "../lib/gsap";
import { profile } from "../data/profile";
import { scrollToHash } from "../lib/scroll";

// The three stages of building a site, named after the work in the experience section.
const stages = ["Architecture", "Theming", "Modules"];

const stroke = { stroke: "currentColor", strokeWidth: 1.5, fill: "none", pathLength: 1 };

function SiteSketch() {
  return (
    <svg
      viewBox="0 0 440 520"
      role="img"
      aria-label="A website wireframe being built: header, hero, content columns and footer"
      className="sketch w-full h-auto text-paper"
    >
      {/* Browser window */}
      <rect data-draw x="10" y="10" width="420" height="500" {...stroke} />
      <path data-draw d="M10 44H430" {...stroke} />
      <circle cx="30" cy="27" r="4" fill="currentColor" fillOpacity="0.5" />
      <circle cx="46" cy="27" r="4" fill="currentColor" fillOpacity="0.5" />
      <circle cx="62" cy="27" r="4" fill="currentColor" fillOpacity="0.5" />

      {/* Header */}
      <text data-label x="28" y="60" fontSize="11" fill="currentColor" fillOpacity="0.8">Header</text>
      <rect data-draw x="28" y="66" width="384" height="36" {...stroke} />
      <rect data-fill x="28" y="66" width="384" height="36" fill="currentColor" fillOpacity="0.12" />
      <rect data-line x="40" y="78" width="64" height="12" fill="currentColor" />
      <rect data-line x="250" y="81" width="38" height="6" fill="currentColor" fillOpacity="0.7" />
      <rect data-line x="300" y="81" width="38" height="6" fill="currentColor" fillOpacity="0.7" />
      <rect data-line x="350" y="81" width="38" height="6" fill="currentColor" fillOpacity="0.7" />

      {/* Hero */}
      <text data-label x="28" y="124" fontSize="11" fill="currentColor" fillOpacity="0.8">Hero</text>
      <rect data-draw x="28" y="130" width="384" height="156" {...stroke} />
      <rect data-line x="48" y="150" width="210" height="18" fill="currentColor" />
      <rect data-line x="48" y="176" width="160" height="18" fill="currentColor" />
      <rect data-line x="48" y="208" width="230" height="6" fill="currentColor" fillOpacity="0.7" />
      <rect data-line x="48" y="222" width="190" height="6" fill="currentColor" fillOpacity="0.7" />
      <rect data-draw x="48" y="244" width="96" height="26" {...stroke} />
      <rect data-module x="48" y="244" width="96" height="26" fill="var(--color-marker)" />
      <rect data-draw x="304" y="150" width="88" height="120" {...stroke} />
      <rect data-fill x="304" y="150" width="88" height="120" fill="currentColor" fillOpacity="0.2" />

      {/* Content */}
      <text data-label x="28" y="312" fontSize="11" fill="currentColor" fillOpacity="0.8">Content</text>
      {[28, 160, 292].map((x, i) => (
        <g key={x}>
          <rect data-draw x={x} y="318" width="120" height="110" {...stroke} />
          <rect data-fill x={x + 10} y="328" width="100" height="44" fill="currentColor" fillOpacity="0.2" />
          <rect data-line x={x + 10} y="384" width="80" height="6" fill="currentColor" fillOpacity="0.7" />
          <rect data-line x={x + 10} y="398" width="60" height="6" fill="currentColor" fillOpacity="0.7" />
          {i === 1 && (
            <rect data-module x={x + 10} y="328" width="100" height="44" fill="var(--color-marker)" />
          )}
        </g>
      ))}

      {/* Footer */}
      <text data-label x="28" y="446" fontSize="11" fill="currentColor" fillOpacity="0.8">Footer</text>
      <rect data-draw x="28" y="452" width="384" height="44" {...stroke} />
      <rect data-fill x="28" y="452" width="384" height="44" fill="currentColor" fillOpacity="0.12" />
      <rect data-module x="40" y="466" width="110" height="16" fill="var(--color-marker)" />
    </svg>
  );
}

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // The one orchestrated moment: name rises, then the site is built in three stages.
      mm.add(MOTION_OK, () => {
        // Each stage caption lights up in marker yellow and stays lit, like a checklist.
        const on = (tl, i, pos) =>
          tl.to(
            `[data-stage="${i}"]`,
            { backgroundSize: "100% 100%", color: "#14201c", duration: 0.35, ease: "power2.out" },
            pos
          );

        const tl = gsap.timeline({ delay: 0.25, defaults: { ease: "power3.out" } });

        tl.from("[data-word]", { yPercent: 110, duration: 1, stagger: 0.12, ease: "power4.out" })
          .from("[data-hero-copy]", { y: 14, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.55")
          // 1. Architecture: outlines are drawn, regions are named.
          .from("[data-draw]", { strokeDashoffset: 1, duration: 0.9, stagger: 0.07, ease: "power2.inOut" }, 0.5)
          .from("[data-label]", { opacity: 0, duration: 0.4, stagger: 0.1 }, ">-0.5");
        on(tl, 0, "<");

        // 2. Theming: surfaces fill, type lines are set.
        tl.from("[data-fill]", { fillOpacity: 0, duration: 0.7, stagger: 0.08 }, ">0.25")
          .from("[data-line]", { scaleX: 0, duration: 0.55, stagger: 0.035, ease: "power2.out" }, "<0.1");
        on(tl, 1, "<");

        // 3. Modules: the interactive parts snap in, in marker yellow.
        tl.from("[data-module]", { scale: 0, duration: 0.5, stagger: 0.14, ease: "back.out(2.6)" }, ">0.15");
        on(tl, 2, "<");
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="top"
      data-sheet
      className="relative bg-sheet text-paper min-h-screen flex items-center"
    >
      <div className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <h1 className="display text-[clamp(2.4rem,9.5vw,4.75rem)] lg:text-[clamp(3rem,5.1vw,4.75rem)]">
            {profile.name.split(" ").map((w) => (
              <span key={w} className="block overflow-hidden pb-[0.08em]">
                <span data-word className="block whitespace-nowrap">
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <p data-hero-copy className="mt-8 text-xl sm:text-2xl font-semibold">
            {profile.title}
          </p>
          <p data-hero-copy className="prose-serif mt-4 max-w-[34rem] text-lg text-paper/85">
            {profile.summary}
          </p>

          <div data-hero-copy className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash("#contact");
              }}
              className="bg-marker text-ink font-semibold px-6 py-3 transition-transform hover:-translate-y-0.5"
            >
              Start a project
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash("#projects");
              }}
              className="font-semibold underline underline-offset-4 decoration-paper/50 hover:decoration-marker"
            >
              See the work
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <SiteSketch />
          <ol className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold" aria-label="How a site gets built">
            {stages.map((s, i) => (
              <li key={s} data-stage={i} className="stage">
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

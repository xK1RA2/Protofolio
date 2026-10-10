import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "../lib/gsap";
import { profile } from "../data/profile";
import { scrollToHash } from "../lib/scroll";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const root = useRef(null);
  const menu = useRef(null);
  const [onSheet, setOnSheet] = useState(true); // header currently sits over a dark sheet
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Header colours follow whichever sheet is under it; the active link follows the
  // section crossing the middle of the viewport.
  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate() {
          const probe = 36;
          const sheet = [...document.querySelectorAll("[data-sheet]")].some((el) => {
            const r = el.getBoundingClientRect();
            return r.top <= probe && r.bottom > probe;
          });
          setOnSheet(sheet);

          const mid = window.innerHeight / 2;
          const current = links.find(({ href }) => {
            const r = document.querySelector(href)?.getBoundingClientRect();
            return r && r.top <= mid && r.bottom > mid;
          });
          setActive(current ? current.href : "");
        },
      });
    },
    { scope: root }
  );

  // Mobile menu items cascade in when it opens.
  useGSAP(
    () => {
      if (!open || !menu.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(menu.current.children, { y: -10, opacity: 0, duration: 0.35, stagger: 0.04, ease: "power3.out" });
      });
    },
    { dependencies: [open], scope: root }
  );

  const go = (e, hash) => {
    e.preventDefault();
    setOpen(false);
    scrollToHash(hash);
  };

  const surface = onSheet && !open ? "text-paper" : "bg-paper/95 text-ink backdrop-blur border-b border-ink/15";
  const linkBase = "px-2 py-1 transition-colors";
  const linkOn = "bg-marker text-ink";

  return (
    <header ref={root} className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${surface}`}>
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4" aria-label="Main">
        <a href="#top" onClick={(e) => go(e, "#top")} className="font-semibold tracking-tight">
          {profile.name}
        </a>

        <ul className="hidden md:flex items-center gap-4 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                aria-current={active === l.href ? "true" : undefined}
                className={`${linkBase} ${active === l.href ? linkOn : "hover:bg-marker hover:text-ink"}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 font-semibold text-sm"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" ref={menu} className="md:hidden flex flex-col px-6 pb-4 text-lg font-medium">
          {links.map((l) => (
            <li key={l.href} className="border-t border-ink/15">
              <a href={l.href} onClick={(e) => go(e, l.href)} className="block py-3">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

import { motion } from "framer-motion";
import { education } from "../data/profile";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stats = [
  { label: "Focused on", value: "Drupal 11" },
  { label: "Backend", value: "PHP / Laravel" },
  { label: "Degree", value: "CIS, 2025" },
  { label: "Based in", value: "Amman, JO" },
];

export default function About() {
  return (
    <section id="about" className="section-pad">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="grid md:grid-cols-5 gap-12 items-start"
        >
          <div className="md:col-span-2">
            <p className="font-mono text-accent text-sm mb-3">01 — About</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Building on the web, from the ground up.</h2>
          </div>

          <div className="md:col-span-3 space-y-8">
            <p className="text-muted text-lg leading-relaxed">
              I'm a software engineer who builds full websites from scratch — from information
              architecture and theming to module configuration and backend logic. My day-to-day work
              centers on Drupal 11, with PHP and Laravel powering the backend of client projects. I
              come from a Computer Information Systems background and have backed that up with over
              250 hours of applied full-stack coursework, so I keep sharpening the fundamentals while
              shipping real work.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="card p-4">
                  <p className="text-xs text-muted uppercase tracking-wide">{s.label}</p>
                  <p className="mt-1 font-semibold text-text">{s.value}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted">
              <span className="text-text font-medium">{education.degree}</span> — {education.status}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

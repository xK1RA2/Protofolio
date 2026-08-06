import { motion } from "framer-motion";
import { projects } from "../data/profile";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Projects() {
  return (
    <section id="projects" className="section-pad bg-surface/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-mono text-accent text-sm mb-3"
        >
          04 — Projects
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold mb-2"
        >
          Selected work.
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-muted mb-12"
        >
          Replace these placeholder cards in{" "}
          <code className="text-accent font-mono text-sm">src/data/profile.js</code> with real projects.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.title + i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="card p-6 flex flex-col group hover:border-accent/50 transition-colors"
            >
              {p.placeholder && (
                <span className="text-xs font-mono text-accent-2 mb-3 uppercase tracking-wide">
                  Placeholder
                </span>
              )}
              <h3 className="text-lg font-semibold text-text mb-2">{p.title}</h3>
              <p className="text-muted text-sm leading-relaxed flex-1">{p.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-surface-2 border border-border px-2.5 py-1 text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

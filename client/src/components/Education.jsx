import { motion } from "framer-motion";
import { education, courses, languages } from "../data/profile";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Education() {
  return (
    <section id="education" className="section-pad">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-mono text-accent text-sm mb-3"
        >
          05 — Education
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold mb-12"
        >
          Learning, continuously.
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="card p-6 mb-8"
            >
              <p className="text-xs font-mono text-muted uppercase tracking-wide mb-2">Degree</p>
              <h3 className="font-semibold text-text">{education.degree}</h3>
              <p className="text-muted text-sm mt-1">{education.status}</p>
            </motion.div>

            <motion.h3
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-sm font-mono text-muted uppercase tracking-wide mb-4"
            >
              Courses & Certifications
            </motion.h3>
            <div className="space-y-3">
              {courses.map((c, i) => (
                <motion.div
                  key={c.name + c.provider}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between card px-4 py-3"
                >
                  <div>
                    <p className="text-text text-sm font-medium">{c.name}</p>
                    <p className="text-muted text-xs">{c.provider}</p>
                  </div>
                  <span className="font-mono text-xs text-accent shrink-0 ml-4">{c.hours}h</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <motion.h3
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-sm font-mono text-muted uppercase tracking-wide mb-4"
            >
              Languages
            </motion.h3>
            <div className="space-y-6">
              {languages.map((l, i) => (
                <motion.div
                  key={l.name}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text font-medium">{l.name}</span>
                    <span className="text-muted">{l.level}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

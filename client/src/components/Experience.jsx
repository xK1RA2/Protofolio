import { motion } from "framer-motion";
import { experience } from "../data/profile";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Experience() {
  return (
    <section id="experience" className="section-pad">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-mono text-accent text-sm mb-3"
        >
          03 — Experience
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold mb-12"
        >
          Where I've worked.
        </motion.h2>

        <div className="relative border-l border-border pl-8 space-y-12">
          {experience.map((job, i) => (
            <motion.div
              key={job.company + job.period}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <span className="absolute -left-[calc(2rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-bg" />
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h3 className="text-xl font-semibold text-text">
                  {job.role} <span className="text-muted font-normal">· {job.company}</span>
                </h3>
                <span className="font-mono text-sm text-muted">{job.period}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {job.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-muted leading-relaxed">
                    <span className="text-accent mt-1.5">▹</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

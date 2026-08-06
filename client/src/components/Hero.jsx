import { motion } from "framer-motion";
import { profile } from "../data/profile";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center noise-bg overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full bg-accent-2/10 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-6 pt-24 w-full"
      >
        <motion.p
          variants={item}
          className="font-mono text-sm text-accent mb-6 flex items-center gap-2"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
          Available for new projects
        </motion.p>

        <motion.h1
          variants={item}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 text-xl sm:text-2xl text-gradient font-semibold"
        >
          {profile.title}
        </motion.p>

        <motion.p variants={item} className="mt-6 max-w-2xl text-muted text-lg leading-relaxed">
          {profile.summary}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="rounded-full bg-accent text-[#04120c] font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-6 py-3 text-text hover:border-accent hover:text-accent transition-colors"
          >
            Get In Touch
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-16 flex flex-wrap gap-x-10 gap-y-3 text-sm text-muted font-mono">
          <span>{profile.location}</span>
          <span>{profile.phone}</span>
          <span>{profile.email}</span>
        </motion.div>
      </motion.div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted hover:text-accent transition-colors"
        aria-label="Scroll to about section"
      >
        <div className="w-5 h-9 rounded-full border border-current flex justify-center pt-2">
          <div className="w-1 h-1.5 rounded-full bg-current animate-bounce" />
        </div>
      </a>
    </section>
  );
}

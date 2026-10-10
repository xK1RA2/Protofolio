import { experience } from "../data/profile";
import Section from "./Section";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="ledger">
        {experience.map((job) => (
          <article key={job.company + job.period} className="grid sm:grid-cols-3 gap-x-6 gap-y-3 py-7">
            <p className="text-graphite font-medium">{job.period}</p>
            <div className="sm:col-span-2">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {job.role}, {job.company}
              </h3>
              <ul className="prose-serif mt-5 space-y-3 text-lg max-w-[60ch]">
                {job.bullets.map((b) => (
                  <li key={b} className="pl-5 relative before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-3 before:bg-ink">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

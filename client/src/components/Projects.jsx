import { projects } from "../data/profile";
import Section from "./Section";

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="ledger">
        {projects.map((p) => (
          <article key={p.title} className="grid sm:grid-cols-3 gap-x-6 gap-y-5 py-7">
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-1 text-graphite font-medium">{p.kind}</p>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="mark-link mt-4 inline-block font-semibold">
                  {p.linkLabel}
                </a>
              )}
            </div>

            <div className="sm:col-span-2">
              <dl className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                <dt className="font-semibold">Stack</dt>
                <dd className="text-graphite font-medium">{p.stack.join(", ")}</dd>
              </dl>
              <ul className="prose-serif mt-5 space-y-3 text-lg max-w-[62ch]">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className="pl-5 relative before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-3 before:bg-ink"
                  >
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

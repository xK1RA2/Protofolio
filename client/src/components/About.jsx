import { education, courses, languages, profile } from "../data/profile";
import Section from "./Section";

const totalHours = courses.reduce((sum, c) => sum + c.hours, 0);

const facts = [
  { term: "Based in", detail: profile.location },
  { term: "Degree", detail: `${education.degree} (${education.status.toLowerCase()})` },
  { term: "Training", detail: `${totalHours} hours across ${courses.length} courses` },
  { term: "Languages", detail: languages.map((l) => l.name).join(", ") },
  { term: "GitHub", detail: profile.socials.github.replace("https://", ""), href: profile.socials.github },
];

export default function About() {
  return (
    <Section id="about" title="About">
      <p className="prose-serif text-2xl sm:text-3xl leading-snug max-w-[40ch] sm:max-w-[46ch]">
        I build client websites from scratch with Drupal 11, and full-stack applications with PHP and Laravel.
        I care about secure, maintainable code.
      </p>

      <dl className="ledger mt-14">
        {facts.map((f) => (
          <div key={f.term} className="grid sm:grid-cols-3 gap-x-6 gap-y-1 py-4">
            <dt className="text-graphite font-medium">{f.term}</dt>
            <dd className="sm:col-span-2 font-medium">
              {f.href ? (
                <a href={f.href} target="_blank" rel="noreferrer" className="mark-link">
                  {f.detail}
                </a>
              ) : (
                f.detail
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

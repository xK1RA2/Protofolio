import { education, courses, languages } from "../data/profile";
import Section from "./Section";

export default function Education() {
  return (
    <Section id="education" title="Education">
      <div className="ledger">
        <div className="grid sm:grid-cols-3 gap-x-6 gap-y-2 py-7">
          <h3 className="text-graphite font-medium">Degree</h3>
          <p className="sm:col-span-2 text-2xl font-semibold tracking-tight">
            {education.degree}
            <span className="block text-base font-medium text-graphite mt-1">{education.status}</span>
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-x-6 gap-y-3 py-7">
          <h3 className="text-graphite font-medium">Courses</h3>
          <table className="sm:col-span-2 w-full text-left">
            <thead className="sr-only">
              <tr>
                <th>Course</th>
                <th>Provider</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/15">
              {courses.map((c) => (
                <tr key={c.name + c.provider}>
                  <td className="py-3 pr-4 font-semibold">{c.name}</td>
                  <td className="py-3 pr-4 text-graphite">{c.provider}</td>
                  <td className="py-3 text-right tabular-nums font-medium">{c.hours} h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-3 gap-x-6 gap-y-4 py-7">
          <h3 className="text-graphite font-medium">Languages</h3>
          <ul className="sm:col-span-2 space-y-5">
            {languages.map((l) => (
              <li key={l.name}>
                <div className="flex justify-between gap-4 font-semibold">
                  <span>{l.name}</span>
                  <span className="font-medium text-graphite">{l.level}</span>
                </div>
                <div className="mt-2 h-1 bg-ink/15" role="presentation">
                  <div className="h-full bg-sheet" style={{ width: `${l.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

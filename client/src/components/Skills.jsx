import { skills } from "../data/profile";
import Section from "./Section";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="ledger">
        {skills.map((group) => (
          <div key={group.category} className="grid sm:grid-cols-3 gap-x-6 gap-y-3 py-7">
            <h3 className="text-graphite font-medium">{group.category}</h3>
            <ul className="sm:col-span-2 flex flex-wrap gap-x-7 gap-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

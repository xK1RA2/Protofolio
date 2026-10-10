// Spec-sheet layout: a narrow heading column beside a wide content column.
export default function Section({ id, title, intro, children }) {
  return (
    <section id={id} className="border-t border-ink/15 first:border-t-0 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-x-10 gap-y-8">
        <div className="md:col-span-3">
          <h2 className="display text-3xl sm:text-4xl md:sticky md:top-24">{title}</h2>
          {intro && <p className="mt-3 text-sm text-graphite max-w-xs">{intro}</p>}
        </div>
        <div className="md:col-span-9">{children}</div>
      </div>
    </section>
  );
}

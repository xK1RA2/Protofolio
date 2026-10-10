import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "../lib/gsap";
import { profile } from "../data/profile";
import { scrollToHash } from "../lib/scroll";
import { apiUrl } from "../lib/api";

const initialForm = { name: "", email: "", message: "", website: "" }; // website = honeypot

const fieldClass =
  "w-full bg-transparent border-0 border-b border-paper/50 py-2.5 text-paper placeholder:text-paper/50 focus:border-marker focus:outline-none transition-colors";

export default function Contact() {
  const root = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Answer the action: the confirmation lands like a stamp.
  useGSAP(
    () => {
      if (status !== "sent") return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-stamp]", { scale: 1.6, rotate: -8, opacity: 0, duration: 0.45, ease: "power4.out" });
      });
    },
    { dependencies: [status], scope: root }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The message could not be sent. Please try again.");
      setStatus("sent");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const block = [
    { term: "Drawn by", detail: profile.name },
    { term: "Based in", detail: profile.location },
    { term: "Phone", detail: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { term: "Email", detail: profile.email, href: `mailto:${profile.email}` },
    { term: "GitHub", detail: profile.socials.github.replace("https://", ""), href: profile.socials.github },
  ];

  return (
    <section ref={root} id="contact" data-sheet className="bg-sheet text-paper pt-20 sm:pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-12 gap-x-10 gap-y-10">
          <div className="md:col-span-5">
            <h2 className="display text-4xl sm:text-5xl md:text-6xl">Have a project in mind?</h2>
            <p className="prose-serif mt-6 text-lg text-paper/85 max-w-[30rem]">
              Tell me what you want to build and send it here, or write to me directly at the address below.
            </p>
          </div>

          <form onSubmit={onSubmit} className="md:col-span-7 space-y-6" noValidate={false}>
            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-paper/80">
                Your name
              </label>
              <input
                id="name"
                name="name"
                required
                autoComplete="name"
                value={form.name}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-paper/80">
                Your email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-paper/80">
                What are you building?
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={onChange}
                className={`${fieldClass} resize-none`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-marker text-ink font-semibold px-7 py-3 transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>

              <p role="status" className="min-h-[1.5rem]">
                {status === "sent" && (
                  <span data-stamp className="inline-block border-2 border-marker text-marker font-bold px-3 py-1">
                    Message sent
                  </span>
                )}
                {status === "error" && <span className="font-medium">{errorMsg}</span>}
              </p>
            </div>
          </form>
        </div>

        {/* Title block, as on a drawing sheet. */}
        <dl className="mt-20 grid grid-cols-2 lg:grid-cols-5 gap-px border border-paper/50 bg-paper/50">
          {block.map((b, i) => (
            <div
              key={b.term}
              className={`bg-sheet p-4 ${i === block.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
            >
              <dt className="text-sm text-paper/70">{b.term}</dt>
              <dd className="mt-1 font-semibold break-words">
                {b.href ? (
                  <a href={b.href} className="mark-link">
                    {b.detail}
                  </a>
                ) : (
                  b.detail
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-paper/80">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <button onClick={() => scrollToHash("#top")} className="mark-link font-semibold">
            Back to top
          </button>
        </div>
      </div>
    </section>
  );
}

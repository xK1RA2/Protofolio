import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "../data/profile";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <section id="contact" className="section-pad">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-mono text-accent text-sm mb-3 text-center"
        >
          06 — Contact
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold mb-4 text-center"
        >
          Let's build something.
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-muted text-center max-w-xl mx-auto mb-12"
        >
          Have a project in mind, or just want to say hi? My inbox is open.
        </motion.p>

        <div className="grid md:grid-cols-5 gap-10 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="md:col-span-2 space-y-6"
          >
            <div>
              <p className="text-xs font-mono text-muted uppercase tracking-wide mb-1">Email</p>
              <a href={`mailto:${profile.email}`} className="text-text hover:text-accent transition-colors">
                {profile.email}
              </a>
            </div>
            <div>
              <p className="text-xs font-mono text-muted uppercase tracking-wide mb-1">Phone</p>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="text-text hover:text-accent transition-colors">
                {profile.phone}
              </a>
            </div>
            <div>
              <p className="text-xs font-mono text-muted uppercase tracking-wide mb-1">Location</p>
              <p className="text-text">{profile.location}</p>
            </div>
          </motion.div>

          <motion.form
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            onSubmit={onSubmit}
            className="md:col-span-3 space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-xs font-mono text-muted uppercase tracking-wide mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={onChange}
                className="w-full rounded-lg bg-surface-2 border border-border px-4 py-2.5 text-text outline-none focus:border-accent transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-muted uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={onChange}
                className="w-full rounded-lg bg-surface-2 border border-border px-4 py-2.5 text-text outline-none focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-mono text-muted uppercase tracking-wide mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={onChange}
                className="w-full rounded-lg bg-surface-2 border border-border px-4 py-2.5 text-text outline-none focus:border-accent transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-accent text-[#04120c] font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "sent" && (
              <p className="text-accent text-sm">Thanks — your message has been sent.</p>
            )}
            {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

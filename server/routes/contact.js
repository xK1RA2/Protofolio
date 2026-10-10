import { Router } from "express";
import rateLimit from "express-rate-limit";
import { sendContactEmail } from "../lib/mailer.js";
import { db } from "../lib/db.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Control characters (except tab and newline) are never legitimate in a contact message.
// Built from a string so the source file contains no raw control bytes.
const CONTROL_CHARS = new RegExp("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "g");
const clean = (s) => s.replace(CONTROL_CHARS, "").trim();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later." },
});

router.post("/", contactLimiter, async (req, res) => {
  const { name, email, message, website } = req.body ?? {};

  // Honeypot: real visitors never see or fill this field; bots do. Pretend it worked.
  if (typeof website === "string" && website.trim() !== "") {
    return res.status(200).json({ ok: true, delivered: false });
  }

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  // The name ends up in an email subject, so collapse any line breaks to spaces.
  const trimmedName = clean(name.replace(/[\r\n]+/g, " "));
  const trimmedEmail = clean(email);
  const trimmedMessage = clean(message);

  if (!trimmedName || trimmedName.length > 100) {
    return res.status(400).json({ error: "Please provide a valid name." });
  }
  if (!EMAIL_RE.test(trimmedEmail) || trimmedEmail.length > 200) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  if (!trimmedMessage || trimmedMessage.length > 5000) {
    return res.status(400).json({ error: "Message must be between 1 and 5000 characters." });
  }

  const entry = { name: trimmedName, email: trimmedEmail, message: trimmedMessage };

  try {
    // The database is the durable record; email is a best-effort notification on top.
    await db.add(entry);
    let delivered = false;
    try {
      delivered = (await sendContactEmail(entry)).sent;
    } catch (mailErr) {
      console.error("Contact email failed (message is saved):", mailErr.message);
    }
    return res.status(200).json({ ok: true, delivered });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "Could not process your message right now." });
  }
});

export default router;

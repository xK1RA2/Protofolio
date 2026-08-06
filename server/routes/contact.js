import { Router } from "express";
import rateLimit from "express-rate-limit";
import { sendContactEmail } from "../lib/mailer.js";
import { saveMessage } from "../lib/storage.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later." },
});

router.post("/", contactLimiter, async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

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
    await saveMessage(entry);
    const result = await sendContactEmail(entry);
    return res.status(200).json({
      ok: true,
      delivered: result.sent,
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "Could not process your message right now." });
  }
});

export default router;

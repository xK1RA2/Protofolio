import { Router } from "express";
import rateLimit from "express-rate-limit";
import { db } from "../lib/db.js";
import { adminConfigured, issueToken, passwordMatches, requireAdmin } from "../lib/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Try again in 15 minutes." },
});

router.post("/login", loginLimiter, (req, res) => {
  if (!adminConfigured()) {
    return res.status(503).json({ error: "Admin is not configured. Set ADMIN_PASSWORD on the server." });
  }
  if (!passwordMatches(req.body?.password)) {
    return res.status(401).json({ error: "Wrong password." });
  }
  return res.json(issueToken());
});

router.use(requireAdmin);

router.get("/messages", async (req, res, next) => {
  try {
    const unreadOnly = req.query.filter === "unread";
    const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
    const [messages, counts] = await Promise.all([db.list({ unreadOnly, q }), db.counts()]);
    res.json({ messages, counts });
  } catch (err) {
    next(err);
  }
});

const parseId = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid message id." });
    return null;
  }
  return id;
};

router.patch("/messages/:id", async (req, res, next) => {
  const id = parseId(req, res);
  if (id === null) return;
  if (typeof req.body?.read !== "boolean") {
    return res.status(400).json({ error: "Body must include a boolean 'read'." });
  }
  try {
    const found = await db.setRead(id, req.body.read);
    return found ? res.json({ ok: true }) : res.status(404).json({ error: "Message not found." });
  } catch (err) {
    return next(err);
  }
});

router.delete("/messages/:id", async (req, res, next) => {
  const id = parseId(req, res);
  if (id === null) return;
  try {
    const found = await db.remove(id);
    return found ? res.json({ ok: true }) : res.status(404).json({ error: "Message not found." });
  } catch (err) {
    return next(err);
  }
});

export default router;

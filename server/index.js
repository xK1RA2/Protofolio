import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import contactRouter from "./routes/contact.js";
import adminRouter from "./routes/admin.js";
import { initDb } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Behind a host's reverse proxy (Render, Railway, Fly, ...) req.ip would otherwise be the
// proxy's address, making the rate limiters treat every visitor as one person.
if (process.env.TRUST_PROXY !== "0") app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN.split(",").map((s) => s.trim()) }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);

// Serve the built website (the Docker image puts it in ./public). In plain local dev the
// folder does not exist and Vite serves the frontend instead.
const publicDir = process.env.PUBLIC_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), "public");
if (fs.existsSync(path.join(publicDir, "index.html"))) {
  app.use(express.static(publicDir, { index: false, maxAge: "1h" }));
  // Single-page app: any non-API GET for a page (e.g. /admin) returns index.html.
  // Paths that look like files (have an extension) fall through to a real 404.
  app.get(/^(?!\/api(\/|$))(?!.*\.[A-Za-z0-9]+$).*/, (_req, res) => res.sendFile(path.join(publicDir, "index.html")));
}

app.use((req, res) => res.status(404).json({ error: "Not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Client errors raised by middleware (oversized or malformed JSON bodies) keep their status.
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.status === 413 ? "Message is too large." : "Bad request." });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Something went wrong." });
});

await initDb();

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log("ADMIN_PASSWORD is not set: the /admin dashboard is disabled.");
  }
});

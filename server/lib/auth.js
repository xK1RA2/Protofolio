import crypto from "node:crypto";

// Minimal single-admin auth: a password from the environment is exchanged for a
// short-lived HMAC-signed token that the dashboard sends as "Authorization: Bearer".

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest();

function secret() {
  return process.env.ADMIN_SECRET || sha256(`portfolio-admin:${process.env.ADMIN_PASSWORD}`);
}

const b64url = (buf) => Buffer.from(buf).toString("base64url");
const sign = (payload) => crypto.createHmac("sha256", secret()).update(payload).digest();

export function passwordMatches(candidate) {
  if (!adminConfigured() || typeof candidate !== "string") return false;
  return crypto.timingSafeEqual(sha256(candidate), sha256(process.env.ADMIN_PASSWORD));
}

export function issueToken() {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = b64url(JSON.stringify({ exp: expiresAt }));
  return { token: `${payload}.${b64url(sign(payload))}`, expiresAt };
}

export function verifyToken(token) {
  if (typeof token !== "string") return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(req, res, next) {
  if (!adminConfigured()) {
    return res.status(503).json({ error: "Admin is not configured. Set ADMIN_PASSWORD on the server." });
  }
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifyToken(token)) return res.status(401).json({ error: "Please sign in again." });
  next();
}

import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Storage for contact messages.
//  - DATABASE_URL set  -> PostgreSQL (use this in production; survives redeploys)
//  - otherwise         -> SQLite file at server/data/portfolio.db (zero setup, local dev)
// Both adapters expose the same async interface and return the same row shape:
//   { id, name, email, message, read, createdAt }

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const legacyFile = path.join(dataDir, "messages.json");

const LIMIT = 500;

async function sqliteAdapter() {
  const { DatabaseSync } = await import("node:sqlite");
  await mkdir(dataDir, { recursive: true });
  const d = new DatabaseSync(path.join(dataDir, "portfolio.db"));
  d.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      message    TEXT NOT NULL,
      read       INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);

  const toRow = (r) => ({
    id: Number(r.id),
    name: r.name,
    email: r.email,
    message: r.message,
    read: Boolean(r.read),
    createdAt: r.created_at,
  });

  return {
    kind: "sqlite",
    async add({ name, email, message, createdAt = new Date().toISOString() }) {
      const info = d
        .prepare("INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)")
        .run(name, email, message, createdAt);
      return Number(info.lastInsertRowid);
    },
    async list({ unreadOnly = false, q = "" } = {}) {
      const where = [];
      const params = [];
      if (unreadOnly) where.push("read = 0");
      if (q) {
        where.push("(name LIKE ? OR email LIKE ? OR message LIKE ?)");
        params.push(`%${q}%`, `%${q}%`, `%${q}%`);
      }
      const sql = `SELECT * FROM messages ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id DESC LIMIT ${LIMIT}`;
      return d.prepare(sql).all(...params).map(toRow);
    },
    async counts() {
      const r = d.prepare("SELECT COUNT(*) AS total, COALESCE(SUM(read = 0), 0) AS unread FROM messages").get();
      return { total: Number(r.total), unread: Number(r.unread) };
    },
    async setRead(id, read) {
      return d.prepare("UPDATE messages SET read = ? WHERE id = ?").run(read ? 1 : 0, id).changes > 0;
    },
    async remove(id) {
      return d.prepare("DELETE FROM messages WHERE id = ?").run(id).changes > 0;
    },
  };
}

async function postgresAdapter(url) {
  const { default: pg } = await import("pg");
  const needsSsl = !/localhost|127\.0\.0\.1/.test(url);
  const pool = new pg.Pool({
    connectionString: url,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      message    TEXT NOT NULL,
      read       BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const toRow = (r) => ({
    id: Number(r.id),
    name: r.name,
    email: r.email,
    message: r.message,
    read: r.read,
    createdAt: new Date(r.created_at).toISOString(),
  });

  return {
    kind: "postgres",
    async add({ name, email, message, createdAt }) {
      const { rows } = await pool.query(
        "INSERT INTO messages (name, email, message, created_at) VALUES ($1, $2, $3, COALESCE($4::timestamptz, NOW())) RETURNING id",
        [name, email, message, createdAt ?? null]
      );
      return Number(rows[0].id);
    },
    async list({ unreadOnly = false, q = "" } = {}) {
      const where = [];
      const params = [];
      if (unreadOnly) where.push("read = FALSE");
      if (q) {
        params.push(`%${q}%`);
        where.push(`(name ILIKE $1 OR email ILIKE $1 OR message ILIKE $1)`);
      }
      const sql = `SELECT * FROM messages ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id DESC LIMIT ${LIMIT}`;
      const { rows } = await pool.query(sql, params);
      return rows.map(toRow);
    },
    async counts() {
      const { rows } = await pool.query(
        "SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE read = FALSE)::int AS unread FROM messages"
      );
      return { total: rows[0].total, unread: rows[0].unread };
    },
    async setRead(id, read) {
      const r = await pool.query("UPDATE messages SET read = $1 WHERE id = $2", [read, id]);
      return r.rowCount > 0;
    },
    async remove(id) {
      const r = await pool.query("DELETE FROM messages WHERE id = $1", [id]);
      return r.rowCount > 0;
    },
  };
}

// One-time import of the old messages.json (JSON lines) into an empty database.
async function importLegacy(adapter) {
  const { total } = await adapter.counts();
  if (total > 0) return 0;

  let raw;
  try {
    raw = await readFile(legacyFile, "utf8");
  } catch {
    return 0;
  }

  let imported = 0;
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const m = JSON.parse(line);
      if (typeof m.name === "string" && typeof m.email === "string" && typeof m.message === "string") {
        await adapter.add({ name: m.name, email: m.email, message: m.message, createdAt: m.receivedAt });
        imported += 1;
      }
    } catch {
      /* skip malformed line */
    }
  }
  return imported;
}

let adapter;

export async function initDb() {
  adapter = process.env.DATABASE_URL
    ? await postgresAdapter(process.env.DATABASE_URL)
    : await sqliteAdapter();
  const imported = await importLegacy(adapter);
  console.log(`Database ready (${adapter.kind})${imported ? `, imported ${imported} earlier message(s)` : ""}`);
}

export const db = {
  add: (m) => adapter.add(m),
  list: (o) => adapter.list(o),
  counts: () => adapter.counts(),
  setRead: (id, read) => adapter.setRead(id, read),
  remove: (id) => adapter.remove(id),
};

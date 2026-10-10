import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiUrl } from "../lib/api";

// Private inbox for contact-form messages. Not linked from the public site and kept out
// of search indexes; access is gated by ADMIN_PASSWORD on the server.

const TOKEN_KEY = "portfolio-admin-token";

const storage = {
  get() {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || "";
    } catch {
      return "";
    }
  },
  set(v) {
    try {
      if (v) sessionStorage.setItem(TOKEN_KEY, v);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable: session lasts until reload */
    }
  },
};

class AuthError extends Error {}

async function request(path, { token, method = "GET", body } = {}) {
  const res = await fetch(apiUrl(path), {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) throw new AuthError(data.error || "Session expired.");
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

const fullDate = new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" });

function ago(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function SignIn({ onSignedIn }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await request("/api/admin/login", { method: "POST", body: { password } });
      onSignedIn(token);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-sheet px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-paper text-ink p-8">
        <h1 className="display text-3xl">Inbox</h1>
        <p className="mt-2 text-graphite">Sign in to read messages from the contact form.</p>

        <label htmlFor="password" className="block mt-8 text-sm font-medium text-graphite">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full border-0 border-b-2 border-ink/30 bg-transparent py-2 focus:border-sheet focus:outline-none"
        />

        <p role="alert" className="mt-3 min-h-[1.5rem] text-sm font-medium text-red-700">
          {error}
        </p>

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-2 w-full bg-sheet text-paper font-semibold py-3 disabled:opacity-50"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

function Inbox({ token, onSignOut }) {
  const [messages, setMessages] = useState([]);
  const [counts, setCounts] = useState({ total: 0, unread: 0 });
  const [filter, setFilter] = useState("all"); // all | unread
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mobileDetail, setMobileDetail] = useState(false);
  const loadSeq = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    const seq = ++loadSeq.current;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filter === "unread") params.set("filter", "unread");
      if (debounced) params.set("q", debounced);
      const data = await request(`/api/admin/messages?${params}`, { token });
      if (seq !== loadSeq.current) return;
      setMessages(data.messages);
      setCounts(data.counts);
    } catch (err) {
      if (err instanceof AuthError) return onSignOut();
      if (seq === loadSeq.current) setError(err.message);
    } finally {
      if (seq === loadSeq.current) setLoading(false);
    }
  }, [filter, debounced, token, onSignOut]);

  useEffect(() => {
    load();
  }, [load]);

  const selected = useMemo(() => messages.find((m) => m.id === selectedId) || null, [messages, selectedId]);

  const patchLocal = (id, patch) =>
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const setRead = async (m, read) => {
    patchLocal(m.id, { read });
    setCounts((c) => ({ ...c, unread: Math.max(0, c.unread + (read ? -1 : 1)) }));
    try {
      await request(`/api/admin/messages/${m.id}`, { token, method: "PATCH", body: { read } });
    } catch (err) {
      if (err instanceof AuthError) return onSignOut();
      setError(err.message);
      load();
    }
  };

  const open = (m) => {
    setSelectedId(m.id);
    setConfirmDelete(false);
    setMobileDetail(true);
    if (!m.read) setRead(m, true);
  };

  const remove = async (m) => {
    try {
      await request(`/api/admin/messages/${m.id}`, { token, method: "DELETE" });
      setSelectedId(null);
      setConfirmDelete(false);
      setMobileDetail(false);
      load();
    } catch (err) {
      if (err instanceof AuthError) return onSignOut();
      setError(err.message);
    }
  };

  const tab = (value, label, n) => (
    <button
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`px-3 py-1.5 text-sm font-semibold ${
        filter === value ? "bg-ink text-paper" : "text-ink hover:bg-ink/10"
      }`}
    >
      {label} <span className="tabular-nums opacity-70">{n}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="bg-sheet text-paper">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex items-baseline gap-4">
            <h1 className="display text-2xl">Inbox</h1>
            <p className="text-sm text-paper/80" aria-live="polite">
              {counts.unread} unread of {counts.total}
            </p>
          </div>
          <div className="flex items-center gap-5 text-sm font-semibold whitespace-nowrap">
            <a href="/" className="mark-link">
              View site
            </a>
            <button onClick={load} className="mark-link">
              Refresh
            </button>
            <button onClick={onSignOut} className="mark-link">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-6 flex-1 flex flex-col min-h-0">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex border border-ink/20">
            {tab("all", "All", counts.total)}
            {tab("unread", "Unread", counts.unread)}
          </div>
          <label className="flex-1 min-w-[12rem]">
            <span className="sr-only">Search messages</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email or message"
              className="w-full border border-ink/20 bg-transparent px-3 py-2 focus:border-sheet focus:outline-none"
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="mb-4 border border-red-700 text-red-800 px-3 py-2 text-sm font-medium">
            {error}
          </p>
        )}

        <div className="grid md:grid-cols-5 gap-6 flex-1 min-h-0">
          {/* List */}
          <ul
            className={`md:col-span-2 border border-ink/15 divide-y divide-ink/15 overflow-y-auto max-h-[70vh] md:max-h-[calc(100vh-14rem)] ${
              mobileDetail ? "hidden md:block" : ""
            }`}
          >
            {messages.length === 0 && (
              <li className="p-6 text-graphite">
                {loading
                  ? "Loading messages..."
                  : debounced || filter === "unread"
                    ? "No messages match this view."
                    : "No messages yet. They will appear here when someone uses the contact form."}
              </li>
            )}
            {messages.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => open(m)}
                  aria-current={m.id === selectedId ? "true" : undefined}
                  className={`w-full text-left px-4 py-3 block ${
                    m.id === selectedId ? "bg-marker/50" : "hover:bg-ink/5"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 min-w-0">
                      {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-sheet" aria-label="Unread" />}
                      <span className={`truncate ${m.read ? "font-medium" : "font-bold"}`}>{m.name}</span>
                    </span>
                    <span className="shrink-0 text-xs text-graphite">{ago(m.createdAt)}</span>
                  </span>
                  <span className="block text-sm text-graphite truncate">{m.email}</span>
                  <span className="mt-1 block text-sm truncate">{m.message}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Detail */}
          <section
            className={`md:col-span-3 border border-ink/15 p-6 ${mobileDetail ? "" : "hidden md:block"}`}
            aria-label="Message"
          >
            {!selected ? (
              <p className="text-graphite">Select a message to read it.</p>
            ) : (
              <article>
                <button
                  onClick={() => setMobileDetail(false)}
                  className="md:hidden mb-4 text-sm font-semibold mark-link"
                >
                  Back to list
                </button>
                <h2 className="text-2xl font-semibold tracking-tight">{selected.name}</h2>
                <p className="mt-1">
                  <a href={`mailto:${selected.email}`} className="mark-link font-medium break-all">
                    {selected.email}
                  </a>
                </p>
                <p className="mt-1 text-sm text-graphite">{fullDate.format(new Date(selected.createdAt))}</p>

                <p className="prose-serif mt-6 text-lg whitespace-pre-wrap break-words max-w-[65ch]">
                  {selected.message}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: your message")}`}
                    className="bg-sheet text-paper font-semibold px-5 py-2.5"
                  >
                    Reply by email
                  </a>
                  <button
                    onClick={() => setRead(selected, !selected.read)}
                    className="border border-ink/30 font-semibold px-5 py-2.5 hover:bg-ink/5"
                  >
                    {selected.read ? "Mark as unread" : "Mark as read"}
                  </button>
                  {confirmDelete ? (
                    <span className="flex items-center gap-2">
                      <button onClick={() => remove(selected)} className="bg-red-700 text-white font-semibold px-5 py-2.5">
                        Delete for good
                      </button>
                      <button onClick={() => setConfirmDelete(false)} className="font-semibold px-3 py-2.5">
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="font-semibold px-3 py-2.5 text-red-800 hover:bg-red-700/10"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(storage.get);

  useEffect(() => {
    document.title = "Inbox";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const signedIn = (t) => {
    storage.set(t);
    setToken(t);
  };
  const signOut = useCallback(() => {
    storage.set("");
    setToken("");
  }, []);

  return token ? <Inbox token={token} onSignOut={signOut} /> : <SignIn onSignedIn={signedIn} />;
}

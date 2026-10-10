# Mohamad Al-Barghouthi — Portfolio

A full-stack personal portfolio: a React + Tailwind CSS frontend and a Node/Express
backend that handles the contact form.

```
Protofoilo/
├── client/   React 19 + Vite + Tailwind CSS v4 + GSAP
└── server/   Node.js + Express contact API
```

## Quick start

Two servers, two terminals.

**Backend**

```bash
cd server
npm install
cp .env.example .env   # fill in SMTP creds if you want real emails, see below
npm run dev             # http://localhost:5000
```

**Frontend**

```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

Open the frontend URL. In dev, Vite proxies `/api/*` requests to the Express
server on port 5000 (configured in `client/vite.config.js`), so the contact
form works out of the box with no extra setup.

## Contact messages and the admin inbox

Every contact-form submission is saved to a database, then (optionally) emailed to you.

- **Local dev:** a SQLite file at `server/data/portfolio.db` — no setup. Any earlier
  `messages.json` entries are imported the first time the server starts.
- **Production:** set `DATABASE_URL` to a PostgreSQL connection string (Neon, Supabase,
  Render, Railway, ...). The table is created automatically. Use this on any host with an
  ephemeral disk, otherwise a redeploy wipes the SQLite file.

**Reading messages:** open `/admin` on the site (not linked anywhere), and sign in with
`ADMIN_PASSWORD` from `server/.env`. You can search, filter unread, mark read/unread, reply by
email and delete. If `ADMIN_PASSWORD` is empty the dashboard is disabled.

**Optional email notifications** — fill in `server/.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
CONTACT_TO_EMAIL=you@gmail.com
```

Email is best-effort: if it fails, the message is still in the inbox.

## Customizing content

All resume content — name, summary, experience, projects, skills, education,
certifications, languages — lives in one place and mirrors the CV:
[`client/src/data/profile.js`](client/src/data/profile.js). Edit that file to
update the site; no need to touch the components.

The **Projects** section reads the `projects` array in the same file (title, kind, stack,
bullets, link). Add another object to that array to add another project.

## Deploying

- **Frontend**: `cd client && npm run build` produces a static `dist/` folder — deploy to
  Vercel, Netlify, GitHub Pages, etc. Set `VITE_API_URL` at build time to your backend URL
  (e.g. `https://api.example.com`). `/admin` needs the host to fall back to `index.html`;
  `client/public/_redirects` (Netlify) and `client/vercel.json` (Vercel) already do this.
- **Backend**: deploy `server/` to any Node host (Render, Railway, Fly.io, a VPS). Set
  `CLIENT_ORIGIN` to your deployed frontend URL (CORS; comma-separate multiple),
  `DATABASE_URL`, and `ADMIN_PASSWORD`.

## Tech stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, ScrollToPlugin)
- **Backend**: Express, SQLite (dev) / PostgreSQL (prod), Nodemailer, express-rate-limit

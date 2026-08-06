# Mohamad Al-Barghouthi — Portfolio

A full-stack personal portfolio: a React + Tailwind CSS frontend and a Node/Express
backend that handles the contact form.

```
Protofoilo/
├── client/   React 19 + Vite + Tailwind CSS v4 + Framer Motion
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

## Making the contact form send real emails

By default, submissions are validated and appended to `server/data/messages.json`
(gitignored) — nothing is lost even without email configured. To have it also
send you an email, fill in `server/.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
CONTACT_TO_EMAIL=you@gmail.com
```

Any SMTP provider works (Gmail app password, SendGrid, Mailgun, etc.).

## Customizing content

All resume content — name, summary, experience, skills, education,
certifications, languages — lives in one place:
[`client/src/data/profile.js`](client/src/data/profile.js). Edit that file to
update the site; no need to touch the components.

The **Projects** section (`projects` array in the same file) currently ships
with 3 placeholder cards — swap in your real projects (title, description,
tags, link) when you have them.

`profile.socials` (github/linkedin) is empty by default — add your URLs there
if you want those links to appear.

## Deploying

- **Frontend**: `cd client && npm run build` produces a static `dist/` folder —
  deploy to Vercel, Netlify, GitHub Pages, etc.
- **Backend**: deploy `server/` to any Node host (Render, Railway, Fly.io, a VPS).
  Set `CLIENT_ORIGIN` in its environment to your deployed frontend URL (used for
  CORS), and point the frontend's API calls at the deployed backend URL instead
  of the relative `/api/...` path used in dev.

## Tech stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion
- **Backend**: Express, Nodemailer, express-rate-limit

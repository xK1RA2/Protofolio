// Base URL of the backend. Empty in dev (Vite proxies /api to :5000); set VITE_API_URL
// at build time when the API is hosted on a different origin, e.g. https://api.example.com
const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const apiUrl = (path) => `${base}${path}`;

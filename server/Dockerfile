# One image serves both the API and the built website.
# Build context is the repository root (fly.toml lives there), hence the client/ and server/ prefixes.

# --- Stage 1: build the React frontend ---
FROM node:24-slim AS client
WORKDIR /client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
# No VITE_API_URL: the site and API share an origin, so relative /api/... calls work.
RUN npm run build

# --- Stage 2: the API, plus the built site in ./public ---
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY server/ ./
COPY --from=client /client/dist ./public

EXPOSE 8080
CMD ["node", "index.js"]

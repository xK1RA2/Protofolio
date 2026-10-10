# Build context is the repository root (fly.toml lives there), hence the server/ prefixes.
FROM node:24-slim

WORKDIR /app
ENV NODE_ENV=production

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY server/ ./

EXPOSE 8080
CMD ["node", "index.js"]

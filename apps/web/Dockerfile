# ─── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci

# ─── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /build

# Copy deps from deps stage
COPY --from=deps /build/node_modules ./node_modules

# Copy source
COPY package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.js ./
COPY src ./src
COPY public ./public

# next.config.ts uses outputFileTracingRoot pointing two levels up (the monorepo root).
# We only have apps/web in Docker context, so override outputFileTracingRoot.
ENV NEXT_TELEMETRY_DISABLED=1
RUN node -e "
const fs = require('fs');
let cfg = fs.readFileSync('next.config.ts', 'utf8');
// Remove the outputFileTracingRoot line that references ../../ (not available in Docker build context)
cfg = cfg.replace(/outputFileTracingRoot[^,\n]+,?\n/g, '');
cfg = cfg.replace(/import path from 'path';\n/g, '');
fs.writeFileSync('next.config.ts', cfg);
"
RUN npm run build

# ─── Stage 3: Production ───────────────────────────────────────────────────────
FROM node:22-alpine AS production

# Create non-root user
RUN addgroup -S fairhire && adduser -S fairhire -G fairhire

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy standalone output
COPY --from=builder /build/.next/standalone ./
# Copy static assets and public directory into the standalone server's expected location
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./public

RUN chown -R fairhire:fairhire /app

USER fairhire

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=15s \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]


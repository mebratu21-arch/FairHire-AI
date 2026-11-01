# ─── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /build

# Install dependencies (including devDeps for the build step)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# Prune devDependencies so the final layer only has production deps
RUN npm prune --production

# ─── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:22-alpine AS production

# Create non-root user
RUN addgroup -S fairhire && adduser -S fairhire -G fairhire

WORKDIR /app

# Copy compiled output and production node_modules from builder
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules

# Set correct ownership
RUN chown -R fairhire:fairhire /app

USER fairhire

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=15s \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3001/api/health || exit 1

CMD ["node", "dist/main"]


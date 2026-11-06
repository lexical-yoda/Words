# words.l3xj.com: one image holding the public site, the admin and the
# Substack importer. All state lives in /app/data (SQLite file and uploads).

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build never touches a database (every page is rendered per request),
# but Payload's config still wants these values to exist.
RUN PAYLOAD_SECRET=build-only DATABASE_URL=file:/tmp/build.db DISABLE_JOBS=true npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8480 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL=file:/app/data/words.db \
    MEDIA_DIR=/app/data/media

RUN groupadd --system --gid 10001 words && useradd --system --uid 10001 --gid words --no-create-home words

COPY --from=builder --chown=words:words /app/.next/standalone ./
COPY --from=builder --chown=words:words /app/.next/static ./.next/static
COPY --from=builder --chown=words:words /app/public ./public

USER words
EXPOSE 8480
HEALTHCHECK --interval=60s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8480/feed.xml').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]

# syntax=docker/dockerfile:1

# Bun + React (served by Bun)
# Build/run scripts come from package.json: `bun run start`

FROM oven/bun:1.3.8 AS deps
WORKDIR /app

# Only copy what we need to install deps (better layer caching)
COPY package.json bun.lock bunfig.toml tsconfig.json ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:1.3.8 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install deps from the cached deps layer
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]

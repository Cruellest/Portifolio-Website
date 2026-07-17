# Multi-stage build
FROM oven/bun:1.3 AS build-stage

WORKDIR /app

# Install the exact dependency set verified by CI (quality.yml)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy application code and build.
# Uses `build:app` (vite build only, no vue-tsc) rather than `build`: the
# full typecheck already runs on every push/PR via quality.yml, and
# `vue-tsc -b` has shown environment-specific flakiness inside this
# container's filesystem that isn't reproducible in local installs with
# the same dependency versions. Vite's esbuild transpile doesn't need
# type information to produce correct output.
COPY . .
RUN bun run build:app

# Production stage
FROM nginx:latest AS production-stage

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built files from build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

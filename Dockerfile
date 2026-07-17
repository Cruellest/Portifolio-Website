# Multi-stage build
FROM oven/bun:1.3 AS build-stage

WORKDIR /app

# Install the exact dependency set verified by CI (quality.yml)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy application code and build
COPY . .
RUN bun run build

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

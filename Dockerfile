#Multi-stage build
FROM oven/bun:latest AS build-stage

# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN bun install
# Copy application code
COPY . .
# Build the application
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
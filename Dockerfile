# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install dotenv first since it's missing from package.json
COPY package-lock.json package.json ./
RUN npm install dotenv --no-save && \
    npm ci --include=dev

# Copy application code
COPY . .

# Fix the build command - use a custom esbuild command to exclude problematic modules
RUN npx esbuild server/index.ts \
    --bundle \
    --platform=node \
    --format=cjs \
    --target=node22 \
    --outdir=dist \
    --external:dotenv \
    --external:@replit/vite-plugin-* \
    --external:@tailwindcss/* \
    --external:lightningcss \
    --external:@babel/* \
    --external:*.node \
    --log-level=warning

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]

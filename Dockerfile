# Build environment
FROM debian:bookworm-slim AS build

# mise configuration
ENV MISE_VERSION="v2025.1.9"
ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV PATH="/mise/shims:$PATH"

# pnpm configuration
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Setup mise
RUN apt-get update && apt-get -y --no-install-recommends install curl ca-certificates
RUN curl https://mise.run | sh

# Use mise to set up local environment tools
COPY mise.toml .
RUN mise trust && mise install

# Primary application build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Runtime static server
# https://github.com/lipanski/docker-static-website
FROM lipanski/docker-static-website:2.4.0 AS runtime
COPY --from=build /app/dist .
EXPOSE 3000

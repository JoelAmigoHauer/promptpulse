# PromptPulse

PromptPulse is an AI-powered brand monitoring platform that tracks search, social, and conversational surfaces to generate actionable marketing intelligence.

## Production Strategy & Architecture
A comprehensive production-grade technology plan, proposed repository layout, and immediate next steps are documented in [docs/production_strategy.md](docs/production_strategy.md). Companion architecture documentation lives in [docs/architecture/](docs/architecture/README.md), where the initial [system context narrative](docs/architecture/system-context.md) anchors forthcoming diagrams, sequence flows, and runbooks.

## Current Directories
- `packages/backend/` – Production-aligned FastAPI service (new implementation lives here).
- `promptpulse-backend/` – Legacy prototype backend kept for reference.
- `promptpulse-frontend/` – React-based prototype frontend.
- `src/services/` – Early experiments with OpenRouter integrations.
- `start_backend.sh` – Helper script for spinning up the prototype backend.

Refer to the strategy document for the long-term structure, stack decisions, and modernization roadmap.

## Local Development Tooling
- `make dev` spins up the shared infrastructure dependencies (Postgres, Redis) defined in `docker-compose.yml`.
- `make api` launches the FastAPI application via Uvicorn (requires installing `packages/backend` dependencies).
- `make test` runs the backend health check test suite (ensure Postgres from `make dev` is running first).

Ensure Docker is installed locally before running the Make targets. To work on the backend service:

1. Create a virtual environment (e.g., `python -m venv .venv && source .venv/bin/activate`).
2. Install dependencies with `pip install -e packages/backend`.
3. Start infrastructure with `make dev`, then run `make api` to launch the API server on `http://127.0.0.1:8000`.
4. With the infrastructure running, execute `make test` to validate the health endpoint and database connectivity.

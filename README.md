# PromptPulse

PromptPulse is an AI-powered brand monitoring platform that tracks search, social, and conversational surfaces to generate actionable marketing intelligence.

## Production Strategy & Architecture
A comprehensive production-grade technology plan, proposed repository layout, and immediate next steps are documented in [docs/production_strategy.md](docs/production_strategy.md). Companion architecture documentation lives in [docs/architecture/](docs/architecture/README.md), where the initial [system context narrative](docs/architecture/system-context.md) anchors forthcoming diagrams, sequence flows, and runbooks.

## Current Directories
- `packages/backend/` – Production-aligned FastAPI service (new implementation lives here).
- `packages/frontend/` – Minimal Vite landing page that pings the new backend health endpoint.
- `promptpulse-backend/` – Legacy prototype backend kept for reference.
- `promptpulse-frontend/` – React-based prototype frontend.
- `src/services/` – Early experiments with OpenRouter integrations.
- `start_backend.sh` – Helper script for spinning up the prototype backend.

Refer to the strategy document for the long-term structure, stack decisions, and modernization roadmap.

## Local Development Tooling
- `make dev` spins up the shared infrastructure dependencies (Postgres, Redis) defined in `docker-compose.yml`.
- `make api` launches the FastAPI application via Uvicorn (requires installing `packages/backend` dependencies).
- `make test` runs the backend health check test suite (ensure Postgres from `make dev` is running first).
- `make web` installs frontend dependencies and starts the Vite dev server for the new landing page.
- `make web-build` installs dependencies and produces the static frontend build (emulates the Vercel pipeline).
- `make legacy-api` runs the original FastAPI prototype from `promptpulse-backend/`.
- `make legacy-web` serves the React prototype found in `promptpulse-frontend/`.

Ensure Docker is installed locally before running the Make targets. To work on the backend service:

1. Create a virtual environment (e.g., `python -m venv .venv && source .venv/bin/activate`).
2. Install dependencies with `pip install -e packages/backend`.
3. Start infrastructure with `make dev`, then run `make api` to launch the API server on `http://127.0.0.1:8000`.
4. With the infrastructure running, execute `make test` to validate the health endpoint and database connectivity.

To work on the frontend landing page:

1. Run `make api` to ensure the backend health endpoint is reachable (or point `VITE_API_URL` to a deployed API).
2. Launch the dev server with `make web`; the page loads at `http://127.0.0.1:5173` and immediately pings `/health`.
3. For a production-like build, run `make web-build` and serve the generated files in `packages/frontend/dist`.
4. Copy `packages/frontend/.env.example` to `.env` in the same directory when you need to override the default API base URL.

### Legacy Prototype Quickstart

The historical prototypes remain available for reference and comparison while the new monorepo implementation matures:

- `make legacy-api` boots the legacy FastAPI service from `promptpulse-backend/src/main.py` on port 8000. Ensure a Python virtualenv is activated and dependencies from `promptpulse-backend/requirements.txt` are installed.
- `make legacy-web` launches the original React interface under `promptpulse-frontend/` using Vite. The demo still expects the mock API responses bundled with the legacy backend.
- The shell helpers in `promptpulse-backend/` (for example `start_full_app.sh`) continue to work if you prefer the previous scripted workflow.

Keep in mind that these prototypes do not integrate with the new Postgres/Redis stack and still rely on mocked data and in-browser auth flows.

### Vercel Deployment

The repository includes a `vercel.json` that:

- Configures a monorepo-aware static build for `packages/frontend` using the same `vite build` pipeline as `make web-build`.
- Exposes the FastAPI application through `api/backend.py` with the Python 3.11 serverless runtime.
- Assumes the Vercel project provides `DATABASE_URL` (or `POSTGRES_PRISMA_URL` / `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING`), `REDIS_URL`, and `OPENROUTER_API_KEY` via configured environment variables.
  - The backend automatically falls back to the `POSTGRES_*` values when `DATABASE_URL` is absent, so existing managed Postgres credentials continue to work without renaming.

**Deploying**

1. Install the Vercel CLI locally (`npm i -g vercel`) and authenticate with `vercel login`.
2. From the repository root, run `vercel link` to associate the local checkout with the prepared Vercel project.
3. Configure environment variables in the Vercel dashboard or via CLI:
   ```sh
   vercel env add DATABASE_URL  # or run `vercel env pull` to re-map existing POSTGRES_* entries
   vercel env add REDIS_URL
   vercel env add OPENROUTER_API_KEY
   ```
4. Deploy with `vercel --prod` (or `vercel` for a preview deployment). The CLI will execute the install/build commands defined in `vercel.json` and upload the static frontend along with the API function.

**Testing the Deployment**

1. After deployment completes, visit the provided URL and confirm the landing page loads and displays the health status.
2. Verify the API function directly with `curl https://<deployment-url>/api/health`.
3. Optionally, run `vercel dev` locally to emulate the production routing and confirm the `/health` call succeeds before promoting changes.

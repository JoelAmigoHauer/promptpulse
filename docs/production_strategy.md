# PromptPulse Production Tech Stack Strategy

## 1. Product Vision & Operating Principles
- **Customer promise:** Deliver always-on brand intelligence, turning search, social, and conversational signals into prioritized actions for marketing teams.
- **Operating principles:**
  - Ship features behind feature flags and progressive rollout gates.
  - Optimize for observability and resilience over raw prototype velocity.
  - Treat AI providers as replaceable commodities; invest in prompt evaluation pipelines and provider abstraction layers.
  - Default to infrastructure-as-code and immutable deployments.

## 2. Tech Stack Strategy
### 2.1 Frontend
- **Framework:** React 18 with TypeScript, Vite build pipeline, and TanStack Router/Query for data orchestration.
- **Design system:** Tailwind CSS with Radix UI primitives; implement an internal component library (`@promptpulse/ui`) published via npm for reuse across surfaces.
- **State management:**
  - URL state driven by Router loaders/actions.
  - Global auth and feature flags via React Query + Zustand hybrid store, persisting to IndexedDB for offline-ready dashboards.
- **Testing:** Vitest + Testing Library for unit, Playwright for e2e. Storybook for component review with Chromatic.
- **Delivery:** Static assets served from CDN (CloudFront/Fastly) with edge caching and asset versioning. Deploy via CI pipeline to S3 bucket or Vercel with preview builds per PR.

### 2.2 Backend APIs
- **Primary API:** FastAPI (Python 3.11) packaged as ASGI service, orchestrated with Uvicorn/Gunicorn workers. Adopt domain-driven modules: `api`, `domain`, `services`, `infrastructure`.
- **Async IO:** Prefer native async HTTP clients (httpx) and database drivers (asyncpg) to remove threadpool hacks.
- **Authentication & Authorization:**
  - Auth0 or AWS Cognito for OAuth2/OpenID Connect; fallback to Django-allauth style self-managed option.
  - API gateway issues JWT access tokens; FastAPI dependency validates scopes/roles.
- **Data layer:** Postgres 15 with SQLAlchemy 2.0 ORM using async session. Redis 7 for caching, rate limiting, and task deduplication.
- **Background processing:**
  - Celery (Redis broker) or Dramatiq for multi-node task execution.
  - Task types: AI prompt fanout, scraping, scheduled re-analysis.
- **File/object storage:** S3-compatible bucket for report exports and prompt evaluation artifacts.
- **Observability:** OpenTelemetry tracing, Prometheus metrics via Starlette middleware, structured logging with logfmt/JSON.
- **Testing & Quality:** pytest + coverage, factory-based fixtures, contract tests (Schemathesis) against OpenAPI spec. MyPy strict mode.

### 2.3 AI & Data Intelligence Layer
- **Provider abstraction:** Build `ai-providers/` module with pluggable clients (OpenAI, Anthropic, Google, OpenRouter). Use LangChain or custom strategy pattern only where it adds value.
- **Prompt evaluation:** Offline notebook pipeline (Jupyter + papermill) generating evaluation reports stored in warehouse.
- **Rate limiting & cost controls:** Centralized quota manager backed by Redis tokens; integrate with billing dashboards.
- **Data enrichment:** Use worker tier for web scraping (Playwright headless), SERP APIs, and social listening connectors. All connectors emit normalized events into Kafka topic (`brand_signals`).
- **Analytics warehouse:** Snowflake or BigQuery for long-term storage. dbt models transform events to derived metrics for dashboards.

### 2.4 Infrastructure & DevOps
- **Containerization:** Docker images built via multi-stage builds. Base images pinned & scanned with Trivy.
- **Orchestration:** Kubernetes (EKS/GKE) with Helm charts. Staging and production clusters with GitOps (ArgoCD or Flux).
- **CI/CD:** GitHub Actions pipelines performing lint/test/build, security scans, SBOM generation (Syft/Grype), and automated deploys on tagged releases.
- **Secrets & config:** SOPS-managed encrypted configs in repo; runtime injection via AWS Secrets Manager or HashiCorp Vault.
- **Feature environments:** On-demand ephemeral stacks via Terraform + GitHub Actions for PR validation.
- **Compliance:** SOC2-ready logging, RBAC, audit trails; integrate with Drata or Vanta from day one.

## 3. Recommended Repository Structure
```
root/
├── docs/
│   ├── production_strategy.md
│   ├── architecture/
│   │   ├── system-context.md
│   │   └── sequence-diagrams/
│   ├── runbooks/
│   └── api/
├── infra/
│   ├── terraform/
│   └── helm/
├── packages/
│   ├── backend/
│   │   ├── pyproject.toml
│   │   └── src/promptpulse/
│   │       ├── api/
│   │       ├── domain/
│   │       ├── schemas/
│   │       ├── services/
│   │       └── infrastructure/
│   ├── frontend/
│   │   ├── package.json
│   │   └── src/
│   │       ├── app/
│   │       │   ├── routes/
│   │       │   └── loaders/
│   │       ├── features/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── lib/
│   └── shared/
│       ├── ui/
│       └── tsconfig.json
├── tools/
│   ├── scripts/
│   └── github/
├── .github/
│   └── workflows/
├── docker/
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
└── Makefile
```
**Key principles:**
- Enforce `packages/` as monorepo root with shared tooling (ESLint/Prettier configs, Python lint configs) in `tools/`.
- Separate infrastructure (`infra/`) and operational docs (`docs/runbooks`) for clarity.
- Keep CI workflows and reusable Actions in `.github/` and `tools/github/`.

## 4. Long-Term Architecture Considerations
- **Service boundaries:** Plan for eventual microservices by keeping API adapters and domain logic modular. Introduce event-driven messaging via Kafka early to decouple ingestion from analytics.
- **Data governance:** Implement PII classification, retention policies, and consent tracking from the first data ingestion.
- **Scalability:** Design read models (Materialized views, ElasticSearch) for dashboard queries to avoid overloading OLTP database.
- **Resilience:** Chaos engineering drills, load testing (k6) before major releases, and blue/green deployment strategy.

## 5. Recommended Next Steps (Quarter 0)
1. **Foundational Infrastructure**
   - Stand up Terraform-managed AWS account baseline (VPC, EKS, RDS Postgres, ElastiCache, S3, CloudFront).
   - Configure GitHub Actions with CI skeleton (lint/test/build) and Docker publishing.

2. **Codebase Reorganization**
   - Migrate existing backend/frontend into `packages/backend` and `packages/frontend` per structure above.
   - Introduce shared lint/test tooling; enforce type checking and formatting in CI.

3. **Operational Tooling**
   - Add Makefile targets (`make dev`, `make test`, `make migrate`).
   - Create local dev stack via Docker Compose (Postgres, Redis, LocalStack for S3).

4. **Security & Compliance Baseline**
   - Implement OAuth2 login via Auth0 dev tenant.
   - Add logging, metrics, tracing scaffolding; send to centralized observability stack (Datadog or OpenTelemetry collector).

5. **Product & Data Foundations**
   - Define canonical domain models (Brand, Persona, Insight, Campaign) and align API schemas.
   - Set up analytics warehouse proof-of-concept (Snowflake + dbt) to receive ingestion events.

6. **AI Platform Hardening**
   - Wrap AI provider calls behind strategy interface with retry/backoff and cost tracking.
   - Build prompt evaluation harness with synthetic dataset; run nightly scorecards.

7. **Documentation & Onboarding**
   - Expand `docs/` with architecture diagrams, runbooks, and onboarding playbooks (see `docs/architecture/README.md` and the initial `system-context.md` narrative for anchors).
   - Publish contribution guidelines and code review checklist.

Executing this plan establishes a production-ready baseline, enabling the team to scale PromptPulse from MVP to an enterprise-grade intelligence platform with confidence.

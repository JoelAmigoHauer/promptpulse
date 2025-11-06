# System Context

This document captures the high-level system context for PromptPulse as it evolves from the current prototype into the production target architecture defined in the tech stack strategy.

## 1. External Stakeholders & Actors
- **Marketing & Brand Teams:** consume dashboards, receive prioritized actions, and manage campaigns.
- **Customer Support & Success Analysts:** monitor conversational signals and coordinate responses to sentiment swings.
- **AI Providers (OpenAI, Anthropic, Google, etc.):** supply LLM capabilities through the provider abstraction layer.
- **Social & Search Data Sources:** include traditional platforms (Meta, X, Reddit, news feeds) and AI search interfaces (ChatGPT, Perplexity, Copilot).
- **Identity Provider (Auth0/Cognito):** issues JWTs and enforces tenant segregation.
- **Third-Party Integrations:** CRM/marketing automation connectors that receive action recommendations.

## 2. Core Systems & Responsibilities
- **PromptPulse Frontend (Web):** React application delivering onboarding, action hub, analytics, and admin surfaces. Communicates with backend APIs via HTTPS, subscribes to push updates through WebSockets/Server-Sent Events.
- **PromptPulse API (FastAPI):** orchestrates onboarding workflows, brand intelligence queries, user management, and serves the Action Hub/Analytics data contract. Exposes REST/GraphQL endpoints and real-time channels.
- **Background Worker Tier:** asynchronous jobs for AI prompt fan-out, connector ingestion, scheduled re-analysis, and warehouse materializations. Pulls tasks from Redis/Celery broker and emits domain events.
- **Event Streaming Layer:** Kafka (or managed equivalent) normalizing incoming signals—social, conversational, AI search—into canonical events for downstream analytics.
- **Data Warehouse & Lake:** Snowflake/BigQuery (warehouse) and S3 object storage (raw lake) persisting normalized events, evaluation artifacts, and historical reports.
- **Observability Stack:** OpenTelemetry collectors, Prometheus/Grafana, and centralized log aggregation delivering system health insights.
- **CI/CD Pipeline:** GitHub Actions + ArgoCD/GitOps pipeline building, testing, scanning, and deploying services.

## 3. Context Diagram (Narrative)
1. Users authenticate via the identity provider; the frontend receives tokens to include with API calls.
2. The frontend interacts with the PromptPulse API for CRUD, analytics queries, and trigger operations that enqueue background jobs.
3. The API delegates long-running brand intelligence requests to the worker tier, which invokes AI providers and external data connectors.
4. External data sources deliver results back through webhooks, polling endpoints, or scraping connectors; workers normalize the payload and publish events into Kafka.
5. Stream processors persist curated facts into Postgres for transactional needs and into the warehouse for analytical workloads.
6. Observability agents collect metrics/traces/logs from API, workers, and connectors, exposing dashboards and alerts for the operations team.
7. Action recommendations and insights propagate back to the frontend through API responses and push channels, optionally syncing to third-party CRM/marketing tools.

## 4. Open Questions & Assumptions
- Tenancy model: single-tenant per account (schema or row level) still under evaluation.
- Warehouse selection (Snowflake vs BigQuery) depends on customer hosting preferences and existing partnerships.
- Real-time push channel choice (SSE vs WebSockets vs MQTT) to be validated during MVP hardening.
- Extent of first-party connectors vs reliance on partner APIs for social listening remains a product prioritization discussion.

## 5. Next Steps
1. Produce a visual C4 Level-1 diagram reflecting the narrative above and store it under `docs/architecture/diagrams/`.
2. Define interface contracts between the API and worker tier, including event schemas for Kafka topics.
3. Document multi-tenant considerations (auth scopes, data isolation) once the tenancy decision is finalized.

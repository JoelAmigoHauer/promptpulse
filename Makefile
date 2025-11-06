.PHONY: dev test api

dev:
	docker compose up -d

api:
	uvicorn promptpulse.main:app --app-dir packages/backend/src --reload

test:
	PYTHONPATH=packages/backend/src python -m unittest discover packages/backend/tests

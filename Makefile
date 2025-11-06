.PHONY: dev test api web web-build

dev:
	docker compose up -d

api:
	uvicorn promptpulse.main:app --app-dir packages/backend/src --reload

test:
	PYTHONPATH=packages/backend/src python -m unittest discover packages/backend/tests

web:
	npm install --prefix packages/frontend
	npm run dev --prefix packages/frontend

web-build:
	npm install --prefix packages/frontend
	npm run build --prefix packages/frontend

"""Integration tests for the backend health endpoint."""
from __future__ import annotations

import asyncio
import os
import unittest

from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError


class HealthEndpointTests(unittest.TestCase):
    """Validate the health route and database connectivity."""

    @staticmethod
    def _client(test_case: unittest.TestCase) -> TestClient:
        os.environ.setdefault(
            "PROMPTPULSE_DATABASE_URL",
            "postgresql+asyncpg://promptpulse:promptpulse123@localhost:5432/promptpulse",
        )

        try:
            import asyncpg  # type: ignore # noqa: F401
        except ModuleNotFoundError as exc:  # pragma: no cover - environment lacks dependency.
            test_case.skipTest(f"asyncpg driver missing: {exc}")

        from promptpulse.infrastructure.database import check_database_connection

        try:
            asyncio.run(check_database_connection())
        except OperationalError as exc:  # pragma: no cover - skip when dependency is offline.
            test_case.skipTest(f"Database connection failed: {exc}")

        from promptpulse.main import create_app  # Import after verifying connectivity.

        return TestClient(create_app())

    def test_health_endpoint_returns_ok_status(self) -> None:
        """Health endpoint should return 200 OK with the expected payload."""

        with self._client(self) as client:
            response = client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})


if __name__ == "__main__":  # pragma: no cover - allow running module directly.
    unittest.main()

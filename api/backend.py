from pathlib import Path
import sys

BACKEND_SRC = Path(__file__).resolve().parents[1] / "packages" / "backend" / "src"
if str(BACKEND_SRC) not in sys.path:
    sys.path.insert(0, str(BACKEND_SRC))

from promptpulse.main import app  # noqa: E402

__all__ = ["app"]

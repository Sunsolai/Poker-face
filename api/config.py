"""Vercel function for GET /api/config."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from pokerface import PokerFaceHandler  # noqa: E402


class handler(PokerFaceHandler):  # noqa: N801
    def do_GET(self) -> None:
        self.handle_config()

    def do_POST(self) -> None:
        self.send_error(405)

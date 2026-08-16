"""Vercel serverless entry point.

Serves API routes for the Poker Face app. Static assets are served from
``public/`` by Vercel; this handler covers ``/api/*`` and any non-static paths.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from pokerface import PokerFaceHandler  # noqa: E402


class handler(PokerFaceHandler):  # noqa: N801
    pass

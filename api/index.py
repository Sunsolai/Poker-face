"""Vercel serverless entry point.

Vercel's Python runtime looks for a ``handler`` class that subclasses
``BaseHTTPRequestHandler``. We reuse the existing PokerFaceHandler from
app.py verbatim — it already serves static files and the /api routes — so
there is no logic duplication.
"""
from __future__ import annotations

import sys
from pathlib import Path

# app.py lives at the project root, one level above this api/ directory.
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app import PokerFaceHandler  # noqa: E402


# Vercel's Python runtime detects the entry point via AST analysis and only
# recognizes a top-level `handler` defined here (an aliased import is not
# detected). Subclass PokerFaceHandler so the name is a real class definition.
class handler(PokerFaceHandler):  # noqa: N801
    pass

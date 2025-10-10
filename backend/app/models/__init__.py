"""
Database models for Seer application.
Import all models here for Alembic to detect them.
"""

from app.models.signal import RawSignal
from app.models.trend import Trend, TrendEvidence
from app.models.user import User, Watchlist, CalendarEvent
from app.models.detected_trend import DetectedTrend, SignalTrendAssociation

__all__ = [
    "RawSignal",
    "Trend",
    "TrendEvidence",
    "User",
    "Watchlist",
    "CalendarEvent",
    "DetectedTrend",
    "SignalTrendAssociation",
]
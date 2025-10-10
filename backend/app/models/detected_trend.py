"""
SQLAlchemy models for micro-trend detection.
File: app/models/detected_trend.py
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class DetectedTrend(Base):
    """
    Intermediate table for tracking micro-trends detected in signals.
    These become full Trends once validated and scored.
    
    Example: "Glass Skin Routine" detected from multiple Beauty signals
    """
    __tablename__ = "detected_trends"
    
    id = Column(Integer, primary_key=True, index=True)
    
    trend_phrase = Column(
        String(200), 
        nullable=False, 
        comment="The detected trend phrase (e.g., 'Glass Skin Routine')"
    )
    
    normalized_phrase = Column(
        String(200), 
        nullable=False, 
        index=True,
        comment="Normalized version for deduplication (lowercase, no punctuation)"
    )
    
    category = Column(
        String(100), 
        nullable=False, 
        index=True,
        comment="Parent category (Beauty, Fashion, etc.)"
    )
    
    keywords = Column(
        JSON, 
        comment="List of associated keywords extracted from signals"
    )
    
    hashtags = Column(
        JSON, 
        comment="List of associated hashtags (e.g., ['glasskin', 'skincare'])"
    )
    
    signal_count = Column(
        Integer, 
        default=0, 
        index=True, 
        comment="Number of signals containing this trend"
    )
    
    first_seen = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        nullable=False,
        comment="When this trend was first detected"
    )
    
    last_seen = Column(
        DateTime(timezone=True),
        comment="Most recent signal mentioning this trend"
    )
    
    is_validated = Column(
        Boolean, 
        default=False, 
        index=True,
        comment="Whether this has been promoted to full trend"
    )
    
    promoted_trend_id = Column(
        Integer, 
        ForeignKey('trends.id'), 
        nullable=True,
        comment="ID of trend this was promoted to (if validated)"
    )
    
    trend_metadata = Column(
    "metadata",  # database column name
    JSON, 
    comment="Additional NLP metadata (extraction confidence, sources, etc)"
    )
    
    # Relationships
    signals = relationship(
        "SignalTrendAssociation", 
        back_populates="detected_trend",
        cascade="all, delete-orphan"
    )
    
    promoted_trend = relationship(
        "Trend", 
        foreign_keys=[promoted_trend_id]
    )
    
    # Composite indexes for common queries
    __table_args__ = (
        Index('idx_category_signal_count', 'category', 'signal_count'),
    )
    
    def __repr__(self):
        return f"<DetectedTrend(id={self.id}, phrase='{self.trend_phrase}', category='{self.category}', signals={self.signal_count})>"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'trend_phrase': self.trend_phrase,
            'normalized_phrase': self.normalized_phrase,
            'category': self.category,
            'keywords': self.keywords or [],
            'hashtags': self.hashtags or [],
            'signal_count': self.signal_count,
            'first_seen': self.first_seen.isoformat() if self.first_seen else None,
            'last_seen': self.last_seen.isoformat() if self.last_seen else None,
            'is_validated': self.is_validated,
            'promoted_trend_id': self.promoted_trend_id
        }


class SignalTrendAssociation(Base):
    """
    Junction table linking raw_signals to detected_trends (many-to-many).
    Allows one signal to contribute to multiple trends.
    
    Example: A post titled "My Glass Skin Routine with Dopamine Makeup" 
    would link to both "Glass Skin Routine" and "Dopamine Makeup" trends.
    """
    __tablename__ = "signal_trend_associations"
    
    id = Column(Integer, primary_key=True, index=True)
    
    signal_id = Column(
        Integer, 
        ForeignKey('raw_signals.id'), 
        nullable=False, 
        index=True,
        comment="Reference to the raw signal"
    )
    
    detected_trend_id = Column(
        Integer, 
        ForeignKey('detected_trends.id'), 
        nullable=False, 
        index=True,
        comment="Reference to the detected trend"
    )
    
    relevance_score = Column(
        Float, 
        default=0.0,
        comment="How relevant is this signal to this trend (0-1)"
    )
    
    extraction_method = Column(
        String(50), 
        comment="How was this association detected (tfidf, hashtag, noun_phrase, capitalized)"
    )
    
    created_at = Column(
        DateTime(timezone=True), 
        server_default=func.now(),
        comment="When this association was created"
    )
    
    # Relationships
    signal = relationship(
        "RawSignal", 
        back_populates="trend_associations"
    )
    
    detected_trend = relationship(
        "DetectedTrend", 
        back_populates="signals"
    )
    
    # Ensure uniqueness and optimize queries
    __table_args__ = (
        Index('idx_signal_trend_unique', 'signal_id', 'detected_trend_id', unique=True),
        Index('idx_trend_relevance', 'detected_trend_id', 'relevance_score'),
    )
    
    def __repr__(self):
        return f"<SignalTrendAssoc(signal_id={self.signal_id}, trend_id={self.detected_trend_id}, relevance={self.relevance_score:.2f})>"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'signal_id': self.signal_id,
            'detected_trend_id': self.detected_trend_id,
            'relevance_score': self.relevance_score,
            'extraction_method': self.extraction_method,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Index, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Trend(Base):
    """
    Processed trends identified from aggregated signals.
    Represents a topic/concept that's gaining momentum across platforms.
    """
    __tablename__ = "trends"

    id = Column(Integer, primary_key=True, index=True)
    
    # Identification
    name = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    
    # Scoring metrics (0-100 scale)
    velocity_score = Column(Float, default=0.0)  # Rate of growth
    saturation_level = Column(String(20))  # low, medium, high
    saturation_score = Column(Float, default=0.0)  # Numeric representation
    novelty_score = Column(Float, default=0.0)  # How new/unique is it
    seer_score = Column(Float, default=0.0, index=True)  # Overall composite score
    
    # Prediction data
    predicted_peak_date = Column(DateTime(timezone=True))
    lead_time_days = Column(Integer)  # Days until predicted peak
    confidence_score = Column(Float)  # Confidence in prediction (0-1)
    
    # Status tracking
    status = Column(String(20), index=True)  # emerging, rising, peaking, declining
    first_detected = Column(DateTime(timezone=True), server_default=func.now())
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Evidence metadata
    evidence_count = Column(Integer, default=0)
    source_platforms = Column(JSON)  # List of platforms where detected
    
    # Chart data for visualization
    chart_data = Column(JSON)  # Time-series data: [{date, value, predicted}]
    
    # Keywords and hashtags
    keywords = Column(JSON)  # List of associated keywords
    hashtags = Column(JSON)  # List of trending hashtags
    
    # Relationships
    evidence = relationship("TrendEvidence", back_populates="trend", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_category_seer_score', 'category', 'seer_score'),
        Index('idx_status_updated', 'status', 'last_updated'),
    )

    def __repr__(self):
        return f"<Trend(name={self.name}, category={self.category}, score={self.seer_score})>"


class TrendEvidence(Base):
    """
    Links trends to supporting raw signals with metadata.
    Provides transparency and traceability for predictions.
    """
    __tablename__ = "trend_evidence"

    id = Column(Integer, primary_key=True, index=True)
    
    # Relationships
    trend_id = Column(Integer, ForeignKey('trends.id'), nullable=False, index=True)
    signal_id = Column(Integer, ForeignKey('raw_signals.id'), index=True)
    
    # Evidence details
    source_url = Column(String(1000))
    title = Column(String(500))
    platform = Column(String(50))
    engagement_score = Column(Float)  # Combined metric of upvotes/likes/views
    
    # Relevance
    relevance_score = Column(Float)  # How relevant is this signal to the trend (0-1)
    excerpt = Column(Text)  # Short excerpt/preview
    
    # Timestamps
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    trend = relationship("Trend", back_populates="evidence")
    
    __table_args__ = (
        Index('idx_trend_relevance', 'trend_id', 'relevance_score'),
    )

    def __repr__(self):
        return f"<TrendEvidence(trend_id={self.trend_id}, platform={self.platform})>"
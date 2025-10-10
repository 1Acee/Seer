"""
Raw signal model with trend association support
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class RawSignal(Base):
    """
    Raw data points collected from various platforms (Reddit, YouTube, TikTok, etc.)
    Each signal represents a single data point before aggregation into trends.
    """
    __tablename__ = "raw_signals"

    id = Column(Integer, primary_key=True, index=True)
    
    # Source identification
    platform = Column(String(50), nullable=False, index=True)  # reddit, youtube, tiktok, instagram
    signal_type = Column(String(50), nullable=False)  # post, video, hashtag, search_volume
    identifier = Column(String(500), nullable=False)  # URL, post ID, video ID, etc.
    
    # Content information
    title = Column(String(500))
    content_preview = Column(String(1000))  # First 1000 chars of content
    category = Column(String(100), index=True)  # Beauty, Fashion, Tech, etc.
    
    # Metrics
    metric_name = Column(String(100))  # upvotes, views, likes, comments, shares
    metric_value = Column(Float)
    
    # Metadata (flexible JSON for platform-specific data)
    signal_metadata = Column(JSON)  # author, subreddit, hashtags, detected_trends, keywords
    
    # Timestamps
    collected_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    content_created_at = Column(DateTime(timezone=True), index=True)
    
    # Relationships - NEW: Link to detected trends
    trend_associations = relationship(
        "SignalTrendAssociation", 
        back_populates="signal",
        cascade="all, delete-orphan"
    )
    
    # Composite indexes for common queries
    __table_args__ = (
        Index('idx_platform_category_created', 'platform', 'category', 'content_created_at'),
        Index('idx_category_collected', 'category', 'collected_at'),
    )

    def __repr__(self):
        return f"<RawSignal(platform={self.platform}, type={self.signal_type}, category={self.category})>"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'platform': self.platform,
            'signal_type': self.signal_type,
            'identifier': self.identifier,
            'title': self.title,
            'category': self.category,
            'metric_name': self.metric_name,
            'metric_value': self.metric_value,
            'signal_metadata': self.signal_metadata,
            'collected_at': self.collected_at.isoformat() if self.collected_at else None,
            'content_created_at': self.content_created_at.isoformat() if self.content_created_at else None
        }
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Index, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    """
    User accounts with preferences and subscription details.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    # Authentication
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile
    name = Column(String(255))
    business_name = Column(String(255))
    account_type = Column(String(20))  # personal, business
    
    # Onboarding data
    persona = Column(String(100))  # Content Creator, Marketing Agency, etc.
    selected_categories = Column(JSON)  # Array of 3-5 categories
    platform_preferences = Column(JSON)  # Array of preferred platforms
    goal_emphasis = Column(JSON)  # User goals
    
    # Subscription
    plan_tier = Column(String(20), default='basic')  # basic, pro, elite
    plan_start_date = Column(DateTime(timezone=True))
    plan_renewal_date = Column(DateTime(timezone=True))
    
    # Usage tracking
    weekly_uploads_used = Column(Integer, default=0)
    weekly_uploads_reset_date = Column(DateTime(timezone=True))
    
    # Settings
    theme_accent = Column(String(50), default='coral')
    theme_background = Column(String(50), default='beige')
    dark_mode = Column(Boolean, default=False)
    
    # Notifications
    email_notifications = Column(Boolean, default=True)
    trending_alerts = Column(Boolean, default=True)
    watchlist_updates = Column(Boolean, default=True)
    weekly_digest = Column(Boolean, default=True)
    
    # Privacy
    analytics_sharing = Column(Boolean, default=True)
    public_profile = Column(Boolean, default=False)
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    watchlist_items = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    calendar_events = relationship("CalendarEvent", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(email={self.email}, plan={self.plan_tier})>"


class Watchlist(Base):
    """
    User's saved/followed trends with custom notes and priority.
    """
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    
    # Relationships
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    trend_id = Column(Integer, ForeignKey('trends.id'), nullable=False, index=True)
    
    # Customization
    notes = Column(Text)
    priority = Column(String(20), default='medium')  # low, medium, high
    custom_tags = Column(JSON)  # User-defined tags
    
    # Alert settings
    alert_on_heating = Column(Boolean, default=True)
    alert_on_cooling = Column(Boolean, default=False)
    alert_threshold = Column(Float)  # Trigger alert when score changes by X
    
    # Tracking
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    last_checked = Column(DateTime(timezone=True))
    
    # Status snapshot (for quick filtering)
    status_snapshot = Column(String(20))  # heating, stable, cooling
    
    # Relationships
    user = relationship("User", back_populates="watchlist_items")
    
    __table_args__ = (
        Index('idx_user_trend', 'user_id', 'trend_id', unique=True),
        Index('idx_user_priority', 'user_id', 'priority'),
    )

    def __repr__(self):
        return f"<Watchlist(user_id={self.user_id}, trend_id={self.trend_id})>"


class CalendarEvent(Base):
    """
    User's scheduled events related to trends and content creation.
    """
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    
    # Relationships
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    trend_id = Column(Integer, ForeignKey('trends.id'), index=True)  # Optional link to trend
    
    # Event details
    title = Column(String(255), nullable=False)
    description = Column(Text)
    event_type = Column(String(50))  # trend, upload, meeting, reminder
    
    # Timing
    event_date = Column(DateTime(timezone=True), nullable=False, index=True)
    event_time = Column(String(10))  # HH:MM format
    reminder_minutes = Column(Integer)  # Minutes before event to remind
    
    # Status
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="calendar_events")
    
    __table_args__ = (
        Index('idx_user_date', 'user_id', 'event_date'),
    )

    def __repr__(self):
        return f"<CalendarEvent(title={self.title}, date={self.event_date})>"
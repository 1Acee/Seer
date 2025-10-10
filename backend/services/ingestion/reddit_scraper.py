"""
Reddit scraper with integrated trend extraction.
Uses PRAW to monitor subreddits and extracts micro-trends from post titles.
"""

import praw
from datetime import datetime, timezone
from typing import List, Dict
import logging
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.signal import RawSignal
from app.models.detected_trend import DetectedTrend, SignalTrendAssociation
from app.config import settings
from services.ingestion.trend_extractor import TrendExtractor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Category to subreddit mapping
SUBREDDIT_MAP = {
    "Beauty": ["SkincareAddiction", "MakeupAddiction", "beauty", "HairCare"],
    "Fashion": ["femalefashionadvice", "malefashionadvice", "streetwear", "fashion"],
    "Food": ["food", "FoodPorn", "recipes", "Cooking", "EatCheapAndHealthy"],
    "Fitness": ["Fitness", "bodyweightfitness", "xxfitness", "GYM"],
    "Tech": ["technology", "gadgets", "android", "apple", "pcmasterrace"],
    "Finance": ["personalfinance", "investing", "stocks", "CryptoCurrency"],
    "Lifestyle": ["minimalism", "productivity", "GetMotivated"],
    "Gaming": ["gaming", "pcgaming", "Games", "NintendoSwitch"],
    "Music": ["Music", "hiphopheads", "popheads", "EDM"],
    "Home": ["HomeImprovement", "InteriorDesign", "DIY", "organization"],
    "Photography": ["photography", "itookapicture", "photocritique"],
    "Automotive": ["cars", "Autos", "electricvehicles"],
    "Travel": ["travel", "solotravel", "backpacking"],
    "Education": ["education", "learnprogramming", "LanguageLearning"],
}


class RedditScraper:
    """Scrapes Reddit for emerging trend signals with NLP extraction."""
    
    def __init__(self):
        """Initialize Reddit API client and trend extractor."""
        self.reddit = praw.Reddit(
            client_id=settings.REDDIT_CLIENT_ID,
            client_secret=settings.REDDIT_CLIENT_SECRET,
            user_agent=settings.REDDIT_USER_AGENT,
        )
        self.trend_extractor = TrendExtractor()
        logger.info("Reddit scraper initialized with trend extraction")
    
    def scrape_subreddit(
        self, 
        subreddit_name: str, 
        category: str, 
        limit: int = 100,
        time_filter: str = "day"
    ) -> List[Dict]:
        """
        Scrape posts from a single subreddit with trend extraction.
        
        Args:
            subreddit_name: Name of the subreddit
            category: Category this subreddit belongs to
            limit: Number of posts to fetch
            time_filter: Time period (hour, day, week, month, year, all)
        
        Returns:
            List of signal dictionaries with extracted trends
        """
        signals = []
        
        try:
            subreddit = self.reddit.subreddit(subreddit_name)
            
            # Get top posts from the time period
            for post in subreddit.top(time_filter=time_filter, limit=limit):
                # Skip stickied posts and announcements
                if post.stickied:
                    continue
                
                # Extract trends from title using NLP
                trend_data = self.trend_extractor.extract_from_title(post.title)
                
                signal_data = {
                    "platform": "reddit",
                    "signal_type": "post",
                    "identifier": f"https://reddit.com{post.permalink}",
                    "title": post.title[:500],
                    "content_preview": post.selftext[:1000] if post.selftext else None,
                    "category": category,
                    "metric_name": "engagement_score",
                    "metric_value": self._calculate_engagement(post),
                    "signal_metadata": {
                        "subreddit": subreddit_name,
                        "author": str(post.author),
                        "upvotes": post.score,
                        "upvote_ratio": post.upvote_ratio,
                        "num_comments": post.num_comments,
                        "awards": post.total_awards_received,
                        "is_original_content": post.is_original_content,
                        "link_flair_text": post.link_flair_text,
                        # NEW: Store extracted trend data
                        "detected_trends": trend_data['trend_phrases'],
                        "keywords": trend_data['keywords'],
                        "hashtags": trend_data['hashtags']
                    },
                    "content_created_at": datetime.fromtimestamp(
                        post.created_utc, 
                        tz=timezone.utc
                    ),
                }
                
                signals.append(signal_data)
            
            logger.info(f"Scraped {len(signals)} posts from r/{subreddit_name}")
            
        except Exception as e:
            logger.error(f"Error scraping r/{subreddit_name}: {str(e)}")
        
        return signals
    
    def scrape_category(
        self, 
        category: str, 
        posts_per_subreddit: int = 50
    ) -> List[Dict]:
        """
        Scrape all subreddits for a category.
        
        Args:
            category: Category name (e.g., "Beauty", "Tech")
            posts_per_subreddit: Number of posts to fetch per subreddit
        
        Returns:
            List of all signals from the category
        """
        if category not in SUBREDDIT_MAP:
            logger.warning(f"Unknown category: {category}")
            return []
        
        all_signals = []
        subreddits = SUBREDDIT_MAP[category]
        
        logger.info(f"Scraping category: {category} ({len(subreddits)} subreddits)")
        
        for subreddit_name in subreddits:
            signals = self.scrape_subreddit(
                subreddit_name, 
                category, 
                limit=posts_per_subreddit
            )
            all_signals.extend(signals)
        
        return all_signals
    
    def scrape_all_categories(
        self, 
        posts_per_subreddit: int = 25
    ) -> Dict[str, int]:
        """
        Scrape all categories and save to database with trend associations.
        
        Args:
            posts_per_subreddit: Number of posts per subreddit
        
        Returns:
            Dictionary with category names and signal counts
        """
        db = next(get_db())
        stats = {}
        
        try:
            for category in SUBREDDIT_MAP.keys():
                signals = self.scrape_category(category, posts_per_subreddit)
                
                # Save signals to database with trend extraction
                saved_count = self._save_signals_with_trends(db, signals)
                stats[category] = saved_count
                
                logger.info(f"Category {category}: {saved_count} signals saved")
        finally:
            db.close()
        
        return stats
    
    def _calculate_engagement(self, post) -> float:
        """
        Calculate engagement score combining multiple metrics.
        
        Args:
            post: Reddit post object
        
        Returns:
            Engagement score (weighted combination)
        """
        # Weighted formula: upvotes * ratio + comments * 2 + awards * 5
        score = (
            post.score * post.upvote_ratio +
            post.num_comments * 2 +
            post.total_awards_received * 5
        )
        return round(score, 2)
    
    def _save_signals_with_trends(self, db: Session, signals: List[Dict]) -> int:
        """
        Save signals to database and create detected_trends + associations.
        
        Args:
            db: Database session
            signals: List of signal dictionaries
        
        Returns:
            Number of signals saved
        """
        saved_count = 0
        
        for signal_data in signals:
            try:
                # Check if signal already exists
                existing = db.query(RawSignal).filter(
                    RawSignal.identifier == signal_data["identifier"]
                ).first()
                
                if existing:
                    # Update metrics if changed
                    existing.metric_value = signal_data["metric_value"]
                    existing.signal_metadata = signal_data["signal_metadata"]
                    db.flush()
                    signal = existing
                else:
                    # Create new signal
                    signal = RawSignal(**signal_data)
                    db.add(signal)
                    db.flush()  # Get signal.id
                
                # Extract detected trends from metadata
                metadata = signal_data.get('signal_metadata', {})
                detected_trends = metadata.get('detected_trends', [])
                
                # Process each detected trend
                for trend_info in detected_trends:
                    normalized = trend_info['normalized']
                    category = signal_data['category']
                    
                    # Find or create detected_trend
                    detected_trend = db.query(DetectedTrend).filter(
                        DetectedTrend.normalized_phrase == normalized,
                        DetectedTrend.category == category
                    ).first()
                    
                    if not detected_trend:
                        # Create new detected trend
                        detected_trend = DetectedTrend(
                            trend_phrase=trend_info['phrase'],
                            normalized_phrase=normalized,
                            category=category,
                            keywords=metadata.get('keywords', []),
                            hashtags=metadata.get('hashtags', []),
                            signal_count=1,
                            first_seen=signal.content_created_at or datetime.now(timezone.utc),
                            last_seen=signal.content_created_at or datetime.now(timezone.utc),
                            metadata={
                                'extraction_confidence': trend_info['score'],
                                'extraction_method': trend_info['method']
                            }
                        )
                        db.add(detected_trend)
                        db.flush()
                    else:
                        # Update existing trend
                        detected_trend.signal_count += 1
                        detected_trend.last_seen = signal.content_created_at or datetime.now(timezone.utc)
                        
                        # Merge keywords and hashtags
                        if detected_trend.keywords:
                            all_keywords = set(detected_trend.keywords + metadata.get('keywords', []))
                            detected_trend.keywords = list(all_keywords)[:20]  # Keep top 20
                        
                        if detected_trend.hashtags:
                            all_hashtags = set(detected_trend.hashtags + metadata.get('hashtags', []))
                            detected_trend.hashtags = list(all_hashtags)[:10]  # Keep top 10
                    
                    # Check if association already exists
                    existing_assoc = db.query(SignalTrendAssociation).filter(
                        SignalTrendAssociation.signal_id == signal.id,
                        SignalTrendAssociation.detected_trend_id == detected_trend.id
                    ).first()
                    
                    if not existing_assoc:
                        # Create association
                        assoc = SignalTrendAssociation(
                            signal_id=signal.id,
                            detected_trend_id=detected_trend.id,
                            relevance_score=trend_info['score'],
                            extraction_method=trend_info['method']
                        )
                        db.add(assoc)
                
                saved_count += 1
                
            except Exception as e:
                logger.error(f"Error saving signal: {str(e)}")
                continue
        
        try:
            db.commit()
            logger.info(f"Committed {saved_count} signals with trend associations")
        except Exception as e:
            logger.error(f"Error committing signals: {str(e)}")
            db.rollback()
            return 0
        
        return saved_count


def main():
    """Main function to run the scraper."""
    scraper = RedditScraper()
    
    # Scrape all categories
    logger.info("Starting Reddit scraper with trend extraction...")
    stats = scraper.scrape_all_categories(posts_per_subreddit=25)
    
    # Print summary
    total = sum(stats.values())
    logger.info(f"\nScraping complete! Total signals: {total}")
    for category, count in stats.items():
        logger.info(f"  {category}: {count} signals")
    
    # Show detected trends summary
    db = next(get_db())
    try:
        from sqlalchemy import func
        
        trend_counts = db.query(
            DetectedTrend.category,
            func.count(DetectedTrend.id).label('trend_count')
        ).group_by(DetectedTrend.category).all()
        
        logger.info(f"\nDetected Trends Summary:")
        for category, count in trend_counts:
            logger.info(f"  {category}: {count} unique trends")
        
        # Show top trends
        top_trends = db.query(DetectedTrend).order_by(
            DetectedTrend.signal_count.desc()
        ).limit(10).all()
        
        logger.info(f"\nTop 10 Trends by Signal Count:")
        for trend in top_trends:
            logger.info(f"  '{trend.trend_phrase}' ({trend.category}): {trend.signal_count} signals")
    finally:
        db.close()


if __name__ == "__main__":
    main()
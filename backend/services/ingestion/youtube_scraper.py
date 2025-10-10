"""
YouTube Shorts scraper for Seer trend detection
Collects trending Shorts data across all 14 categories
"""

import os
import sys
from datetime import datetime
import logging
from typing import List, Dict
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.signal import RawSignal
from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Category mapping to YouTube search terms
CATEGORY_KEYWORDS = {
    "Beauty": ["makeup tutorial", "skincare routine", "beauty tips"],
    "Fashion": ["fashion haul", "outfit ideas", "style tips"],
    "Food": ["recipe", "cooking", "food review"],
    "Fitness": ["workout", "fitness", "exercise routine"],
    "Tech": ["tech review", "gadgets", "technology"],
    "Finance": ["investing", "finance tips", "money"],
    "Lifestyle": ["lifestyle vlog", "daily routine", "life hacks"],
    "Gaming": ["gaming", "gameplay", "game review"],
    "Music": ["music", "new song", "music video"],
    "Home": ["home decor", "interior design", "DIY home"],
    "Photography": ["photography tips", "camera", "photo editing"],
    "Automotive": ["car review", "automotive", "cars"],
    "Travel": ["travel vlog", "destination", "travel tips"],
    "Education": ["tutorial", "learn", "education"],
}


class YouTubeScraper:
    def __init__(self, api_key: str):
        """Initialize YouTube API client"""
        self.youtube = build('youtube', 'v3', developerKey=api_key)
        self.max_results_per_search = 10  # Conservative to stay within quota
        
    def calculate_engagement_score(self, video: Dict) -> float:
        """
        Calculate engagement score from video statistics
        Formula: (views * 0.4) + (likes * 0.4) + (comments * 0.2)
        """
        stats = video.get('statistics', {})
        
        views = int(stats.get('viewCount', 0))
        likes = int(stats.get('likeCount', 0))
        comments = int(stats.get('commentCount', 0))
        
        # Normalize by dividing large numbers
        normalized_views = views / 1000
        normalized_likes = likes / 10
        normalized_comments = comments / 2
        
        score = (normalized_views * 0.4) + (normalized_likes * 0.4) + (normalized_comments * 0.2)
        return round(score, 2)
    
    def search_shorts(self, keyword: str, max_results: int = 10) -> List[Dict]:
        """
        Search for YouTube Shorts by keyword
        Returns list of video IDs
        """
        try:
            # Search for videos
            search_response = self.youtube.search().list(
                q=keyword,
                part='id,snippet',
                maxResults=max_results,
                type='video',
                videoDuration='short',  # Shorts are typically under 60 seconds
                order='viewCount',  # Get trending videos
                publishedAfter='2025-10-01T00:00:00Z'  # Recent videos only
            ).execute()
            
            video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]
            
            if not video_ids:
                return []
            
            # Get detailed statistics for these videos
            videos_response = self.youtube.videos().list(
                part='snippet,statistics,contentDetails',
                id=','.join(video_ids)
            ).execute()
            
            return videos_response.get('items', [])
            
        except HttpError as e:
            logger.error(f"YouTube API error for keyword '{keyword}': {e}")
            return []
    
    def scrape_category(self, category: str, db: Session) -> int:
        """
        Scrape YouTube Shorts for a specific category
        Returns number of signals saved
        """
        keywords = CATEGORY_KEYWORDS.get(category, [category.lower()])
        signals_saved = 0
        
        logger.info(f"Scraping {category} with keywords: {keywords}")
        
        for keyword in keywords:
            videos = self.search_shorts(keyword, max_results=self.max_results_per_search)
            
            for video in videos:
                try:
                    video_id = video['id']
                    snippet = video['snippet']
                    stats = video['statistics']
                    
                    # Create video URL
                    video_url = f"https://youtube.com/shorts/{video_id}"
                    
                    # Check if already exists
                    existing = db.query(RawSignal).filter(
                        RawSignal.identifier == video_url
                    ).first()
                    
                    if existing:
                        continue
                    
                    # Calculate engagement score
                    engagement = self.calculate_engagement_score(video)
                    
                    # Extract metadata
                    metadata = {
                        "channel_title": snippet.get('channelTitle'),
                        "channel_id": snippet.get('channelId'),
                        "published_at": snippet.get('publishedAt'),
                        "views": int(stats.get('viewCount', 0)),
                        "likes": int(stats.get('likeCount', 0)),
                        "comments": int(stats.get('commentCount', 0)),
                        "tags": snippet.get('tags', []),
                        "category_id": snippet.get('categoryId'),
                        "search_keyword": keyword
                    }
                    
                    # Create signal
                    signal = RawSignal(
                        platform="youtube",
                        signal_type="short",
                        identifier=video_url,
                        title=snippet.get('title', '')[:500],
                        content_preview=snippet.get('description', '')[:1000],
                        category=category,
                        metric_name="engagement_score",
                        metric_value=engagement,
                        signal_metadata=metadata,
                        content_created_at=datetime.fromisoformat(
                            snippet['publishedAt'].replace('Z', '+00:00')
                        )
                    )
                    
                    db.add(signal)
                    signals_saved += 1
                    
                except Exception as e:
                    logger.error(f"Error processing video {video.get('id')}: {e}")
                    continue
            
            # Commit after each keyword to avoid losing progress
            try:
                db.commit()
                logger.info(f"  Keyword '{keyword}': {signals_saved} signals saved so far")
            except Exception as e:
                logger.error(f"Database commit error: {e}")
                db.rollback()
        
        return signals_saved


def main():
    """Main scraper function"""
    # Get API key from environment
    api_key = os.getenv('YOUTUBE_API_KEY')
    
    if not api_key:
        logger.error("YOUTUBE_API_KEY not found in environment variables!")
        logger.info("Please add it to your .env file:")
        logger.info("YOUTUBE_API_KEY=your_api_key_here")
        logger.info("\nGet your API key at: https://console.cloud.google.com")
        return
    
    logger.info("Starting YouTube Shorts scraper...")
    logger.info(f"Targeting {len(CATEGORY_KEYWORDS)} categories")
    
    # Initialize scraper
    scraper = YouTubeScraper(api_key)
    
    # Get database session
    db = next(get_db())
    
    total_signals = 0
    category_counts = {}
    
    try:
        # Scrape each category
        for category in CATEGORY_KEYWORDS.keys():
            try:
                count = scraper.scrape_category(category, db)
                category_counts[category] = count
                total_signals += count
                logger.info(f"Category {category}: {count} signals saved")
                
            except Exception as e:
                logger.error(f"Error scraping {category}: {e}")
                continue
        
        logger.info(f"\nScraping complete! Total signals: {total_signals}")
        for category, count in category_counts.items():
            logger.info(f"  {category}: {count} signals")
            
    finally:
        db.close()


if __name__ == "__main__":
    main()
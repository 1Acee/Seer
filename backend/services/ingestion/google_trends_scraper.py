"""
Google Trends scraper for Seer trend detection
Tracks search volume changes across all 14 categories
No API key required!
"""

import os
import sys
from datetime import datetime, timedelta
import logging
from typing import List, Dict
import json
import time

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from pytrends.request import TrendReq
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.signal import RawSignal
from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Category keywords to track
CATEGORY_KEYWORDS = {
    "Beauty": [
        "skincare routine", "makeup tutorial", "beauty products", 
        "clean beauty", "korean skincare"
    ],
    "Fashion": [
        "fashion trends", "outfit ideas", "sustainable fashion",
        "street style", "fashion week"
    ],
    "Food": [
        "viral recipe", "food trend", "cooking tips",
        "meal prep", "food hack"
    ],
    "Fitness": [
        "workout routine", "fitness challenge", "gym tips",
        "home workout", "fitness motivation"
    ],
    "Tech": [
        "new gadget", "tech review", "ai tools",
        "smartphone", "tech news"
    ],
    "Finance": [
        "investing tips", "passive income", "personal finance",
        "crypto", "stock market"
    ],
    "Lifestyle": [
        "life hacks", "productivity tips", "morning routine",
        "self improvement", "minimalism"
    ],
    "Gaming": [
        "new game", "gaming setup", "game review",
        "esports", "gaming tips"
    ],
    "Music": [
        "new music", "trending song", "music festival",
        "concert", "album release"
    ],
    "Home": [
        "home decor", "interior design", "home organization",
        "diy home", "smart home"
    ],
    "Photography": [
        "photography tips", "camera review", "photo editing",
        "photography gear", "photography tutorial"
    ],
    "Automotive": [
        "car review", "electric vehicle", "car maintenance",
        "auto news", "car tech"
    ],
    "Travel": [
        "travel destination", "travel tips", "bucket list",
        "travel vlog", "travel guide"
    ],
    "Education": [
        "online learning", "study tips", "educational content",
        "learning platform", "skill development"
    ],
}


class GoogleTrendsScraper:
    def __init__(self):
        """Initialize Google Trends client"""
        self.pytrends = TrendReq(hl='en-US', tz=0)
        self.timeframe = 'now 7-d'  # Last 7 days
        
    def calculate_velocity(self, trend_data: List[int]) -> float:
        """
        Calculate velocity (rate of change) from trend data
        Returns percentage change from start to end of period
        """
        if not trend_data or len(trend_data) < 2:
            return 0.0
        
        # Remove zeros and get valid data points
        valid_data = [x for x in trend_data if x > 0]
        
        if len(valid_data) < 2:
            return 0.0
        
        start_value = valid_data[0]
        end_value = valid_data[-1]
        
        # Calculate percentage change
        if start_value == 0:
            return 0.0
        
        velocity = ((end_value - start_value) / start_value) * 100
        return round(velocity, 2)
    
    def calculate_engagement_score(self, keyword_data: Dict) -> float:
        """
        Calculate engagement score from Google Trends data
        Based on: average interest (40%) + peak interest (30%) + velocity (30%)
        """
        values = keyword_data['values']
        
        if not values:
            return 0.0
        
        avg_interest = sum(values) / len(values)
        peak_interest = max(values)
        velocity = abs(self.calculate_velocity(values))
        
        score = (avg_interest * 0.4) + (peak_interest * 0.3) + (velocity * 0.3)
        return round(score, 2)
    
    def get_interest_over_time(self, keywords: List[str]) -> Dict:
        """
        Get interest over time for keywords
        Returns data for each keyword
        """
        try:
            # Google Trends allows max 5 keywords at once
            self.pytrends.build_payload(
                keywords, 
                cat=0, 
                timeframe=self.timeframe,
                geo='',
                gprop=''
            )
            
            # Get interest over time
            interest_df = self.pytrends.interest_over_time()
            
            if interest_df.empty:
                return {}
            
            # Convert to dictionary format
            result = {}
            for keyword in keywords:
                if keyword in interest_df.columns:
                    result[keyword] = {
                        'values': interest_df[keyword].tolist(),
                        'dates': interest_df.index.tolist()
                    }
            
            return result
            
        except Exception as e:
            logger.error(f"Error fetching trends for {keywords}: {e}")
            return {}
    
    def scrape_category(self, category: str, db: Session) -> int:
        """
        Scrape Google Trends for a specific category
        Returns number of signals saved
        """
        keywords = CATEGORY_KEYWORDS.get(category, [])
        signals_saved = 0
        
        logger.info(f"Scraping {category} with {len(keywords)} keywords")
        
        # Process keywords in batches of 5 (Google Trends limit)
        for i in range(0, len(keywords), 5):
            batch = keywords[i:i+5]
            
            try:
                # Get trend data
                trends_data = self.get_interest_over_time(batch)
                
                if not trends_data:
                    continue
                
                # Process each keyword
                for keyword, data in trends_data.items():
                    try:
                        # Create unique identifier
                        identifier = f"google_trends_{category.lower()}_{keyword.replace(' ', '_')}"
                        
                        # Check if already exists
                        existing = db.query(RawSignal).filter(
                            RawSignal.identifier == identifier
                        ).first()
                        
                        if existing:
                            # Update existing signal with new data
                            existing.metric_value = self.calculate_engagement_score(data)
                            existing.signal_metadata = {
                                "keyword": keyword,
                                "interest_values": data['values'],
                                "velocity": self.calculate_velocity(data['values']),
                                "avg_interest": round(sum(data['values']) / len(data['values']), 2),
                                "peak_interest": max(data['values']),
                                "timeframe": self.timeframe,
                                "last_updated": datetime.utcnow().isoformat()
                            }
                            existing.collected_at = datetime.utcnow()
                            continue
                        
                        # Calculate metrics
                        engagement = self.calculate_engagement_score(data)
                        velocity = self.calculate_velocity(data['values'])
                        
                        # Create metadata
                        metadata = {
                            "keyword": keyword,
                            "interest_values": data['values'],
                            "velocity": velocity,
                            "avg_interest": round(sum(data['values']) / len(data['values']), 2),
                            "peak_interest": max(data['values']),
                            "timeframe": self.timeframe
                        }
                        
                        # Create signal
                        signal = RawSignal(
                            platform="google_trends",
                            signal_type="search_volume",
                            identifier=identifier,
                            title=f"Search interest: {keyword}",
                            content_preview=f"Google Trends data for '{keyword}' in {category} category",
                            category=category,
                            metric_name="interest_score",
                            metric_value=engagement,
                            signal_metadata=metadata,
                            content_created_at=datetime.utcnow() - timedelta(days=7)  # Start of tracking period
                        )
                        
                        db.add(signal)
                        signals_saved += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing keyword '{keyword}': {e}")
                        continue
                
                # Commit after each batch
                try:
                    db.commit()
                    logger.info(f"  Batch complete: {signals_saved} signals saved so far")
                except Exception as e:
                    logger.error(f"Database commit error: {e}")
                    db.rollback()
                
                # Rate limiting - be nice to Google
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"Error processing batch {batch}: {e}")
                time.sleep(5)  # Longer wait on error
                continue
        
        return signals_saved


def main():
    """Main scraper function"""
    logger.info("Starting Google Trends scraper...")
    logger.info(f"Targeting {len(CATEGORY_KEYWORDS)} categories")
    logger.info("No API key required! 🎉\n")
    
    # Initialize scraper
    scraper = GoogleTrendsScraper()
    
    # Get database session
    db = next(get_db())
    
    total_signals = 0
    category_counts = {}
    
    try:
        # Scrape each category
        for category in CATEGORY_KEYWORDS.keys():
            try:
                logger.info(f"\n{'='*50}")
                logger.info(f"Processing: {category}")
                logger.info(f"{'='*50}")
                
                count = scraper.scrape_category(category, db)
                category_counts[category] = count
                total_signals += count
                
                logger.info(f"✓ {category}: {count} signals saved")
                
                # Small delay between categories
                time.sleep(3)
                
            except Exception as e:
                logger.error(f"Error scraping {category}: {e}")
                continue
        
        logger.info(f"\n{'='*50}")
        logger.info(f"Scraping complete! Total signals: {total_signals}")
        logger.info(f"{'='*50}")
        for category, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
            logger.info(f"  {category}: {count} signals")
            
    finally:
        db.close()


if __name__ == "__main__":
    main()
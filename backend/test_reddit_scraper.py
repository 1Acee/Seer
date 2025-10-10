#!/usr/bin/env python3
"""Test Reddit scraper with limited data."""

import sys
from services.ingestion.reddit_scraper import RedditScraper
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_scraper():
    """Test the Reddit scraper with limited data."""
    print("=" * 60)
    print("TESTING REDDIT SCRAPER")
    print("=" * 60)

    try:
        # Initialize scraper
        scraper = RedditScraper()
        print("SUCCESS: Reddit scraper initialized")

        # Test with a small category (just 2 posts per subreddit)
        print("\nTesting Beauty category with 2 posts per subreddit...")
        signals = scraper.scrape_category("Beauty", posts_per_subreddit=2)

        print(f"\nCollected {len(signals)} signals")

        # Show sample data
        if signals:
            print("\nSample signal data:")
            sample = signals[0]
            print(f"  Platform: {sample['platform']}")
            print(f"  Category: {sample['category']}")
            print(f"  Title: {sample['title'][:50]}...")
            print(f"  Engagement Score: {sample['metric_value']}")
            print(f"  Subreddit: {sample['signal_metadata']['subreddit']}")

        # Save to database
        from app.database import SessionLocal
        db = SessionLocal()
        saved = scraper._save_signals(db, signals)
        db.close()

        print(f"\nSaved {saved} signals to database")

        # Verify in database
        db = SessionLocal()
        from app.models.signal import RawSignal
        count = db.query(RawSignal).filter(RawSignal.platform == "reddit").count()
        print(f"Total Reddit signals in database: {count}")
        db.close()

        print("\n" + "=" * 60)
        print("REDDIT SCRAPER TEST COMPLETE!")
        print("=" * 60)
        return True

    except Exception as e:
        print(f"FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_scraper()
    sys.exit(0 if success else 1)
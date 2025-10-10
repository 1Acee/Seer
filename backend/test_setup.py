#!/usr/bin/env python3
"""Test the entire backend setup is working correctly."""

import sys
from datetime import datetime, timezone
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models.signal import RawSignal
from app.models.trend import Trend, TrendEvidence
from app.models.user import User, Watchlist
from app.database import engine, SessionLocal

def test_database_connection():
    """Test database connectivity."""
    print("Testing database connection...")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()
            print(f"SUCCESS: Connected to PostgreSQL")
            print(f"Version: {version[0][:50]}...")
            return True
    except Exception as e:
        print(f"FAILED: {e}")
        return False

def test_table_creation():
    """Verify all tables exist."""
    print("\nVerifying table creation...")
    tables_to_check = [
        'raw_signals',
        'trends',
        'trend_evidence',
        'users',
        'watchlist',
        'calendar_events'
    ]

    try:
        with engine.connect() as conn:
            for table in tables_to_check:
                result = conn.execute(text(f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables
                        WHERE table_name = '{table}'
                    )
                """))
                exists = result.scalar()
                status = "SUCCESS" if exists else "FAILED"
                print(f"  {status}: Table '{table}' {'exists' if exists else 'does not exist'}")
                if not exists:
                    return False
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        return False

def test_insert_sample_data():
    """Test inserting sample data."""
    print("\nTesting data insertion...")

    db = SessionLocal()
    try:
        # Create a sample signal
        sample_signal = RawSignal(
            platform="reddit",
            signal_type="post",
            identifier="test_post_123",
            title="Test Signal for Beauty Trend",
            content_preview="This is a test signal content",
            category="Beauty",
            metric_name="upvotes",
            metric_value=100.0,
            signal_metadata={"subreddit": "test", "author": "test_user"},
            content_created_at=datetime.now(timezone.utc)
        )

        db.add(sample_signal)
        db.commit()

        # Verify it was inserted
        count = db.query(RawSignal).count()
        print(f"SUCCESS: Inserted sample signal. Total signals: {count}")

        # Create a sample trend
        sample_trend = Trend(
            name="Test Beauty Trend",
            slug="test-beauty-trend",
            category="Beauty",
            velocity_score=75.0,
            saturation_level="low",
            saturation_score=25.0,
            novelty_score=85.0,
            seer_score=70.0,
            status="emerging",
            confidence_score=0.8,
            evidence_count=1,
            source_platforms=["reddit"],
            keywords=["beauty", "test"],
            hashtags=["#beautytest"]
        )

        db.add(sample_trend)
        db.commit()

        # Verify it was inserted
        count = db.query(Trend).count()
        print(f"SUCCESS: Inserted sample trend. Total trends: {count}")

        return True
    except Exception as e:
        print(f"FAILED: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def test_query_data():
    """Test querying data."""
    print("\nTesting data queries...")

    db = SessionLocal()
    try:
        # Query signals
        signals = db.query(RawSignal).all()
        print(f"SUCCESS: Found {len(signals)} signals")

        # Query trends
        trends = db.query(Trend).all()
        print(f"SUCCESS: Found {len(trends)} trends")

        # Test filtering
        beauty_signals = db.query(RawSignal).filter(
            RawSignal.category == "Beauty"
        ).all()
        print(f"SUCCESS: Found {len(beauty_signals)} Beauty category signals")

        return True
    except Exception as e:
        print(f"FAILED: {e}")
        return False
    finally:
        db.close()

def main():
    print("=" * 60)
    print("SEER BACKEND SETUP VERIFICATION")
    print("=" * 60)

    tests = [
        ("Database Connection", test_database_connection),
        ("Table Creation", test_table_creation),
        ("Data Insertion", test_insert_sample_data),
        ("Data Queries", test_query_data)
    ]

    results = {}
    for test_name, test_func in tests:
        results[test_name] = test_func()

    print("\n" + "=" * 60)
    print("TEST RESULTS SUMMARY")
    print("=" * 60)

    for test_name, passed in results.items():
        status = "PASSED" if passed else "FAILED"
        print(f"{test_name}: {status}")

    all_passed = all(results.values())

    print("\n" + "=" * 60)
    if all_passed:
        print("ALL TESTS PASSED! Backend is ready.")
        print("\nNext steps:")
        print("1. Run the Reddit scraper: python services/ingestion/reddit_scraper.py")
        print("2. Start the API server: uvicorn app.main:app --reload")
        print("3. Access API docs at: http://localhost:8000/docs")
    else:
        print("SOME TESTS FAILED! Please fix the issues above.")
    print("=" * 60)

    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
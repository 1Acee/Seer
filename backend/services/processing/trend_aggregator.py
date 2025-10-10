"""
Advanced Trend Aggregator for Seer
Combines signals into cohesive trends using NLP, clustering, and time-series analysis
"""

import os
import sys
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional, Set
import logging
import numpy as np
from collections import defaultdict, Counter
import re
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.database import get_db
from app.models.signal import RawSignal
from app.models.trend import Trend, TrendEvidence
from services.processing.velocity_calculator import VelocityCalculator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TrendAggregator:
    """
    Advanced trend aggregation using:
    1. Keyword extraction and clustering
    2. Semantic similarity detection
    3. Temporal pattern analysis
    4. Cross-platform signal fusion
    5. Novelty detection
    6. Saturation measurement
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.velocity_calculator = VelocityCalculator(db)
        
        # Minimum thresholds for trend creation
        self.min_signals = 3          # At least 3 signals to form a trend
        self.min_velocity = 5.0       # Minimum velocity score
        self.similarity_threshold = 0.3  # Keyword overlap threshold
        
    def extract_keywords(self, text: str, max_keywords: int = 5) -> List[str]:
        """
        Extract significant keywords from text
        Uses frequency and length filtering
        """
        # Clean and tokenize
        text = text.lower()
        text = re.sub(r'[^\w\s]', ' ', text)
        words = text.split()
        
        # Stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now'}
        
        # Filter keywords
        keywords = [w for w in words if w not in stop_words and len(w) > 3]
        
        # Count frequency
        keyword_freq = Counter(keywords)
        
        # Return top keywords
        return [k for k, _ in keyword_freq.most_common(max_keywords)]
    
    def calculate_keyword_similarity(self, keywords1: List[str], keywords2: List[str]) -> float:
        """
        Calculate Jaccard similarity between two keyword sets
        """
        if not keywords1 or not keywords2:
            return 0.0
        
        set1 = set(keywords1)
        set2 = set(keywords2)
        
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        
        if union == 0:
            return 0.0
        
        return intersection / union
    
    def cluster_signals_by_similarity(self, signals: List[RawSignal]) -> List[List[RawSignal]]:
        """
        Cluster signals that are discussing similar topics
        Uses keyword-based clustering
        """
        if len(signals) < 2:
            return [[s] for s in signals]
        
        # Extract keywords for each signal
        signal_keywords = {}
        for signal in signals:
            keywords = self.extract_keywords(signal.title + " " + (signal.content_preview or ""))
            signal_keywords[signal.id] = keywords
        
        # Create clusters using greedy approach
        clusters = []
        assigned = set()
        
        for i, signal in enumerate(signals):
            if signal.id in assigned:
                continue
            
            # Start new cluster
            cluster = [signal]
            assigned.add(signal.id)
            
            # Find similar signals
            for j, other_signal in enumerate(signals):
                if i != j and other_signal.id not in assigned:
                    similarity = self.calculate_keyword_similarity(
                        signal_keywords[signal.id],
                        signal_keywords[other_signal.id]
                    )
                    
                    if similarity >= self.similarity_threshold:
                        cluster.append(other_signal)
                        assigned.add(other_signal.id)
            
            if len(cluster) >= self.min_signals:
                clusters.append(cluster)
        
        return clusters
    
    def generate_trend_name(self, signals: List[RawSignal]) -> str:
        """
        Generate a descriptive name for the trend
        Based on most common keywords across signals
        """
        all_keywords = []
        for signal in signals:
            keywords = self.extract_keywords(signal.title, max_keywords=3)
            all_keywords.extend(keywords)
        
        # Get most common keywords
        keyword_freq = Counter(all_keywords)
        top_keywords = [k for k, _ in keyword_freq.most_common(3)]
        
        # Create trend name
        if len(top_keywords) >= 2:
            return " ".join(top_keywords[:2]).title()
        elif len(top_keywords) == 1:
            return top_keywords[0].title()
        else:
            return "Emerging Topic"
    
    def calculate_saturation_level(self, signal_count: int, category_total: int) -> str:
        """
        Calculate how saturated/crowded a trend is
        Based on percentage of category activity
        """
        if category_total == 0:
            return "unknown"
        
        saturation_pct = (signal_count / category_total) * 100
        
        if saturation_pct < 5:
            return "low"
        elif saturation_pct < 15:
            return "medium"
        else:
            return "high"
    
    def calculate_novelty_score(self, keywords: List[str], category: str) -> float:
        """
        Calculate how novel/new this trend is
        Checks if keywords appeared in historical data
        """
        # Look back 30 days for historical comparison
        lookback_date = datetime.utcnow() - timedelta(days=30)
        
        # Count historical mentions of these keywords
        historical_count = 0
        for keyword in keywords:
            count = self.db.query(func.count(RawSignal.id)).filter(
                RawSignal.category == category,
                RawSignal.collected_at < lookback_date,
                RawSignal.title.ilike(f'%{keyword}%')
            ).scalar()
            historical_count += count
        
        # Novelty decreases with historical mentions
        if historical_count == 0:
            return 100.0  # Completely new
        elif historical_count < 5:
            return 80.0   # Very novel
        elif historical_count < 15:
            return 50.0   # Moderately novel
        elif historical_count < 30:
            return 30.0   # Somewhat familiar
        else:
            return 10.0   # Well-established
    
    def predict_peak_date(self, velocity_data: Dict, current_engagement: float) -> Tuple[datetime, int]:
        """
        Predict when trend will peak
        Uses velocity and acceleration to estimate
        """
        velocity_score = velocity_data['velocity_score']
        acceleration = velocity_data['methods']['acceleration']
        pattern = velocity_data['methods']['pattern']['pattern']
        
        # Base prediction on pattern type
        if pattern == 'explosive':
            # Fast peak (3-5 days)
            days_to_peak = int(3 + (5 - velocity_score / 20))
        elif pattern == 'strong_uptrend':
            # Moderate peak (5-10 days)
            days_to_peak = int(5 + (10 - velocity_score / 10))
        elif velocity_score > 50:
            # High velocity (7-14 days)
            days_to_peak = int(7 + (14 - velocity_score / 7))
        else:
            # Low velocity (14-21 days)
            days_to_peak = int(14 + (21 - velocity_score / 5))
        
        # Adjust based on acceleration
        if acceleration > 0.5:
            days_to_peak = max(2, days_to_peak - 2)  # Accelerating - peak sooner
        elif acceleration < -0.5:
            days_to_peak = min(30, days_to_peak + 3)  # Decelerating - peak later
        
        # Cap between 2-30 days
        days_to_peak = max(2, min(30, days_to_peak))
        
        predicted_date = datetime.utcnow() + timedelta(days=days_to_peak)
        
        return predicted_date, days_to_peak
    
    def calculate_seer_score(self, velocity_score: float, novelty_score: float, 
                            saturation_level: str, signal_count: int) -> float:
        """
        Calculate overall Seer Score (0-100)
        Composite of velocity, novelty, saturation, and signal strength
        """
        # Saturation penalty
        saturation_multiplier = {
            'low': 1.2,      # Boost for low saturation
            'medium': 1.0,   # Neutral
            'high': 0.7,     # Penalty for high saturation
            'unknown': 1.0
        }
        
        # Signal strength (more signals = more confidence)
        signal_strength = min(signal_count / 10, 1.0) * 20  # Max 20 points
        
        # Composite score
        score = (
            velocity_score * 0.4 +           # 40% velocity
            novelty_score * 0.3 +            # 30% novelty
            signal_strength * 0.3            # 30% signal strength
        ) * saturation_multiplier[saturation_level]
        
        return round(min(score, 100.0), 2)
    
    def determine_trend_status(self, velocity_score: float, days_to_peak: int) -> str:
        """
        Determine current trend status
        """
        if days_to_peak <= 3:
            return "peaking"
        elif days_to_peak <= 7 and velocity_score > 50:
            return "rising"
        elif velocity_score > 30:
            return "emerging"
        else:
            return "declining"
    
    def aggregate_category_trends(self, category: str, lookback_days: int = 7) -> List[Dict]:
        """
        Aggregate all signals in a category into trends
        Returns list of detected trends with full analysis
        """
        logger.info(f"Aggregating trends for {category}...")
        
        # Get signals from timeframe
        cutoff_time = datetime.utcnow() - timedelta(days=lookback_days)
        signals = self.db.query(RawSignal).filter(
            RawSignal.category == category,
            RawSignal.collected_at >= cutoff_time
        ).all()
        
        if len(signals) < self.min_signals:
            logger.info(f"  Insufficient signals ({len(signals)}) for trend detection")
            return []
        
        # Get category total for saturation calculation
        category_total = len(signals)
        
        # Cluster signals by similarity
        clusters = self.cluster_signals_by_similarity(signals)
        logger.info(f"  Found {len(clusters)} potential trends")
        
        trends = []
        
        for cluster in clusters:
            if len(cluster) < self.min_signals:
                continue
            
            # Generate trend name
            trend_name = self.generate_trend_name(cluster)
            keywords = self.extract_keywords(" ".join([s.title for s in cluster]))
            
            # Calculate velocity for this trend
            # Get velocity for signals matching these keywords
            keyword_query = " ".join(keywords[:2])
            velocity_data = self.velocity_calculator.calculate_comprehensive_velocity(
                category, topic=keyword_query, lookback_days=lookback_days
            )
            
            if velocity_data['velocity_score'] < self.min_velocity:
                logger.info(f"  Skipping '{trend_name}' - velocity too low ({velocity_data['velocity_score']})")
                continue
            
            # Calculate metrics
            saturation = self.calculate_saturation_level(len(cluster), category_total)
            novelty = self.calculate_novelty_score(keywords, category)
            
            # Calculate average engagement
            avg_engagement = sum(s.metric_value for s in cluster) / len(cluster)
            
            # Predict peak
            predicted_peak_date, days_to_peak = self.predict_peak_date(velocity_data, avg_engagement)
            
            # Calculate Seer Score
            seer_score = self.calculate_seer_score(
                velocity_data['velocity_score'],
                novelty,
                saturation,
                len(cluster)
            )
            
            # Determine status
            status = self.determine_trend_status(velocity_data['velocity_score'], days_to_peak)
            
            # Detect cross-platform presence
            platforms = set(s.platform for s in cluster)
            is_cross_platform = len(platforms) > 1
            
            # Create trend object
            trend = {
                'name': trend_name,
                'category': category,
                'keywords': keywords[:5],
                'velocity_score': velocity_data['velocity_score'],
                'saturation_level': saturation,
                'novelty_score': novelty,
                'seer_score': seer_score,
                'predicted_peak_date': predicted_peak_date,
                'lead_time_days': days_to_peak,
                'status': status,
                'evidence_count': len(cluster),
                'source_platforms': list(platforms),
                'is_cross_platform': is_cross_platform,
                'avg_engagement': round(avg_engagement, 2),
                'velocity_confidence': velocity_data['confidence'],
                'pattern': velocity_data['methods']['pattern']['pattern'],
                'signals': cluster
            }
            
            trends.append(trend)
            logger.info(f"  ✓ Detected: '{trend_name}' (Score: {seer_score}, Lead: {days_to_peak}d)")
        
        # Sort by Seer Score
        trends.sort(key=lambda x: x['seer_score'], reverse=True)
        
        return trends
    
    def save_trends_to_database(self, trends: List[Dict]) -> int:
        """
        Save detected trends to the database
        Returns number of trends saved
        """
        saved_count = 0
        
        for trend_data in trends:
            try:
                # Create slug
                slug = trend_data['name'].lower().replace(' ', '-')
                slug = re.sub(r'[^a-z0-9-]', '', slug)
                
                # Check if trend already exists (by slug and category)
                existing = self.db.query(Trend).filter(
                    Trend.slug == slug,
                    Trend.category == trend_data['category']
                ).first()
                
                if existing:
                    # Update existing trend
                    existing.velocity_score = trend_data['velocity_score']
                    existing.saturation_level = trend_data['saturation_level']
                    existing.novelty_score = trend_data['novelty_score']
                    existing.seer_score = trend_data['seer_score']
                    existing.predicted_peak_date = trend_data['predicted_peak_date']
                    existing.lead_time_days = trend_data['lead_time_days']
                    existing.status = trend_data['status']
                    existing.evidence_count = trend_data['evidence_count']
                    existing.source_platforms = trend_data['source_platforms']
                    logger.info(f"  Updated existing trend: {trend_data['name']}")
                else:
                    # Create new trend
                    trend = Trend(
                        name=trend_data['name'],
                        slug=slug,
                        category=trend_data['category'],
                        velocity_score=trend_data['velocity_score'],
                        saturation_level=trend_data['saturation_level'],
                        novelty_score=trend_data['novelty_score'],
                        seer_score=trend_data['seer_score'],
                        predicted_peak_date=trend_data['predicted_peak_date'],
                        lead_time_days=trend_data['lead_time_days'],
                        status=trend_data['status'],
                        evidence_count=trend_data['evidence_count'],
                        source_platforms=trend_data['source_platforms']
                    )
                    self.db.add(trend)
                    self.db.flush()  # Get the ID
                    
                    # Add evidence links
                    for signal in trend_data['signals'][:10]:  # Limit to top 10 signals
                        evidence = TrendEvidence(
                            trend_id=trend.id,
                            signal_id=signal.id,
                            source_url=signal.identifier,
                            title=signal.title,
                            engagement_score=signal.metric_value
                        )
                        self.db.add(evidence)
                    
                    logger.info(f"  Created new trend: {trend_data['name']}")
                
                saved_count += 1
                
            except Exception as e:
                logger.error(f"Error saving trend '{trend_data['name']}': {e}")
                continue
        
        self.db.commit()
        return saved_count
    
    def process_all_categories(self, lookback_days: int = 7) -> Dict:
        """
        Process all categories and save trends
        Returns summary statistics
        """
        categories = [
            "Beauty", "Fashion", "Food", "Fitness", "Tech", "Finance",
            "Lifestyle", "Gaming", "Music", "Home", "Photography",
            "Automotive", "Travel", "Education"
        ]
        
        summary = {
            'total_trends': 0,
            'by_category': {},
            'top_trends': []
        }
        
        all_trends = []
        
        for category in categories:
            trends = self.aggregate_category_trends(category, lookback_days)
            
            if trends:
                saved = self.save_trends_to_database(trends)
                summary['by_category'][category] = saved
                summary['total_trends'] += saved
                all_trends.extend(trends)
        
        # Get top 10 trends overall
        all_trends.sort(key=lambda x: x['seer_score'], reverse=True)
        summary['top_trends'] = [
            {
                'name': t['name'],
                'category': t['category'],
                'seer_score': t['seer_score'],
                'lead_time_days': t['lead_time_days']
            }
            for t in all_trends[:10]
        ]
        
        return summary


def main():
    """Run trend aggregation"""
    logger.info("="*60)
    logger.info("SEER TREND AGGREGATION ENGINE")
    logger.info("="*60)
    
    db = next(get_db())
    aggregator = TrendAggregator(db)
    
    try:
        summary = aggregator.process_all_categories(lookback_days=7)
        
        logger.info("\n" + "="*60)
        logger.info("AGGREGATION COMPLETE")
        logger.info("="*60)
        logger.info(f"Total Trends Detected: {summary['total_trends']}")
        logger.info("\nTrends by Category:")
        for category, count in sorted(summary['by_category'].items(), key=lambda x: x[1], reverse=True):
            logger.info(f"  {category}: {count} trends")
        
        logger.info("\n" + "="*60)
        logger.info("TOP 10 EMERGING TRENDS")
        logger.info("="*60)
        for i, trend in enumerate(summary['top_trends'], 1):
            logger.info(f"{i}. {trend['name']} ({trend['category']})")
            logger.info(f"   Seer Score: {trend['seer_score']}/100")
            logger.info(f"   Lead Time: {trend['lead_time_days']} days to peak\n")
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
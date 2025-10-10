"""
Hybrid Velocity Calculator for Detected Trends
NOW CALCULATES VELOCITY PER MICRO-TREND instead of per category
"""

import os
import sys
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import logging
import numpy as np
from scipy import stats
from sklearn.linear_model import LinearRegression

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.signal import RawSignal
from app.models.detected_trend import DetectedTrend, SignalTrendAssociation

# Configure logging - reduce SQL noise
logging.basicConfig(level=logging.WARNING)
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class HybridVelocityCalculator:
    """
    Intelligent velocity calculator for detected micro-trends.
    Calculates velocity per trend (e.g., "Glass Skin Routine") not per category.
    """
    
    def __init__(self, db: Session):
        self.db = db
        
    def assess_data_quality(self, timestamps: List[datetime], values: List[float]) -> Dict:
        """Assess the quality and characteristics of available data"""
        if not timestamps or not values:
            return {
                'time_span_hours': 0,
                'data_points': 0,
                'temporal_coverage': 0.0,
                'quality_score': 0.0
            }
        
        # Calculate time span
        time_span = (max(timestamps) - min(timestamps)).total_seconds() / 3600
        
        # Calculate temporal coverage
        if len(timestamps) > 1:
            intervals = sorted([(timestamps[i+1] - timestamps[i]).total_seconds() for i in range(len(timestamps)-1)])
            median_interval = intervals[len(intervals)//2] if intervals else 0
            expected_intervals = time_span * 3600 / len(timestamps)
            coverage = 1.0 - min(abs(median_interval - expected_intervals) / max(expected_intervals, 1), 1.0)
        else:
            coverage = 0.0
        
        # Quality score (0-100)
        points_score = min(len(timestamps) / 50, 1.0) * 40
        span_score = min(time_span / 168, 1.0) * 30
        coverage_score = coverage * 30
        
        quality_score = points_score + span_score + coverage_score
        
        return {
            'time_span_hours': round(time_span, 2),
            'data_points': len(timestamps),
            'temporal_coverage': round(coverage, 2),
            'quality_score': round(quality_score, 2)
        }
    
    def calculate_short_term_velocity(self, timestamps: List[datetime], 
                                     values: List[float]) -> Dict:
        """Calculate velocity for short time windows (<=48 hours)"""
        if len(timestamps) < 5:
            return {
                'velocity_score': 0.0,
                'confidence': 0.0,
                'pattern': 'insufficient_data',
                'direction': 'neutral',
                'method': 'short_term'
            }
        
        # Sort by timestamp
        sorted_data = sorted(zip(timestamps, values), key=lambda x: x[0])
        timestamps, values = zip(*sorted_data)
        
        time_span_hours = (timestamps[-1] - timestamps[0]).total_seconds() / 3600
        
        # Split into time buckets
        num_buckets = min(6, max(3, int(time_span_hours / 4)))
        bucket_size = time_span_hours / num_buckets
        
        earliest = timestamps[0]
        buckets = [0] * num_buckets
        bucket_counts = [0] * num_buckets
        
        for ts, val in zip(timestamps, values):
            hours_diff = (ts - earliest).total_seconds() / 3600
            bucket_idx = min(int(hours_diff / bucket_size), num_buckets - 1)
            buckets[bucket_idx] += val
            bucket_counts[bucket_idx] += 1
        
        avg_buckets = [b / max(c, 1) for b, c in zip(buckets, bucket_counts)]
        non_empty = [(i, v) for i, v in enumerate(avg_buckets) if v > 0]
        
        if len(non_empty) < 3:
            return {
                'velocity_score': 0.0,
                'confidence': 0.0,
                'pattern': 'sparse_data',
                'direction': 'neutral',
                'method': 'short_term'
            }
        
        # Linear regression
        x = np.array([i for i, _ in non_empty]).reshape(-1, 1)
        y = np.array([v for _, v in non_empty])
        
        slope, intercept, r_value, p_value, std_err = stats.linregress(x.flatten(), y)
        r_squared = r_value ** 2
        
        mean_val = np.mean(values)
        relative_slope = abs(slope) / (mean_val + 1)
        
        velocity_score = min(
            relative_slope * 40 +
            r_squared * 40 +
            (len(timestamps) / 30) * 20,
            100.0
        )
        
        # Determine pattern
        if slope > 0.3 * mean_val:
            pattern = 'explosive'
        elif slope > 0.1 * mean_val:
            pattern = 'rising'
        elif slope < -0.1 * mean_val:
            pattern = 'declining'
        else:
            pattern = 'stable'
        
        confidence = min(r_squared * 60 + (len(timestamps) / 50) * 40, 100.0)
        
        return {
            'velocity_score': round(velocity_score, 2),
            'confidence': round(confidence, 2),
            'pattern': pattern,
            'direction': 'upward' if slope > 0 else 'downward',
            'r_squared': round(r_squared, 3),
            'slope': round(slope, 4),
            'method': 'short_term',
            'buckets_analyzed': num_buckets
        }
    
    def calculate_long_term_velocity(self, timestamps: List[datetime], 
                                    values: List[float]) -> Dict:
        """Calculate velocity for long time windows (3-7+ days)"""
        if len(timestamps) < 10:
            return {
                'velocity_score': 0.0,
                'confidence': 0.0,
                'pattern': 'insufficient_data',
                'direction': 'neutral',
                'method': 'long_term'
            }
        
        sorted_data = sorted(zip(timestamps, values), key=lambda x: x[0])
        timestamps, values = zip(*sorted_data)
        
        base_time = timestamps[0]
        hours = np.array([(t - base_time).total_seconds() / 3600 for t in timestamps]).reshape(-1, 1)
        values_array = np.array(values)
        
        # Exponential time decay
        current_time = datetime.now().replace(tzinfo=None)
        weights = np.array([
            np.exp(-((current_time - ts.replace(tzinfo=None) if ts.tzinfo else ts).total_seconds() / 3600) / 48)
            for ts in timestamps
        ])
        
        weighted_values = values_array * weights
        
        # Fit regression
        model = LinearRegression()
        model.fit(hours, weighted_values.reshape(-1, 1))
        
        predictions = model.predict(hours)
        ss_res = np.sum((weighted_values - predictions.flatten()) ** 2)
        ss_tot = np.sum((weighted_values - np.mean(weighted_values)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        
        slope = float(model.coef_[0])
        
        # Calculate acceleration
        if len(values) >= 5:
            mid_point = len(values) // 2
            early_slope = (values[mid_point] - values[0]) / max((timestamps[mid_point] - timestamps[0]).total_seconds() / 3600, 1)
            late_slope = (values[-1] - values[mid_point]) / max((timestamps[-1] - timestamps[mid_point]).total_seconds() / 3600, 1)
            acceleration = late_slope - early_slope
        else:
            acceleration = 0
        
        mean_val = np.mean(values)
        relative_slope = abs(slope) / (mean_val + 1)
        relative_accel = abs(acceleration) / (mean_val + 1)
        
        velocity_score = min(
            relative_slope * 30 +
            r_squared * 30 +
            relative_accel * 20 +
            min(abs(slope) / mean_val, 1.0) * 20,
            100.0
        )
        
        # Pattern detection
        if acceleration > 0.2 * abs(slope) and slope > 0:
            pattern = 'accelerating'
        elif slope > 0.2 * mean_val:
            pattern = 'strong_uptrend'
        elif slope < -0.2 * mean_val:
            pattern = 'declining'
        elif abs(slope) < 0.05 * mean_val:
            pattern = 'stable'
        else:
            pattern = 'moderate_trend'
        
        confidence = min(
            r_squared * 40 +
            (len(timestamps) / 100) * 30 +
            (1 - abs(acceleration) / (abs(slope) + 1)) * 30,
            100.0
        )
        
        return {
            'velocity_score': round(velocity_score, 2),
            'confidence': round(confidence, 2),
            'pattern': pattern,
            'direction': 'upward' if slope > 0 else 'downward',
            'r_squared': round(r_squared, 3),
            'slope': round(slope, 4),
            'acceleration': round(acceleration, 4),
            'method': 'long_term'
        }
    
    def calculate_trend_velocity(self, detected_trend_id: int, max_lookback_days: int = 7) -> Dict:
        """
        Calculate velocity for a specific detected trend (NOT category).
        This is the key change - analyzing micro-trends individually.
        """
        cutoff_time = datetime.now().replace(tzinfo=None) - timedelta(days=max_lookback_days)
        
        # Get all signal-trend associations for this specific trend
        associations = self.db.query(SignalTrendAssociation).join(
            RawSignal, SignalTrendAssociation.signal_id == RawSignal.id
        ).filter(
            SignalTrendAssociation.detected_trend_id == detected_trend_id,
            RawSignal.content_created_at >= cutoff_time
        ).all()
        
        if len(associations) < 3:
            return {
                'velocity_score': 0.0,
                'confidence': 0.0,
                'pattern': 'insufficient_data',
                'direction': 'neutral',
                'method': 'none',
                'data_quality': {'data_points': len(associations)}
            }
        
        # Extract timestamps and engagement values (weighted by relevance)
        timestamps = []
        values = []
        for assoc in associations:
            signal = assoc.signal
            if signal.content_created_at:
                ts = signal.content_created_at.replace(tzinfo=None) if signal.content_created_at.tzinfo else signal.content_created_at
                timestamps.append(ts)
                # Weight engagement by how relevant this signal is to the trend
                weighted_value = float(signal.metric_value) * assoc.relevance_score
                values.append(weighted_value)
        
        # Assess data quality
        data_quality = self.assess_data_quality(timestamps, values)
        time_span_hours = data_quality['time_span_hours']
        
        # Decide which method(s) to use
        use_short_term = time_span_hours <= 72
        use_long_term = time_span_hours >= 48 and len(timestamps) >= 10
        
        results = {
            'data_quality': data_quality,
            'time_span_hours': time_span_hours,
            'data_points': len(timestamps)
        }
        
        # Calculate applicable velocities
        if use_short_term:
            short_result = self.calculate_short_term_velocity(timestamps, values)
            results['short_term'] = short_result
        
        if use_long_term:
            long_result = self.calculate_long_term_velocity(timestamps, values)
            results['long_term'] = long_result
        
        # Determine final composite score
        if use_short_term and use_long_term:
            short_weight = short_result['confidence'] * 0.4
            long_weight = long_result['confidence'] * 0.6
            
            total_weight = short_weight + long_weight
            if total_weight > 0:
                velocity_score = (
                    short_result['velocity_score'] * short_weight +
                    long_result['velocity_score'] * long_weight
                ) / total_weight
                confidence = (short_result['confidence'] + long_result['confidence']) / 2
                pattern = long_result['pattern'] if long_result['confidence'] > short_result['confidence'] else short_result['pattern']
                direction = long_result['direction'] if long_result['confidence'] > short_result['confidence'] else short_result['direction']
            else:
                velocity_score = 0.0
                confidence = 0.0
                pattern = 'uncertain'
                direction = 'neutral'
            method = 'hybrid'
        elif use_long_term:
            velocity_score = long_result['velocity_score']
            confidence = long_result['confidence']
            pattern = long_result['pattern']
            direction = long_result['direction']
            method = 'long_term_only'
        elif use_short_term:
            velocity_score = short_result['velocity_score']
            confidence = short_result['confidence']
            pattern = short_result['pattern']
            direction = short_result['direction']
            method = 'short_term_only'
        else:
            velocity_score = 0.0
            confidence = 0.0
            pattern = 'insufficient_data'
            direction = 'neutral'
            method = 'none'
        
        results.update({
            'velocity_score': round(velocity_score, 2),
            'confidence': round(confidence, 2),
            'pattern': pattern,
            'direction': direction,
            'method': method
        })
        
        return results
    
    def calculate_all_detected_trends(self, min_signal_count: int = 3, max_lookback_days: int = 7) -> Dict:
        """
        Calculate velocity for all detected trends with enough signals.
        This replaces calculate_all_categories() - we analyze trends, not categories.
        """
        # Get all detected trends with minimum signal count
        trends = self.db.query(DetectedTrend).filter(
            DetectedTrend.signal_count >= min_signal_count,
            DetectedTrend.is_validated == False
        ).all()
        
        logger.info(f"Analyzing {len(trends)} detected trends...")
        
        results = {}
        for trend in trends:
            logger.info(f"Analyzing: {trend.trend_phrase} ({trend.category}) - {trend.signal_count} signals")
            velocity_data = self.calculate_trend_velocity(trend.id, max_lookback_days)
            
            # Key format: "Category:TrendPhrase"
            key = f"{trend.category}:{trend.trend_phrase}"
            results[key] = {
                'trend_id': trend.id,
                'trend_phrase': trend.trend_phrase,
                'normalized_phrase': trend.normalized_phrase,
                'category': trend.category,
                'signal_count': trend.signal_count,
                **velocity_data
            }
        
        return results


def main():
    logger.info("="*60)
    logger.info("MICRO-TREND VELOCITY CALCULATOR")
    logger.info("Analyzing individual trends, not broad categories")
    logger.info("="*60)
    
    db = next(get_db())
    calc = HybridVelocityCalculator(db)
    
    try:
        results = calc.calculate_all_detected_trends(min_signal_count=3, max_lookback_days=7)
        
        if not results:
            logger.warning("\nNo detected trends found with sufficient signals!")
            logger.warning("Run reddit_scraper.py first to collect data.")
            return
        
        logger.info("\n" + "="*60)
        logger.info("VELOCITY ANALYSIS RESULTS")
        logger.info("="*60)
        
        # Sort by velocity score
        sorted_results = sorted(results.items(), key=lambda x: x[1].get('velocity_score', 0), reverse=True)
        
        for key, data in sorted_results:
            logger.info(f"\n{data['category']}: {data['trend_phrase']}")
            logger.info(f"  Velocity Score: {data.get('velocity_score', 0)}/100")
            logger.info(f"  Confidence: {data.get('confidence', 0)}/100")
            logger.info(f"  Pattern: {data.get('pattern', 'unknown')}")
            logger.info(f"  Direction: {data.get('direction', 'neutral')}")
            logger.info(f"  Method Used: {data.get('method', 'none')}")
            logger.info(f"  Signal Count: {data.get('signal_count', 0)} signals")
            logger.info(f"  Time Span: {data.get('time_span_hours', 0):.1f} hours")
            logger.info(f"  Data Quality: {data.get('data_quality', {}).get('quality_score', 0):.1f}/100")
        
        logger.info("\n" + "="*60)
        logger.info("SUMMARY BY CATEGORY")
        logger.info("="*60)
        
        # Group by category
        by_category = {}
        for key, data in results.items():
            cat = data['category']
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(data)
        
        for category in sorted(by_category.keys()):
            trends = by_category[category]
            logger.info(f"\n{category}: {len(trends)} trends detected")
            for trend in sorted(trends, key=lambda x: x['velocity_score'], reverse=True)[:3]:
                logger.info(f"  • {trend['trend_phrase']}: velocity {trend['velocity_score']:.1f}")
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
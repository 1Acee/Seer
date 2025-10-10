"""
Lightweight NLP-based trend extraction using NLTK.
Extracts meaningful trend phrases using multiple methods:
1. Hashtag extraction
2. Capitalized multi-word phrases (brand/product names)
3. Noun phrase extraction via POS tagging
4. Keyword extraction
"""

import re
from collections import defaultdict
from typing import List, Dict, Tuple
import logging

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.tag import pos_tag

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Download required NLTK data on first run
def download_nltk_data():
    """Download required NLTK data packages"""
    packages = ['punkt', 'averaged_perceptron_tagger', 'stopwords', 'punkt_tab']
    for package in packages:
        try:
            nltk.data.find(f'tokenizers/{package}')
        except LookupError:
            try:
                logger.info(f"Downloading NLTK package: {package}")
                nltk.download(package, quiet=True)
            except:
                pass

# Initialize on import
download_nltk_data()


class TrendExtractor:
    """
    Lightweight trend extractor using NLTK.
    Extracts trend phrases from social media content.
    """
    
    def __init__(self):
        """Initialize with stopwords and patterns"""
        # Extended stopwords for social media
        try:
            base_stopwords = set(stopwords.words('english'))
        except:
            nltk.download('stopwords')
            base_stopwords = set(stopwords.words('english'))
        
        self.stopwords = base_stopwords.union({
            'reddit', 'post', 'comment', 'new', 'best', 'good', 'great', 'really',
            'help', 'anyone', 'everyone', 'someone', 'something', 'would', 'could',
            'get', 'got', 'make', 'made', 'need', 'want', 'use', 'used', 'like',
            'just', 'know', 'think', 'people', 'time', 'way'
        })
        
        # Minimum quality thresholds
        self.min_phrase_length = 2  # words
        self.max_phrase_length = 5  # words
        self.min_word_length = 3  # characters
        
        logger.info("TrendExtractor initialized (NLTK-based)")
    
    def normalize_phrase(self, phrase: str) -> str:
        """
        Normalize a trend phrase for deduplication.
        Converts to lowercase, removes extra whitespace.
        """
        # Lowercase and strip
        phrase = phrase.lower().strip()
        
        # Remove punctuation except hyphens and apostrophes
        phrase = re.sub(r"[^\w\s\-']", '', phrase)
        
        # Collapse whitespace
        phrase = ' '.join(phrase.split())
        
        return phrase
    
    def extract_hashtags(self, text: str) -> List[str]:
        """Extract hashtags from text"""
        if not text:
            return []
        
        hashtags = re.findall(r'#(\w+)', text)
        
        # Clean and filter
        cleaned = []
        for tag in hashtags:
            tag = tag.lower()
            if len(tag) >= 3 and tag not in self.stopwords:
                cleaned.append(tag)
        
        return cleaned
    
    def extract_capitalized_phrases(self, text: str) -> List[str]:
        """
        Extract multi-word capitalized phrases (likely brand/product names).
        E.g., "Glass Skin Routine", "Dopamine Dressing"
        """
        if not text:
            return []
        
        # Find sequences of capitalized words
        pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b'
        matches = re.findall(pattern, text)
        
        phrases = []
        for match in matches:
            words = match.split()
            
            # Must be 2-4 words
            if len(words) < 2 or len(words) > 4:
                continue
            
            # Filter stopwords
            if any(w.lower() in self.stopwords for w in words):
                continue
            
            phrases.append(match)
        
        return phrases
    
    def extract_noun_phrases(self, text: str) -> List[Tuple[str, float]]:
        """
        Extract noun phrases using NLTK POS tagging.
        Returns list of (phrase, score) tuples.
        """
        if not text or len(text) < 10:
            return []
        
        try:
            # Tokenize and POS tag
            tokens = word_tokenize(text.lower())
            tagged = pos_tag(tokens)
        except Exception as e:
            logger.error(f"Error in POS tagging: {e}")
            return []
        
        # Extract noun phrases using simple grammar patterns
        phrases = []
        i = 0
        while i < len(tagged):
            phrase_words = []
            phrase_score = 1.0
            
            # Pattern: (Adj)* Noun+
            # Start with optional adjectives
            while i < len(tagged) and tagged[i][1] in ['JJ', 'JJR', 'JJS']:
                word = tagged[i][0]
                if len(word) >= self.min_word_length and word not in self.stopwords:
                    phrase_words.append(word)
                    phrase_score += 0.1
                i += 1
            
            # Must have at least one noun
            noun_start = i
            while i < len(tagged) and tagged[i][1] in ['NN', 'NNS', 'NNP', 'NNPS']:
                word = tagged[i][0]
                if len(word) >= self.min_word_length and word not in self.stopwords:
                    phrase_words.append(word)
                    # Boost score for proper nouns
                    if tagged[i][1] in ['NNP', 'NNPS']:
                        phrase_score *= 1.5
                i += 1
            
            # Only keep if we found nouns and phrase is valid length
            if (i > noun_start and 
                len(phrase_words) >= self.min_phrase_length and 
                len(phrase_words) <= self.max_phrase_length):
                
                phrase_text = ' '.join(phrase_words)
                phrases.append((phrase_text, phrase_score))
            
            # Move to next word if we haven't advanced
            if i == noun_start:
                i += 1
        
        return phrases
    
    def extract_keywords(self, text: str) -> List[str]:
        """Extract single important keywords"""
        if not text:
            return []
        
        try:
            tokens = word_tokenize(text.lower())
            tagged = pos_tag(tokens)
        except Exception as e:
            logger.error(f"Error extracting keywords: {e}")
            return []
        
        keywords = []
        for word, pos in tagged:
            # Keep nouns and adjectives
            if (pos in ['NN', 'NNS', 'NNP', 'NNPS', 'JJ', 'JJR', 'JJS'] and
                len(word) >= self.min_word_length and
                word not in self.stopwords and
                word.isalpha()):
                keywords.append(word)
        
        return keywords
    
    def extract_from_title(self, title: str) -> Dict[str, any]:
        """
        Main extraction method for a single post title.
        Returns dict with detected trends and metadata.
        """
        if not title:
            return {
                'trend_phrases': [],
                'keywords': [],
                'hashtags': [],
                'method': 'none'
            }
        
        # Extract using multiple methods
        hashtags = self.extract_hashtags(title)
        cap_phrases = self.extract_capitalized_phrases(title)
        noun_phrases = self.extract_noun_phrases(title)
        keywords = self.extract_keywords(title)
        
        # Combine all detected phrases
        all_phrases = []
        
        # Add hashtags as trends
        for tag in hashtags:
            all_phrases.append({
                'phrase': tag,
                'normalized': self.normalize_phrase(tag),
                'score': 1.5,  # Hashtags are explicit signals
                'method': 'hashtag'
            })
        
        # Add capitalized phrases
        for phrase in cap_phrases:
            all_phrases.append({
                'phrase': phrase,
                'normalized': self.normalize_phrase(phrase),
                'score': 1.3,  # Strong signal
                'method': 'capitalized'
            })
        
        # Add noun phrases
        for phrase, score in noun_phrases:
            all_phrases.append({
                'phrase': phrase,
                'normalized': self.normalize_phrase(phrase),
                'score': score,
                'method': 'noun_phrase'
            })
        
        # Deduplicate by normalized phrase
        seen = set()
        unique_phrases = []
        for item in all_phrases:
            norm = item['normalized']
            if norm not in seen and len(norm) >= 5:  # Min 5 chars
                seen.add(norm)
                unique_phrases.append(item)
        
        # Sort by score
        unique_phrases.sort(key=lambda x: x['score'], reverse=True)
        
        return {
            'trend_phrases': unique_phrases[:5],  # Top 5 trends per post
            'keywords': list(set(keywords))[:10],  # Top 10 keywords
            'hashtags': hashtags,
            'method': 'combined'
        }
    
    def extract_batch(self, titles: List[str], categories: List[str] = None) -> Dict:
        """
        Extract trends from a batch of titles.
        Returns aggregated trend statistics.
        """
        if not titles:
            return {'detected_trends': []}
        
        # Track all detected phrases across all titles
        phrase_stats = defaultdict(lambda: {
            'count': 0,
            'total_score': 0.0,
            'categories': set(),
            'methods': set(),
            'examples': []
        })
        
        for i, title in enumerate(titles):
            category = categories[i] if categories and i < len(categories) else 'unknown'
            
            result = self.extract_from_title(title)
            
            for trend in result['trend_phrases']:
                norm = trend['normalized']
                phrase_stats[norm]['count'] += 1
                phrase_stats[norm]['total_score'] += trend['score']
                phrase_stats[norm]['categories'].add(category)
                phrase_stats[norm]['methods'].add(trend['method'])
                
                # Keep a few example titles
                if len(phrase_stats[norm]['examples']) < 3:
                    phrase_stats[norm]['examples'].append(title[:100])
        
        # Convert to list and calculate final scores
        detected_trends = []
        for normalized_phrase, stats in phrase_stats.items():
            # Only keep trends that appear multiple times
            if stats['count'] >= 2:
                detected_trends.append({
                    'normalized_phrase': normalized_phrase,
                    'signal_count': stats['count'],
                    'avg_score': stats['total_score'] / stats['count'],
                    'categories': list(stats['categories']),
                    'extraction_methods': list(stats['methods']),
                    'example_titles': stats['examples']
                })
        
        # Sort by signal count and score
        detected_trends.sort(
            key=lambda x: (x['signal_count'], x['avg_score']),
            reverse=True
        )
        
        return {
            'detected_trends': detected_trends,
            'total_titles_processed': len(titles),
            'unique_trends_found': len(detected_trends)
        }


def main():
    """Test the trend extractor"""
    extractor = TrendExtractor()
    
    # Test titles
    test_titles = [
        "My Glass Skin Routine finally worked! #glasskin #skincare",
        "Anyone else trying the Glass Skin look?",
        "Dopamine Dressing is changing my life",
        "How to achieve Glass Skin in 5 steps",
        "Quiet Luxury aesthetic for fall 2024",
        "Quiet Luxury vibes only",
        "Clean Girl Aesthetic makeup tutorial",
        "The rise of Dopamine Makeup #dopaminebeauty",
    ]
    
    categories = ["Beauty"] * len(test_titles)
    
    # Test single extraction
    logger.info("Testing single extraction...")
    result = extractor.extract_from_title(test_titles[0])
    logger.info(f"\nTitle: {test_titles[0]}")
    logger.info(f"Detected trends: {result['trend_phrases']}")
    logger.info(f"Keywords: {result['keywords']}")
    logger.info(f"Hashtags: {result['hashtags']}\n")
    
    # Test batch extraction
    logger.info("Testing batch extraction...")
    results = extractor.extract_batch(test_titles, categories)
    
    logger.info(f"\nProcessed {results['total_titles_processed']} titles")
    logger.info(f"Found {results['unique_trends_found']} unique trends\n")
    
    for trend in results['detected_trends']:
        logger.info(f"Trend: '{trend['normalized_phrase']}'")
        logger.info(f"  Signal count: {trend['signal_count']}")
        logger.info(f"  Avg score: {trend['avg_score']:.2f}")
        logger.info(f"  Methods: {', '.join(trend['extraction_methods'])}")
        logger.info(f"  Example: {trend['example_titles'][0]}\n")


if __name__ == "__main__":
    main()
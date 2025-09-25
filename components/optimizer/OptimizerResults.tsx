'use client';

import { useState } from 'react';

interface AnalysisResult {
  id: string;
  fileName: string;
  uploadDate: Date;
  platform: string;
  overallScore: number;
  hookStrength: number;
  trendAlignment: number;
  pacing: number;
  suggestions: {
    category: string;
    items: string[];
  }[];
  alignedTrends: string[];
  recommendedHashtags: string[];
  bestPostingTimes: string[];
}

interface OptimizerResultsProps {
  result: AnalysisResult;
  onBack: () => void;
}

export default function OptimizerResults({ result, onBack }: OptimizerResultsProps) {
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [expandedSuggestions, setExpandedSuggestions] = useState<string[]>([]);

  const copyHashtags = () => {
    navigator.clipboard.writeText(result.recommendedHashtags.join(' '));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const toggleSuggestion = (category: string) => {
    setExpandedSuggestions(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <span className="text-lg">←</span>
          <span>New Analysis</span>
        </button>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-sm">
            <span className="mr-2">📥</span>
            Export Report
          </button>
          <button className="px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-sm">
            <span className="mr-2">📧</span>
            Share
          </button>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 mb-8 border border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-light text-stone-900 dark:text-stone-100 mb-2">
              {result.fileName}
            </h2>
            <p className="text-sm text-stone-500">
              Platform: {result.platform} • Analyzed: {new Date(result.uploadDate).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-light ${getScoreColor(result.overallScore)}`}>
              {result.overallScore}
            </div>
            <div className={`text-sm ${getScoreColor(result.overallScore)}`}>
              {getScoreLabel(result.overallScore)}
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-stone-600 dark:text-stone-400">Hook Strength</span>
              <span className={`font-light ${getScoreColor(result.hookStrength)}`}>{result.hookStrength}</span>
            </div>
            <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  result.hookStrength >= 80 ? 'bg-green-500' :
                  result.hookStrength >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.hookStrength}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-stone-600 dark:text-stone-400">Trend Alignment</span>
              <span className={`font-light ${getScoreColor(result.trendAlignment)}`}>{result.trendAlignment}</span>
            </div>
            <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 delay-100 ${
                  result.trendAlignment >= 80 ? 'bg-green-500' :
                  result.trendAlignment >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.trendAlignment}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-stone-600 dark:text-stone-400">Pacing & Retention</span>
              <span className={`font-light ${getScoreColor(result.pacing)}`}>{result.pacing}</span>
            </div>
            <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 delay-200 ${
                  result.pacing >= 80 ? 'bg-green-500' :
                  result.pacing >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.pacing}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Suggestions */}
        <div>
          <h3 className="text-lg font-light text-stone-900 dark:text-stone-100 mb-4">
            Optimization Suggestions
          </h3>
          <div className="space-y-3">
            {result.suggestions.map((suggestion) => (
              <div
                key={suggestion.category}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleSuggestion(suggestion.category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {suggestion.category}
                  </span>
                  <span className={`transform transition-transform ${
                    expandedSuggestions.includes(suggestion.category) ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
                {expandedSuggestions.includes(suggestion.category) && (
                  <div className="px-6 pb-4 space-y-2 animate-slideDown">
                    {suggestion.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span className="text-sm text-stone-600 dark:text-stone-400">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Aligned Trends */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-4">
              Aligned Trends
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.alignedTrends.map((trend) => (
                <span
                  key={trend}
                  className="px-3 py-1.5 bg-gradient-to-r from-accent/10 to-transparent rounded-full text-sm text-stone-700 dark:text-stone-300"
                >
                  {trend}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Hashtags */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100">
                Recommended Hashtags
              </h3>
              <button
                onClick={copyHashtags}
                className="text-xs px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                {copiedHashtags ? '✓ Copied!' : 'Copy All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.recommendedHashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-full text-sm text-stone-700 dark:text-stone-300 cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                  onClick={() => navigator.clipboard.writeText(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Best Posting Times */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-4">
              Best Posting Times
            </h3>
            <div className="space-y-2">
              {result.bestPostingTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-lg">🕐</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-gradient-to-r from-stone-100 to-transparent dark:from-stone-800 dark:to-transparent rounded-2xl">
        <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-white dark:bg-stone-900 rounded-full text-sm hover:scale-105 transition-transform">
            📅 Schedule Post
          </button>
          <button className="px-4 py-2 bg-white dark:bg-stone-900 rounded-full text-sm hover:scale-105 transition-transform">
            📊 Track Performance
          </button>
          <button className="px-4 py-2 bg-white dark:bg-stone-900 rounded-full text-sm hover:scale-105 transition-transform">
            🔄 Re-analyze with Changes
          </button>
          <button className="px-4 py-2 bg-white dark:bg-stone-900 rounded-full text-sm hover:scale-105 transition-transform">
            📝 Save to Library
          </button>
        </div>
      </div>
    </div>
  );
}
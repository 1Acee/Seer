'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface EditContext {
  platform: 'tiktok' | 'reels' | 'shorts';
  duration: number;
  hasEdit: boolean;
  trendAlignment?: string[];
  score?: number;
}

interface SeerChatProps {
  context: EditContext;
  onEditRequest?: (request: string) => void;
}

export default function SeerChat({ context, onEditRequest }: SeerChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: 'initial',
        role: 'assistant',
        content: `I'm Seer, your AI video optimization assistant. I can help you create the perfect ${
          context.platform === 'tiktok' ? 'TikTok' : context.platform === 'reels' ? 'Reel' : 'Short'
        }. Upload your clips and I'll handle the editing, or ask me anything about trending content strategies.`,
        timestamp: new Date(),
        suggestions: [
          'What makes content go viral?',
          'Show me trending audio options',
          'How should I structure my hook?'
        ]
      };
      setMessages([greeting]);
    }
  }, []);

  // Update assistant message when edit is created
  useEffect(() => {
    if (context.hasEdit && messages.length === 1) {
      const editComplete: ChatMessage = {
        id: `edit-${Date.now()}`,
        role: 'assistant',
        content: `Perfect! I've created a ${context.duration}-second edit optimized for ${
          context.platform
        }. ${
          context.trendAlignment 
            ? `It aligns with "${context.trendAlignment[0]}" which is trending strongly right now.` 
            : ''
        } ${
          context.score && context.score >= 80 
            ? 'The optimization score is excellent!' 
            : context.score 
            ? 'There\'s room to improve the score - would you like me to enhance it?' 
            : ''
        }`,
        timestamp: new Date(),
        suggestions: [
          'Make the hook stronger',
          'Add captions with trending style',
          'Adjust pacing for better retention',
          'Match trending audio'
        ]
      };
      setMessages(prev => [...prev, editComplete]);
    }
  }, [context.hasEdit]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Trigger edit request if applicable
    if (onEditRequest) {
      onEditRequest(input);
    }

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'I\'ll adjust that for you. The edit now has quicker cuts in the first 3 seconds to maximize hook engagement.',
        'Great idea! I\'ve added dynamic captions that appear in sync with the beat. This style is performing 40% better this week.',
        'I\'ve analyzed similar viral content and adjusted the pacing. The new version should maintain 85%+ retention.',
        'I understand what you\'re looking for. Let me restructure this to better match that trending pattern.',
        'Done! I\'ve enhanced the transitions and added a trending effect that\'s getting 3x more shares this week.'
      ];

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-light text-foreground">
              Seer AI Assistant
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Ask me to adjust edits, add effects, or optimize for trends
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === 'user' ? 'order-1' : 'order-2'
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'text-white'
                      : 'bg-secondary text-foreground'
                  }`}
                  style={{
                    backgroundColor: message.role === 'user' ? 'var(--accent-color)' : undefined
                  }}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                
                {/* Suggestion chips */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-xs rounded-full bg-secondary/70 hover:bg-secondary text-secondary-foreground transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'order-2 ml-2' : 'order-1 mr-2'
                }`}
                style={{
                  backgroundColor: message.role === 'user' 
                    ? 'var(--muted)' 
                    : 'var(--accent-color)',
                  color: message.role === 'user' ? 'var(--foreground)' : 'white'
                }}
              >
                {message.role === 'user' ? 'U' : 'S'}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-border">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Seer anything..."
            className="w-full pl-4 pr-12 py-3 bg-secondary rounded-2xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all"
            style={{
              '--tw-ring-color': 'rgba(var(--accent-rgb), 0.2)'
            } as React.CSSProperties}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              backgroundColor: input.trim() ? 'var(--accent-color)' : 'var(--muted)',
              color: 'white'
            }}
          >
            <span className="text-sm">↑</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            Powered by Seer AI
          </span>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Clear chat
          </button>
        </div>
      </div>
    </div>
  );
}
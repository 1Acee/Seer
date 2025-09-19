// components/dashboard/AddEventModal.tsx
'use client';

import { useState } from 'react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: NewEvent) => void;
  selectedDate?: Date;
}

interface NewEvent {
  title: string;
  description: string;
  date: Date;
  time: string;
  type: 'trend' | 'upload' | 'meeting' | 'reminder';
  notifications?: {
    push: boolean;
  };
  reminderTime?: string;
}

export default function AddEventModal({ isOpen, onClose, onSave, selectedDate }: AddEventModalProps) {
  const [formData, setFormData] = useState<NewEvent>({
    title: '',
    description: '',
    date: selectedDate || new Date(),
    time: '09:00',
    type: 'meeting',
    notifications: {
      push: true
    },
    reminderTime: '15'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NewEvent, string>>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<Record<keyof NewEvent, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: selectedDate || new Date(),
        time: '09:00',
        type: 'meeting',
        notifications: {
          push: true
        },
        reminderTime: '15'
      });
      onClose();
    }
  };

  const handleInputChange = (field: keyof NewEvent, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'date' ? new Date(value) : value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend': return '📈';
      case 'upload': return '📤';
      case 'meeting': return '🤝';
      case 'reminder': return '🔔';
      default: return '📅';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light font-['Playfair_Display'] text-stone-900">
              Add Event
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 6-12 12"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter event title..."
              className={`
                w-full px-4 py-3 rounded-xl border transition-colors
                focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent
                ${errors.title ? 'border-red-300 bg-red-50' : 'border-stone-300 bg-white'}
              `}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['trend', 'upload', 'meeting', 'reminder'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange('type', type)}
                  className={`
                    p-3 rounded-xl border transition-all text-left capitalize
                    ${formData.type === type
                      ? 'border-coral bg-coral/10 text-coral'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(type)}</span>
                    <span className="font-medium">{type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formatDateForInput(formData.date)}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-xl border transition-colors
                  focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent
                  ${errors.time ? 'border-red-300 bg-red-50' : 'border-stone-300 bg-white'}
                `}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add details about this event..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent resize-none"
            />
          </div>

          {/* Preset Event Types for Quick Add */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Quick Add
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { title: 'Weekly Trend Review', type: 'meeting' as const, description: 'Review emerging trends and market insights' },
                { title: 'Content Upload Deadline', type: 'upload' as const, description: 'Upload optimized content to platforms' },
                { title: 'Trend Analysis Complete', type: 'trend' as const, description: 'Analysis ready for review' },
                { title: 'Follow-up Reminder', type: 'reminder' as const, description: 'Check on trend performance' }
              ].map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      title: preset.title,
                      type: preset.type,
                      description: preset.description
                    }));
                  }}
                  className="text-left p-3 rounded-xl border border-stone-200 hover:border-coral hover:bg-coral/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getTypeIcon(preset.type)}</span>
                    <div>
                      <div className="font-medium text-stone-900">{preset.title}</div>
                      <div className="text-xs text-stone-600">{preset.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Notifications
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔔</span>
                  <div>
                    <div className="font-medium text-stone-900">Push Notification</div>
                    <div className="text-xs text-stone-600">Get notified when event starts</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications?.push || true}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-coral rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200">
                <div className="flex items-center gap-3">
                  <span className="text-lg">⏰</span>
                  <div>
                    <div className="font-medium text-stone-900">Remind me</div>
                    <div className="text-xs text-stone-600">Send reminder before event</div>
                  </div>
                </div>
                <select
                  value={formData.reminderTime || '15'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    reminderTime: e.target.value
                  }))}
                  className="px-3 py-1 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-coral"
                >
                  <option value="0">At event time</option>
                  <option value="5">5 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="1440">1 day before</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-coral text-white hover:bg-coral/90 transition-colors font-medium"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  description?: string;
  type: 'trend' | 'upload' | 'meeting' | 'reminder';
  color?: string;
  notifications?: {
    push: boolean;
  };
  reminderTime?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onAddEvent?: (date: Date) => void;
}

type ViewType = 'month' | 'week' | 'day' | 'list';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Mock events for demonstration  
const mockEvents: CalendarEvent[] = [
  { 
    id: '1', 
    title: 'Quiet Luxury trend peak', 
    date: new Date(2024, 11, 15), 
    time: '14:00',
    type: 'trend',
    description: 'Analysis shows trend reaching critical mass'
  },
  { 
    id: '2', 
    title: 'Content upload deadline', 
    date: new Date(2024, 11, 18), 
    time: '23:59',
    type: 'upload',
    description: 'Upload optimized TikTok content'
  },
  { 
    id: '3', 
    title: 'Weekly strategy call', 
    date: new Date(2024, 11, 20), 
    time: '10:00',
    type: 'meeting',
    description: 'Review performance and plan next week'
  },
  { 
    id: '4', 
    title: 'Dopamine Decor analysis', 
    date: new Date(2024, 11, 22), 
    time: '16:30',
    type: 'trend',
    description: 'Complete trend analysis report'
  },
  { 
    id: '5', 
    title: 'Campaign review', 
    date: new Date(2024, 11, 25), 
    time: '09:30',
    type: 'meeting',
    description: 'Review holiday campaign performance'
  },
  { 
    id: '6', 
    title: 'TikTok optimization', 
    date: new Date(2024, 11, 27), 
    time: '11:00',
    type: 'upload',
    description: 'Optimize videos for trending hashtags'
  },
];

export default function Calendar({ events: propEvents, onDateClick, onAddEvent }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(propEvents || mockEvents);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigation
  const goToPrevious = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNext = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Generate calendar days for month view
  const generateMonthDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startOfCalendar = new Date(firstDay);
    
    // Adjust to start on Monday (1) instead of Sunday (0)
    const dayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday = 0 to Sunday = 6
    startOfCalendar.setDate(firstDay.getDate() - dayOfWeek);
    
    const days = [];
    const current = new Date(startOfCalendar);
    
    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth;
  const isSelected = (date: Date) => selectedDate && date.toDateString() === selectedDate.toDateString();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (onDateClick) onDateClick(date);
  };

  const handleAddEvent = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalDate(date);
    setShowModal(true);
    if (onAddEvent) onAddEvent(date);
  };

  const handleCreateEvent = () => {
    setModalDate(new Date());
    setShowModal(true);
  };

  const handleSaveEvent = async (newEvent: any) => {
    // Generate unique ID
    const eventId = `event-${Date.now()}`;
    
    const event: CalendarEvent = {
      id: eventId,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      notifications: newEvent.notifications,
      reminderTime: newEvent.reminderTime
    };

    // Add to events list
    setEvents(prev => [...prev, event]);

    // Schedule notification if enabled
    if (event.notifications?.push) {
      try {
        // Import notification service dynamically to avoid SSR issues
        const { notificationService } = await import('@/utils/notificationService');
        await notificationService.scheduleEventNotification({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time || '09:00',
          type: event.type,
          reminderTime: event.reminderTime
        });
        console.log('Notification scheduled for event:', event.title);
      } catch (error) {
        console.error('Failed to schedule notification:', error);
      }
    }
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'trend': return 'bg-coral/20 text-coral border-coral/30';
      case 'upload': return 'bg-muted text-secondary-foreground border-border';
      case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reminder': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const renderMonthView = () => {
    const days = generateMonthDays();
    
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS.map((day) => (
            <div key={day} className="p-4 text-center border-r border-border last:border-r-0 bg-background">
              <span className="text-sm font-medium text-muted-foreground">
                {day}
              </span>
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const weekIndex = Math.floor(index / 7);
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  relative min-h-[120px] p-2 border-r border-border last:border-r-0 cursor-pointer
                  transition-colors hover:bg-background group
                  ${weekIndex < 5 ? 'border-b border-border' : ''}
                  ${!isCurrentMonthDay ? 'bg-background text-muted-foreground' : 'bg-card'}
                  ${isSelected(date) ? 'ring-2 ring-coral ring-inset' : ''}
                `}
              >
                {/* Date number */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`
                    text-sm font-medium
                    ${isToday(date) 
                      ? 'w-6 h-6 bg-coral text-white rounded-full flex items-center justify-center text-xs' 
                      : isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground'
                    }
                  `}>
                    {date.getDate()}
                  </span>
                  
                  {/* Add event button */}
                  <button
                    onClick={(e) => handleAddEvent(date, e)}
                    className="w-5 h-5 rounded text-muted-foreground hover:text-coral hover:bg-coral/10 opacity-0 group-hover:opacity-100 transition-all text-xs flex items-center justify-center"
                    title="Add event"
                  >
                    +
                  </button>
                </div>
                
                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 4).map((event) => (
                    <div
                      key={event.id}
                      className={`
                        text-xs px-2 py-1 rounded-md border truncate
                        ${getEventColor(event.type)}
                      `}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 4 && (
                    <div className="text-xs text-muted-foreground px-2">
                      +{dayEvents.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = (startOfWeek.getDay() + 6) % 7; // Convert to Monday = 0
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((date, index) => (
            <div key={index} className="p-4 text-center border-r border-border last:border-r-0 bg-background">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {DAYS[index]}
              </div>
              <div className={`
                text-lg font-light mt-1
                ${isToday(date) 
                  ? 'w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center mx-auto text-sm' 
                  : 'text-foreground'
                }
              `}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        {/* Week Grid */}
        <div className="grid grid-cols-7">
          {weekDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  relative min-h-[300px] p-3 border-r border-border last:border-r-0 cursor-pointer
                  transition-colors hover:bg-background group
                  ${isSelected(date) ? 'ring-2 ring-coral ring-inset' : ''}
                `}
              >
                {/* Events */}
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`
                        text-xs px-2 py-2 rounded-md border
                        ${getEventColor(event.type)}
                      `}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
                
                {/* Add event button */}
                <button
                  onClick={(e) => handleAddEvent(date, e)}
                  className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-muted hover:bg-coral text-white text-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                  title="Add event"
                >
                  +
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="bg-card rounded-2xl border border-border p-8">
        {/* Day Header */}
        <div className="text-center mb-8">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
          <div className={`
            text-5xl font-extralight font-['Playfair_Display'] mb-4
            ${isToday(currentDate) ? 'text-coral' : 'text-foreground'}
          `}>
            {currentDate.getDate()}
          </div>
          <div className="text-lg text-muted-foreground">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        
        {/* Time slots and events */}
        <div className="max-w-2xl mx-auto">
          {dayEvents.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground mb-4">Events</h3>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`
                    p-4 rounded-xl border-l-4
                    ${getEventColor(event.type).replace('border-', 'border-l-')}
                  `}
                >
                  <div className="font-medium text-foreground mb-1">{event.title}</div>
                  <div className="text-sm text-muted-foreground capitalize">{event.type}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-4xl mb-4">📅</div>
              <div className="text-lg font-light mb-2">No events scheduled</div>
              <div className="text-sm">Click the button below to add an event</div>
            </div>
          )}
          
          {/* Add event button */}
          <button
            onClick={(e) => handleAddEvent(currentDate, e)}
            className="w-full mt-8 p-4 rounded-xl border-2 border-dashed border-border hover:border-coral hover:bg-coral/5 transition-colors text-muted-foreground hover:text-coral font-medium"
          >
            + Add Event for {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </button>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    // Get all events for the current month, sorted by date
    const monthEvents = events
      .filter(event => 
        event.date.getMonth() === currentMonth && 
        event.date.getFullYear() === currentYear
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return (
      <div className="bg-card rounded-2xl border border-border">
        {/* List Header */}
        <div className="px-6 py-4 border-b border-border bg-background">
          <h3 className="text-lg font-light text-foreground">
            Events for {MONTHS[currentMonth]} {currentYear}
          </h3>
        </div>
        
        {/* Events List */}
        <div className="divide-y divide-border">
          {monthEvents.length > 0 ? (
            monthEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleDateClick(event.date)}
                className="px-6 py-4 hover:bg-background cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Date */}
                    <div className="text-center min-w-[60px]">
                      <div className="text-xs font-medium text-muted-foreground uppercase">
                        {event.date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className={`
                        text-xl font-light
                        ${isToday(event.date) ? 'text-coral' : 'text-foreground'}
                      `}>
                        {event.date.getDate()}
                      </div>
                    </div>
                    
                    {/* Event details */}
                    <div>
                      <div className="font-medium text-foreground group-hover:text-coral transition-colors">
                        {event.title}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize mt-1">
                        {event.type}
                      </div>
                    </div>
                  </div>
                  
                  {/* Event type badge */}
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${getEventColor(event.type)}
                  `}>
                    {event.type}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-16 text-center text-muted-foreground">
              <div className="text-3xl mb-4">📋</div>
              <div className="text-lg font-light mb-2">No events this month</div>
              <div className="text-sm">Add events to see them listed here</div>
            </div>
          )}
        </div>
        
        {/* Add event button */}
        <div className="px-6 py-4 border-t border-border bg-background">
          <button
            onClick={(e) => handleAddEvent(new Date(), e)}
            className="w-full p-3 rounded-xl border-2 border-dashed border-border hover:border-coral hover:bg-coral/5 transition-colors text-muted-foreground hover:text-coral font-medium"
          >
            + Add Event
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-extralight font-['Playfair_Display'] text-foreground">
            Calendar
          </h1>
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm rounded-xl border border-border hover:border-coral hover:text-coral transition-colors text-muted-foreground"
          >
            Today
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View toggles */}
          <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl">
            {(['month', 'week', 'day', 'list'] as ViewType[]).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`
                  px-3 py-2 text-sm font-medium rounded-lg transition-all capitalize
                  ${view === viewType 
                    ? 'bg-card text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {viewType}
              </button>
            ))}
          </div>
          
          {/* Create button */}
          <button
            onClick={handleCreateEvent}
            className="px-4 py-2 bg-coral text-white rounded-xl hover:bg-coral/90 transition-colors font-medium text-sm"
          >
            Create
          </button>
        </div>
      </div>

      {/* Month/Year Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          
          <h2 className="text-xl font-light text-foreground min-w-[200px]">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          
          <button
            onClick={goToNext}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Month indicator with date */}
        <div className="text-sm text-muted-foreground">
          Week {Math.ceil(today.getDate() / 7)} of {MONTHS[today.getMonth()]}
        </div>
      </div>

      {/* Calendar Content */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
      {view === 'list' && renderListView()}
      
      {/* Add Event Modal */}
      {typeof window !== 'undefined' && (
        <>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
              />
              
              {/* Modal */}
              <div className="relative bg-card rounded-3xl shadow-2xl border border-border w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-light font-['Playfair_Display'] text-foreground">
                      Add Event
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-secondary-foreground"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m18 6-12 12"/>
                        <path d="m6 6 12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-6 text-center text-muted-foreground">
                  <div className="text-3xl mb-4">🚧</div>
                  <div className="text-lg font-light mb-2">Modal Coming Soon</div>
                  <div className="text-sm">
                    The full event creation modal is being prepared with notification scheduling.
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 px-4 py-2 bg-coral text-white rounded-xl hover:bg-coral/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
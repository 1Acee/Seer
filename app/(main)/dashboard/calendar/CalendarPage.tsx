'use client';

import Calendar from '@/components/dashboard/Calendar';

export default function CalendarPage() {
  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
  };

  const handleAddEvent = (date: Date) => {
    console.log('Add event for:', date);
    // Later: open event creation modal
  };

  return (
    <div className="p-8">
      <Calendar 
        onDateClick={handleDateClick}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}
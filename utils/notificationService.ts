// utils/notificationService.ts
interface EventNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  timestamp: number;
  eventId: string;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private registeredNotifications: Map<string, number> = new Map();

  constructor() {
    this.checkPermission();
  }

  // Check current notification permission
  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  // Schedule a notification for an event
  async scheduleEventNotification(event: {
    id: string;
    title: string;
    description?: string;
    date: Date;
    time: string;
    type: string;
    reminderTime?: string;
  }): Promise<boolean> {
    if (!await this.requestPermission()) {
      return false;
    }

    // Parse the event date and time
    const [hours, minutes] = event.time.split(':').map(Number);
    const eventDateTime = new Date(event.date);
    eventDateTime.setHours(hours, minutes, 0, 0);

    // Calculate notification time based on reminder setting
    const reminderMinutes = parseInt(event.reminderTime || '15', 10);
    const notificationTime = new Date(eventDateTime.getTime() - (reminderMinutes * 60 * 1000));

    // Don't schedule past notifications
    if (notificationTime <= new Date()) {
      console.warn('Cannot schedule notification for past time');
      return false;
    }

    // Cancel existing notification for this event
    this.cancelEventNotification(event.id);

    // Schedule the notification
    const timeoutId = window.setTimeout(() => {
      this.showNotification({
        id: `event-${event.id}`,
        title: `Event Reminder: ${event.title}`,
        body: event.description || `Your ${event.type} is starting ${reminderMinutes === 0 ? 'now' : `in ${reminderMinutes} minutes`}`,
        icon: this.getEventIcon(event.type),
        badge: '/favicon.ico',
        timestamp: Date.now(),
        eventId: event.id
      });
    }, notificationTime.getTime() - Date.now());

    // Store the timeout ID for potential cancellation
    this.registeredNotifications.set(event.id, timeoutId);

    console.log(`Notification scheduled for ${notificationTime.toLocaleString()}`);
    return true;
  }

  // Show immediate notification
  private showNotification(notification: EventNotification): void {
    if (this.permission !== 'granted') return;

    const notif = new Notification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      tag: notification.id,
      requireInteraction: true,
    });

    // Auto-close after 10 seconds
    setTimeout(() => {
      notif.close();
    }, 10000);

    // Handle click to focus the calendar page
    notif.onclick = () => {
      window.focus();
      notif.close();
      // Navigate to calendar page
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard/calendar';
      }
    };
  }

  // Cancel a scheduled notification
  cancelEventNotification(eventId: string): void {
    const timeoutId = this.registeredNotifications.get(eventId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.registeredNotifications.delete(eventId);
      console.log(`Cancelled notification for event ${eventId}`);
    }
  }

  // Get appropriate icon for event type
  private getEventIcon(type: string): string {
    const icons = {
      trend: '📈',
      upload: '📤',
      meeting: '🤝',
      reminder: '🔔'
    };
    return icons[type as keyof typeof icons] || '📅';
  }

  // Test notification (for debugging)
  async testNotification(): Promise<void> {
    if (!await this.requestPermission()) {
      alert('Notifications not permitted');
      return;
    }

    this.showNotification({
      id: 'test-notification',
      title: 'Seer Calendar Test',
      body: 'Push notifications are working correctly!',
      icon: '📅',
      badge: '/favicon.ico',
      timestamp: Date.now(),
      eventId: 'test'
    });
  }

  // Get permission status
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export types
export type { EventNotification };
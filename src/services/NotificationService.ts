import { supabase } from "@/integrations/supabase/client";

export interface TaskNotification {
  id: string;
  title: string;
  body: string;
  taskId?: string;
  timestamp: number;
  read: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private notificationsKey = 'confidence_notifications';
  private timerId: number | null = null;

  private constructor() {
    // Private constructor to prevent direct construction calls with the `new` operator
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async scheduleNotifications(): Promise<void> {
    // Clear any existing timer
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }

    // Schedule notifications every two hours between 9am and 9pm
    this.timerId = window.setInterval(async () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Only send notifications between 9am and 9pm
      if (hours >= 9 && hours < 21) {
        await this.createRandomTaskNotification();
      }
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    // Also create one notification immediately if it's between 9am and 9pm
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 9 && hours < 21) {
      await this.createRandomTaskNotification();
    }
  }

  public async createRandomTaskNotification(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Get a random task
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('id, title, description')
        .limit(20);

      if (!tasksData || tasksData.length === 0) return;

      // Select a random task
      const randomTask = tasksData[Math.floor(Math.random() * tasksData.length)];
      
      // Create notification
      const notification: TaskNotification = {
        id: crypto.randomUUID(),
        title: 'New Confidence Task',
        body: randomTask.title,
        taskId: randomTask.id,
        timestamp: Date.now(),
        read: false
      };

      // Store the notification
      await this.saveNotification(notification);

      // Show browser notification if supported
      this.showBrowserNotification(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  private async saveNotification(notification: TaskNotification): Promise<void> {
    const notifications = await this.getNotifications();
    notifications.push(notification);
    
    // Keep only the last 50 notifications
    if (notifications.length > 50) {
      notifications.shift();
    }
    
    localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
  }

  public async getNotifications(): Promise<TaskNotification[]> {
    const data = localStorage.getItem(this.notificationsKey);
    return data ? JSON.parse(data) : [];
  }

  public async markAsRead(notificationId: string): Promise<void> {
    const notifications = await this.getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    localStorage.setItem(this.notificationsKey, JSON.stringify(updatedNotifications));
  }

  public async clearAll(): Promise<void> {
    localStorage.setItem(this.notificationsKey, JSON.stringify([]));
  }

  private showBrowserNotification(notification: TaskNotification): void {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico'
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/favicon.ico'
          });
        }
      });
    }
  }

  public cleanup(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export default NotificationService;

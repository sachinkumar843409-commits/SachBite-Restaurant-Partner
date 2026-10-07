import { sounds } from './sound';
import { ToastMessage } from '../types';

type ToastListener = (toasts: ToastMessage[]) => void;

class NotificationManager {
  private listeners: ToastListener[] = [];
  private toasts: ToastMessage[] = [];
  private fcmToken: string | null = null;
  public hasNotificationPermission: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.hasNotificationPermission = Notification.permission === 'granted';
    }
  }

  public subscribe(listener: ToastListener) {
    this.listeners.push(listener);
    listener(this.toasts);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l([...this.toasts]));
  }

  public showToast(toast: Omit<ToastMessage, 'id'>) {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
    const newToast: ToastMessage = { ...toast, id };
    this.toasts = [...this.toasts, newToast];
    this.notify();

    if (toast.type === 'success') {
      sounds.playSuccessSound();
    }

    const duration = toast.duration || 3500;
    setTimeout(() => {
      this.dismissToast(id);
    }, duration);

    return id;
  }

  public dismissToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  /**
   * Request Notification Permission
   */
  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.hasNotificationPermission = permission === 'granted';
      if (this.hasNotificationPermission) {
        this.fcmToken = 'fcm_partner_token_' + Math.random().toString(36).substring(2, 15);
        this.showToast({
          type: 'success',
          title: 'Push Notifications Active',
          message: 'You will receive instant sound & banner alerts for incoming orders.',
        });
      }
      return this.hasNotificationPermission;
    } catch {
      return false;
    }
  }

  /**
   * Trigger incoming order push alert
   */
  public notifyNewOrder(orderId: string, customerName: string, amount: number) {
    sounds.playNewOrderSound();

    this.showToast({
      type: 'info',
      title: `🔔 New Order ${orderId}!`,
      message: `${customerName} placed an order worth ₹${amount}`,
      duration: 6000,
    });

    if (this.hasNotificationPermission && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        new Notification(`New SachBite Order: ${orderId}`, {
          body: `${customerName} • ₹${amount}\nTap to view items & prepare.`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: orderId,
        });
      } catch {
        // Notification constructor restricted in some iframe contexts
      }
    }
  }

  public getFcmToken(): string | null {
    return this.fcmToken;
  }
}

export const notificationManager = new NotificationManager();

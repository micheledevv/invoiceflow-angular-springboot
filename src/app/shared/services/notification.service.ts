import { Injectable, signal } from '@angular/core';
import { AlertBannerType } from '../components/alert-banner/alert-banner.component';

export type Notification = {
  id: number;
  type: AlertBannerType;
  title: string;
  message: string;
  duration: number;
};

type NotificationConfig = {
  title: string;
  message: string;
  duration?: number;
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSignal = signal<Notification[]>([]);
  private nextId = 1;

  readonly notifications = this.notificationsSignal.asReadonly();

  success(title: string, message: string, duration = 3500): void {
    this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(title: string, message: string, duration = 4500): void {
    this.show({
      type: 'error',
      title,
      message,
      duration
    });
  }

  warning(title: string, message: string, duration = 4000): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  info(title: string, message: string, duration = 3500): void {
    this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  dismiss(id: number): void {
    this.notificationsSignal.update((notifications) => {
      return notifications.filter((notification) => notification.id !== id);
    });
  }

  private show(config: NotificationConfig & { type: AlertBannerType }): void {
    const notification: Notification = {
      id: this.nextId++,
      type: config.type,
      title: config.title,
      message: config.message,
      duration: config.duration ?? 3500
    };

    this.notificationsSignal.update((notifications) => [
      notification,
      ...notifications
    ]);

    window.setTimeout(() => {
      this.dismiss(notification.id);
    }, notification.duration);
  }
}
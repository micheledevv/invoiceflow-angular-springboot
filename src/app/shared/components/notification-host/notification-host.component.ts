import { Component, inject } from '@angular/core';

import { AlertBannerComponent } from '../alert-banner/alert-banner.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-host',
  imports: [AlertBannerComponent],
  templateUrl: './notification-host.component.html',
  styleUrl: './notification-host.component.scss'
})
export class NotificationHostComponent {
  private readonly notificationService = inject(NotificationService);

  protected readonly notifications = this.notificationService.notifications;

  protected dismissNotification(id: number): void {
    this.notificationService.dismiss(id);
  }
}
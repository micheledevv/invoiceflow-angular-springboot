import { Component, input, output } from '@angular/core';

export type AlertBannerType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert-banner',
  imports: [],
  templateUrl: './alert-banner.component.html',
  styleUrl: './alert-banner.component.scss'
})
export class AlertBannerComponent {
  type = input<AlertBannerType>('info');
  closable = input<boolean>(true);

  closed = output<void>();

  protected close(): void {
    this.closed.emit();
  }
}
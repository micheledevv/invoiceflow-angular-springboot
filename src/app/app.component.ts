import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { InvoiceFormComponent } from './features/invoices/components/invoice-form/invoice-form.component';
import { GenericModalComponent } from './shared/components/generic-modal/generic-modal.component';
import { InvoiceFormService } from './features/invoices/components/invoice-form/invoice-form.service';
import { ThemeService } from './core/layout/theme/theme.service';
import { NotificationHostComponent } from './shared/components/notification-host/notification-host.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LoaderComponent, InvoiceFormComponent, GenericModalComponent,NotificationHostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  invoiceFormService = inject(InvoiceFormService);
  themeService = inject(ThemeService);

  isFormOpen = this.invoiceFormService.isFormOpen;
  isDarkMode = this.themeService.isDarkMode;

  
  private readonly router = inject(Router);

  protected readonly isAuthPage = signal(false);

  constructor() {
    this.updateAuthPage(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateAuthPage(event.urlAfterRedirects);
      });
  }

  private updateAuthPage(url: string): void {
    this.isAuthPage.set(
      url.startsWith('/login') || url.startsWith('/register')
    );
  }
}
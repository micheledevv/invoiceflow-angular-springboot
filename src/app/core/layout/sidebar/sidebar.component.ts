import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { filter } from 'rxjs';

import { ThemeService } from '../theme/theme.service';
import { AuthService } from '../../auth/auth.service';
import { SettingsPanelComponent } from '../../settings/settings-panel/settings-panel.component';

@Component({
  selector: 'app-sidebar',
  imports: [SettingsPanelComponent, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  protected readonly themeService = inject(ThemeService);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly currentUser = this.authService.currentUser;
  protected readonly settingsPanelIsOpen = signal(false);
  protected readonly mobileMenuIsOpen = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.closeMobileMenu();
      });
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected openSettingsPanel(): void {
    this.closeMobileMenu();
    this.settingsPanelIsOpen.set(true);
  }

  protected closeSettingsPanel(): void {
    this.settingsPanelIsOpen.set(false);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuIsOpen.update((isOpen) => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuIsOpen.set(false);
  }

  protected logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}

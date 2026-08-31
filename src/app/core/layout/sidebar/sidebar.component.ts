import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

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

  protected readonly currentUser = this.authService.currentUser;
  protected readonly settingsPanelIsOpen = signal(false);

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected openSettingsPanel(): void {
    this.settingsPanelIsOpen.set(true);
  }

  protected closeSettingsPanel(): void {
    this.settingsPanelIsOpen.set(false);
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}

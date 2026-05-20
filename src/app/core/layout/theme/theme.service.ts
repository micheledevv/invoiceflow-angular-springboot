import { Injectable, computed, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<ThemeMode>('light');

  isDarkMode = computed(() => this.theme() === 'dark');

  constructor() {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;

    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.theme.set(savedTheme);
    }

    effect(() => {
      localStorage.setItem('theme', this.theme());
    });
  }

  toggleTheme(): void {
    this.theme.update(currentTheme => currentTheme === 'light' ? 'dark' : 'light');
  }

  setLightTheme(): void {
    this.theme.set('light');
  }

  setDarkTheme(): void {
    this.theme.set('dark');
  }
}
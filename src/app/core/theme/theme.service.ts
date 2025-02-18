import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  isDarkTheme$: Observable<boolean> = this.isDarkThemeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkThemeSubject.next(savedTheme === 'dark');
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkThemeSubject.value;
    this.isDarkThemeSubject.next(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  getThemeColors() {
    const isDark = this.isDarkThemeSubject.value;
    return {
      background: isDark ? '#1F2937' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#111827',
      chartText: '#111827',
      subtext: isDark ? '#9CA3AF' : '#6B7280',
      border: isDark ? '#374151' : '#E5E7EB',
      accent: isDark ? '#60A5FA' : '#3B82F6',
      success: isDark ? '#34D399' : '#10B981',
      progressBackground: isDark ? '#374151' : '#E5E7EB',
      userListText: '#111827'
    };
  }

  private applyTheme(): void {
    if (this.isDarkThemeSubject.value) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
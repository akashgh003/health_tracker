import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isStatsView = false;
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isDarkTheme$.subscribe(
      (isDark: boolean) => this.isDarkTheme = isDark
    );
  }

  onShowHome(): void {
    this.isStatsView = false;
  }

  onToggleStats(): void {
    this.isStatsView = !this.isStatsView;
  }
}
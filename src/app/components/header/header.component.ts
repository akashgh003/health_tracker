import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ThemeService } from '../../core/theme/theme.service';
import { dropdownAnimation } from '../../shared/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [dropdownAnimation]
})
export class HeaderComponent implements OnInit {
  @Output() showHome = new EventEmitter<void>();
  @Output() toggleStats = new EventEmitter<void>();

  showMenu = false;
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isDarkTheme$.subscribe(
      (isDark: boolean) => this.isDarkTheme = isDark
    );
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  onShowHome(): void {
    this.showMenu = false;
    this.showHome.emit();
  }

  onToggleStats(): void {
    this.showMenu = false;
    this.toggleStats.emit();
  }
}
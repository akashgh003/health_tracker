import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';
import { ThemeService } from '../../core/theme/theme.service';
import { BehaviorSubject } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      isDarkTheme$: new BehaviorSubject(false)
    });

    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [ BrowserAnimationsModule ],
      providers: [
        { provide: ThemeService, useValue: spy }
      ]
    }).compileComponents();

    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.showMenu).toBeFalse();
    expect(component.isDarkTheme).toBeFalse();
  });

  it('should update theme when themeService emits', () => {
    expect(component.isDarkTheme).toBeFalse();
    (themeService.isDarkTheme$ as BehaviorSubject<boolean>).next(true);
    expect(component.isDarkTheme).toBeTrue();
  });

  describe('Menu Control', () => {
    it('should toggle menu', () => {
      expect(component.showMenu).toBeFalse();
      component.toggleMenu();
      expect(component.showMenu).toBeTrue();
      component.toggleMenu();
      expect(component.showMenu).toBeFalse();
    });

    it('should close menu and emit showHome', () => {
      spyOn(component.showHome, 'emit');
      component.showMenu = true;
      component.onShowHome();
      expect(component.showMenu).toBeFalse();
      expect(component.showHome.emit).toHaveBeenCalled();
    });

    it('should close menu and emit toggleStats', () => {
      spyOn(component.toggleStats, 'emit');
      component.showMenu = true;
      component.onToggleStats();
      expect(component.showMenu).toBeFalse();
      expect(component.toggleStats.emit).toHaveBeenCalled();
    });
  });

  describe('Theme Control', () => {
    it('should call themeService.toggleTheme when toggling theme', () => {
      component.toggleTheme();
      expect(themeService.toggleTheme).toHaveBeenCalled();
    });
  });

  describe('Template Tests', () => {
    it('should render title', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain('FITNESS TRACKER');
    });

    it('should render social links', () => {
      const compiled = fixture.nativeElement;
      const links = compiled.querySelectorAll('a');
      expect(links.length).toBe(2);
      expect(links[0].href).toContain('linkedin.com');
      expect(links[1].href).toContain('github.com');
    });

    it('should render theme toggle button', () => {
      const compiled = fixture.nativeElement;
      const themeButton = compiled.querySelector('button');
      expect(themeButton).toBeTruthy();
    });

    it('should show/hide menu when toggle button is clicked', () => {
      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('button');
      const menuButton = buttons[1]; // Get the second button
      
      // Initial state
      expect(component.showMenu).toBeFalse();
      
      // Click to show menu
      menuButton.click();
      fixture.detectChanges();
      expect(component.showMenu).toBeTrue();
      
      // Click to hide menu
      menuButton.click();
      fixture.detectChanges();
      expect(component.showMenu).toBeFalse();
    });
  });
});
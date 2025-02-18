import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let store: { [key: string]: string } = {};

  beforeEach(() => {
    store = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => store[key] = value);
    
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it('should load theme from localStorage on initialization', (done) => {
    store['theme'] = 'dark';
    service = TestBed.inject(ThemeService);
    
    service.isDarkTheme$.subscribe(isDark => {
      expect(isDark).toBeTrue();
      done();
    });
  });

  it('should toggle theme', (done) => {
    service = TestBed.inject(ThemeService);
    service.toggleTheme();
    
    service.isDarkTheme$.subscribe(isDark => {
      expect(isDark).toBeTrue();
      expect(store['theme']).toBe('dark');
      done();
    });
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { StatsViewComponent } from './components/stats-view/stats-view.component';
import { ThemeService } from './core/theme/theme.service';
import { WorkoutService } from './services/workout.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let workoutService: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      isDarkTheme$: new BehaviorSubject(false)
    });
    
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', [
      'getFilteredUsers',
      'getWorkoutTypes',
      'getTotalMinutes',
      'getProgressPercentage',
      'processWorkoutData'
    ], {
      users$: new BehaviorSubject([])
    });

    workoutServiceSpy.getFilteredUsers.and.returnValue([]);
    workoutServiceSpy.getWorkoutTypes.and.returnValue('');
    workoutServiceSpy.getTotalMinutes.and.returnValue(0);
    workoutServiceSpy.getProgressPercentage.and.returnValue(0);
    workoutServiceSpy.processWorkoutData.and.returnValue({ labels: [], data: [] });

    await TestBed.configureTestingModule({
      declarations: [ 
        AppComponent,
        HeaderComponent,
        WorkoutFormComponent,
        WorkoutListComponent,
        StatsViewComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: WorkoutService, useValue: workoutServiceSpy }
      ]
    }).compileComponents();

    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isStatsView as false', () => {
    expect(component.isStatsView).toBeFalse();
  });

  it('should update isDarkTheme when theme service emits', () => {
    (themeService.isDarkTheme$ as BehaviorSubject<boolean>).next(true);
    expect(component.isDarkTheme).toBeTrue();
  });

  it('should show home view when onShowHome is called', () => {
    component.isStatsView = true;
    component.onShowHome();
    expect(component.isStatsView).toBeFalse();
  });

  it('should toggle stats view when onToggleStats is called', () => {
    expect(component.isStatsView).toBeFalse();
    component.onToggleStats();
    expect(component.isStatsView).toBeTrue();
    component.onToggleStats();
    expect(component.isStatsView).toBeFalse();
  });

  it('should render header component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });

  it('should show workout form and list when not in stats view', () => {
    component.isStatsView = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-workout-form')).toBeTruthy();
    expect(compiled.querySelector('app-workout-list')).toBeTruthy();
  });

  it('should show stats view when isStatsView is true', () => {
    component.isStatsView = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-stats-view')).toBeTruthy();
  });
});
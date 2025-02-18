import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatsViewComponent } from './stats-view.component';
import { WorkoutService } from '../../services/workout.service';
import { ThemeService } from '../../core/theme/theme.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/workout.models';

describe('StatsViewComponent', () => {
  let component: StatsViewComponent;
  let fixture: ComponentFixture<StatsViewComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;
  let themeService: jasmine.SpyObj<ThemeService>;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    workouts: [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 45 }
    ]
  };

  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', [
      'getWorkoutTypes',
      'getTotalMinutes',
      'getProgressPercentage',
      'processWorkoutData'
    ], {
      users$: new BehaviorSubject([mockUser])
    });

    const themeServiceSpy = jasmine.createSpyObj('ThemeService', [], {
      isDarkTheme$: new BehaviorSubject(false)
    });

    workoutServiceSpy.getWorkoutTypes.and.returnValue('Running, Cycling');
    workoutServiceSpy.getTotalMinutes.and.returnValue(75);
    workoutServiceSpy.getProgressPercentage.and.returnValue(15);
    workoutServiceSpy.processWorkoutData.and.returnValue({
      labels: ['Running', 'Cycling'],
      data: [30, 45]  // Changed from minutes to data to match the interface
    });

    await TestBed.configureTestingModule({
      declarations: [ StatsViewComponent ],
      imports: [ BrowserAnimationsModule ],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();

    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.showCircularStats).toBeFalse();
      expect(component.showTooltip).toBeFalse();
      expect(component.isDarkTheme).toBeFalse();
    });

    it('should show tooltip after delay', fakeAsync(() => {
      component.ngOnInit();
      expect(component.showTooltip).toBeFalse();
      tick(500);
      expect(component.showTooltip).toBeTrue();
    }));

    it('should load initial users', () => {
      expect(component.users).toEqual([mockUser]);
    });
  });

  describe('User Selection', () => {
    it('should select first user on init if available', () => {
      expect(component.selectedUser).toEqual(mockUser);
    });

    it('should update selected user', () => {
      const newUser: User = { ...mockUser, id: 2, name: 'New User' };
      component.selectUser(newUser);
      expect(component.selectedUser).toEqual(newUser);
    });
  });

  describe('Chart Management', () => {
    it('should create chart when selecting user', fakeAsync(() => {
      spyOn<any>(component, 'createChart');
      component.selectUser(mockUser);
      tick();
      expect(component['createChart']).toHaveBeenCalled();
    }));

    it('should destroy chart on component destroy', () => {
      const mockChart = { destroy: jasmine.createSpy('destroy') };
      component.chart = mockChart as any;
      component.ngOnDestroy();
      expect(mockChart.destroy).toHaveBeenCalled();
    });
  });

  describe('Stats Calculations', () => {
    it('should check for workouts', () => {
      expect(component.hasWorkouts()).toBeTrue();
      component.selectedUser = null;
      expect(component.hasWorkouts()).toBeFalse();
    });

    it('should get workout types', () => {
      const types = component.getWorkoutTypes(mockUser);
      expect(workoutService.getWorkoutTypes).toHaveBeenCalledWith(mockUser);
      expect(types).toBe('Running, Cycling');
    });

    it('should get total minutes', () => {
      const minutes = component.getTotalMinutes(mockUser);
      expect(workoutService.getTotalMinutes).toHaveBeenCalledWith(mockUser);
      expect(minutes).toBe(75);
    });

    it('should get progress percentage', () => {
      component.selectedUser = mockUser;
      const progress = component.getProgressPercentage();
      expect(workoutService.getProgressPercentage).toHaveBeenCalledWith(mockUser);
      expect(progress).toBe(15);
    });

    it('should return 0 progress for no selected user', () => {
      component.selectedUser = null;
      expect(component.getProgressPercentage()).toBe(0);
    });
  });

  describe('View Toggle', () => {
    it('should toggle between circular and chart view', fakeAsync(() => {
      spyOn<any>(component, 'createChart');
      expect(component.showCircularStats).toBeFalse();
      
      component.toggleStatsView();
      expect(component.showCircularStats).toBeTrue();
      
      component.toggleStatsView();
      expect(component.showCircularStats).toBeFalse();
      tick();
      expect(component['createChart']).toHaveBeenCalled();
    }));
  });

  describe('Tooltip Management', () => {
    it('should hide tooltip', () => {
      component.showTooltip = true;
      component.hideTooltip();
      expect(component.showTooltip).toBeFalse();
    });
  });
});
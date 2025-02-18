import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkoutListComponent } from './workout-list.component';
import { WorkoutService } from '../../services/workout.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/workout.models';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John',
      workouts: [{ type: 'Running', minutes: 30 }]
    },
    {
      id: 2,
      name: 'Jane',
      workouts: [{ type: 'Cycling', minutes: 45 }]
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WorkoutService', [
      'getFilteredUsers',
      'getWorkoutTypes',
      'getTotalMinutes',
      'deleteUser'
    ]);
    spy.users$ = new BehaviorSubject(mockUsers);
    spy.getFilteredUsers.and.returnValue(mockUsers);
    spy.getWorkoutTypes.and.returnValue('Running');
    spy.getTotalMinutes.and.returnValue(30);

    await TestBed.configureTestingModule({
      declarations: [ WorkoutListComponent ],
      imports: [ 
        FormsModule,
        BrowserAnimationsModule 
      ],
      providers: [
        { provide: WorkoutService, useValue: spy }
      ]
    })
    .compileComponents();

    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.searchTerm).toBe('');
    expect(component.filterType).toBe('');
    expect(component.page).toBe(1);
    expect(component.pageSize).toBe(5);
  });

  it('should load users on init', () => {
    expect(component.users).toEqual(mockUsers);
  });

  describe('filteredUsers', () => {
    it('should call workoutService.getFilteredUsers with current filters', () => {
      component.searchTerm = 'John';
      component.filterType = 'Running';
      
      const result = component.filteredUsers;
      
      expect(workoutService.getFilteredUsers).toHaveBeenCalledWith('John', 'Running');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getWorkoutTypes', () => {
    it('should call workoutService.getWorkoutTypes with user', () => {
      const user = mockUsers[0];
      component.getWorkoutTypes(user);
      expect(workoutService.getWorkoutTypes).toHaveBeenCalledWith(user);
    });
  });

  describe('getTotalMinutes', () => {
    it('should call workoutService.getTotalMinutes with user', () => {
      const user = mockUsers[0];
      component.getTotalMinutes(user);
      expect(workoutService.getTotalMinutes).toHaveBeenCalledWith(user);
    });
  });

  describe('deleteUser', () => {
    it('should call workoutService.deleteUser when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.deleteUser(1);
      
      expect(workoutService.deleteUser).toHaveBeenCalledWith(1);
    });

    it('should not call workoutService.deleteUser when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.deleteUser(1);
      
      expect(workoutService.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('pagination', () => {
    it('should decrease page when previousPage is called and page > 1', () => {
      component.page = 2;
      component.previousPage();
      expect(component.page).toBe(1);
    });

    it('should not decrease page when previousPage is called and page is 1', () => {
      component.page = 1;
      component.previousPage();
      expect(component.page).toBe(1);
    });

    it('should increase page when nextPage is called and not on last page', () => {
      component.page = 1;
      component.pageSize = 1;
      component.nextPage();
      expect(component.page).toBe(2);
    });

    it('should not increase page when nextPage is called on last page', () => {
      component.page = 2;
      component.pageSize = 1;
      component.filteredUsers.length = 2;
      component.nextPage();
      expect(component.page).toBe(2);
    });
  });
});
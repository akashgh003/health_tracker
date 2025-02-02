import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { Chart } from 'chart.js/auto';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    localStorage.clear(); 
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Workout Management', () => {
    it('should not add workout with missing fields', () => {
      spyOn(window, 'alert');
      const initialUsersLength = component.users.length;

      component.userName = ''; 
      component.workoutType = 'Running';
      component.workoutMinutes = 30;
      component.addWorkout();

      expect(window.alert).toHaveBeenCalledWith('Please fill all required fields');
      expect(component.users.length).toBe(initialUsersLength);
    });

    it('should delete user', () => {
      component.userName = 'John';
      component.workoutType = 'Running';
      component.workoutMinutes = 30;
      component.addWorkout();

      const userId = component.users[0].id;
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteUser(userId);
      expect(component.users.length).toBe(0);
    });
  });

  describe('Stats View', () => {
    beforeEach(() => {
      component.users = [
        {
          id: 1,
          name: 'Test User',
          workouts: [
            { type: 'Running', minutes: 30 },
            { type: 'Cycling', minutes: 45 },
          ],
        },
      ];
    });

    it('should toggle stats view', () => {
      component.toggleStats();
      expect(component.isStatsView).toBeTrue();
      expect(component.showMenu).toBeFalse();
    });

    it('should calculate total minutes correctly', () => {
      const total = component.getTotalMinutes(component.users[0]);
      expect(total).toBe(75); // 30 + 45
    });

    it('should get workout types correctly', () => {
      const types = component.getWorkoutTypes(component.users[0]);
      expect(types).toBe('Running, Cycling');
    });

    it('should calculate progress percentage', () => {
      component.selectedUser = component.users[0];
      const percentage = component.getProgressPercentage();
      expect(percentage).toBe(15); 
    });
  });

  describe('Filter and Search', () => {
    beforeEach(() => {
      component.users = [
        { id: 1, name: 'John', workouts: [{ type: 'Running', minutes: 30 }] },
        { id: 2, name: 'Jane', workouts: [{ type: 'Cycling', minutes: 45 }] },
      ];
    });

    it('should filter users by name', () => {
      component.searchTerm = 'John';
      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].name).toBe('John');
    });

    it('should filter users by workout type', () => {
      component.filterType = 'Running';
      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].workouts[0].type).toBe('Running');
    });
  });

  describe('Chart Management', () => {
    it('should create chart when switching to stats view', fakeAsync(() => {
      component.users = [
        {
          id: 1,
          name: 'Test User',
          workouts: [
            { type: 'Running', minutes: 30 },
            { type: 'Cycling', minutes: 45 },
          ],
        },
      ];

      component.toggleStats();
      tick(500);

      const chartData = component.processWorkoutData(component.users[0]);
      expect(chartData.labels).toContain('Running');
      expect(chartData.labels).toContain('Cycling');
      expect(chartData.minutes).toContain(30);
      expect(chartData.minutes).toContain(45);
    }));
  });

  describe('LocalStorage Management', () => {
    const testData = [
      { id: 1, name: 'Test User', workouts: [{ type: 'Running', minutes: 30 }] },
    ];

    beforeEach(() => {
      localStorage.clear(); 
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should save data to localStorage', () => {
      spyOn(localStorage, 'setItem');
      component.users = testData;
      component['saveToLocalStorage']();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'workoutData',
        JSON.stringify(testData)
      );
    });

    it('should load data from localStorage', () => {
      localStorage.setItem('workoutData', JSON.stringify(testData));
  
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  
      expect(component.users.length).toBe(1);
      expect(component.users[0]).toEqual(testData[0]);
    });

    it('should correctly parse localStorage data using spyOn', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'workoutData') {
          return JSON.stringify(testData);
        }
        return null;
      });
  
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  
      expect(component.users.length).toBe(1);
      expect(component.users[0].name).toBe('Test User');
    });

    it('should handle empty localStorage gracefully', () => {
      localStorage.removeItem('workoutData'); 
      component.ngOnInit();
      expect(component.users).toEqual([]); 
    });
  });
});
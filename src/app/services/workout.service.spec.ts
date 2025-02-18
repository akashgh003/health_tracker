import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { User, Workout } from '../models/workout.models';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let store: { [key: string]: string } = {};

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    workouts: [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 45 }
    ]
  };

  beforeEach(() => {
    store = {};
    spyOn(localStorage, 'getItem').and.callFake(key => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = value);
    spyOn(localStorage, 'clear').and.callFake(() => store = {});

    TestBed.configureTestingModule({
      providers: [WorkoutService]
    });
  });

  describe('Data Management', () => {
    it('should load data from localStorage on initialization', (done) => {
      const savedData = [mockUser];
      store['workoutData'] = JSON.stringify(savedData);
      
      service = TestBed.inject(WorkoutService);
      service.users$.subscribe(users => {
        expect(users).toEqual(savedData);
        done();
      });
    });

    it('should save data to localStorage when adding workout', () => {
      service = TestBed.inject(WorkoutService);
      service.addWorkout('Test User', 'Running', 30);
      expect(localStorage.setItem).toHaveBeenCalled();
      expect(JSON.parse(store['workoutData'])).toBeTruthy();
    });
  });

  describe('addWorkout', () => {
    beforeEach(() => {
      service = TestBed.inject(WorkoutService);
    });

    it('should validate required fields', () => {
      const result = service.addWorkout('', '', 0);
      expect(result.success).toBeFalse();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should add new user with workout', (done) => {
      const result = service.addWorkout('New User', 'Running', 30);
      expect(result.success).toBeTrue();
      
      service.users$.subscribe(users => {
        const user = users.find(u => u.name === 'New User');
        expect(user).toBeTruthy();
        expect(user?.workouts.length).toBe(1);
        done();
      });
    });

    it('should add workout to existing user', (done) => {
      service.addWorkout('Test User', 'Running', 30);
      const result = service.addWorkout('Test User', 'Cycling', 45);
      
      expect(result.success).toBeTrue();
      service.users$.subscribe(users => {
        const user = users.find(u => u.name === 'Test User');
        expect(user?.workouts.length).toBe(2);
        done();
      });
    });
  });
});
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/workout.models';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private users = new BehaviorSubject<User[]>([]);
  users$ = this.users.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const savedData = localStorage.getItem('workoutData');
    if (savedData) {
      this.users.next(JSON.parse(savedData));
    }
  }

  getFilteredUsers(searchTerm?: string, filterType?: string): User[] {
    let filteredUsers = this.users.getValue();
    
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.workouts.some(w => w.type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterType) {
      filteredUsers = filteredUsers.filter(user =>
        user.workouts.some(w => w.type.toLowerCase() === filterType.toLowerCase())
      );
    }
    
    return filteredUsers;
  }

  getWorkoutTypes(user: User): string {
    return user.workouts.map(w => w.type).join(', ');
  }

  getTotalMinutes(user: User): number {
    return user.workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  deleteUser(userId: number): void {
    const currentUsers = this.users.getValue();
    const updatedUsers = currentUsers.filter(user => user.id !== userId);
    this.users.next(updatedUsers);
    localStorage.setItem('workoutData', JSON.stringify(updatedUsers));
  }

  addWorkout(userName: string, workoutType: string, minutes: number) {
    if (!userName || !workoutType || minutes <= 0) {
      return {
        success: false,
        errors: ['All fields are required and minutes must be greater than 0']
      };
    }

    const currentUsers = this.users.getValue();
    let user = currentUsers.find(u => u.name === userName);
    
    if (user) {
      user.workouts.push({ type: workoutType, minutes });
    } else {
      user = {
        id: currentUsers.length + 1,
        name: userName,
        workouts: [{ type: workoutType, minutes }]
      };
      currentUsers.push(user);
    }

    this.users.next([...currentUsers]);
    localStorage.setItem('workoutData', JSON.stringify(currentUsers));
    return { success: true };
  }

  // Added missing methods for stats-view component
  getProgressPercentage(user: User): number {
    if (!user || !user.workouts.length) return 0;
    const totalMinutes = this.getTotalMinutes(user);
    const weeklyGoal = 150; // Example weekly goal in minutes
    return Math.min(Math.round((totalMinutes / weeklyGoal) * 100), 100);
  }

  processWorkoutData(user: User) {
    if (!user) return { labels: [], data: [] };

    const workoutsByType = user.workouts.reduce((acc, workout) => {
      if (!acc[workout.type]) {
        acc[workout.type] = 0;
      }
      acc[workout.type] += workout.minutes;
      return acc;
    }, {} as { [key: string]: number });

    return {
      labels: Object.keys(workoutsByType),
      data: Object.values(workoutsByType)
    };
  }
}
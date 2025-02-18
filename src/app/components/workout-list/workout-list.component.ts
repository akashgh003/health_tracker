import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { User } from '../../models/workout.models';
import { listAnimation } from '../../shared/animations';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss'],
  animations: [listAnimation]
})
export class WorkoutListComponent implements OnInit {
  searchTerm: string = '';
  filterType: string = '';
  page: number = 1;
  pageSize: number = 5;
  users: User[] = [];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.users$.subscribe(users => {
      this.users = users;
    });
  }

  get filteredUsers(): User[] {
    return this.workoutService.getFilteredUsers(this.searchTerm, this.filterType);
  }

  getWorkoutTypes(user: User): string {
    return this.workoutService.getWorkoutTypes(user);
  }

  getTotalMinutes(user: User): number {
    return this.workoutService.getTotalMinutes(user);
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.workoutService.deleteUser(userId);
    }
  }

  previousPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page * this.pageSize < this.filteredUsers.length) this.page++;
  }
}
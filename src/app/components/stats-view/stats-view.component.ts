import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { ThemeService } from '../../core/theme/theme.service';
import { User } from '../../models/workout.models';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-stats-view',
  templateUrl: './stats-view.component.html',
  styleUrls: ['./stats-view.component.scss']
})
export class StatsViewComponent implements OnInit, OnDestroy {
  @ViewChild('workoutChart') chartCanvas!: ElementRef;
  
  selectedUser: User | null = null;
  showCircularStats = false;
  showTooltip = false;
  chart: Chart | null = null;
  users: User[] = [];
  isDarkTheme = false;

  constructor(
    private workoutService: WorkoutService,
    private themeService: ThemeService
  ) {
    this.themeService.isDarkTheme$.subscribe((isDark: boolean) => {
      this.isDarkTheme = isDark;
      if (this.chart) {
        this.updateChartColors();
      }
    });
  }

  ngOnInit(): void {
    this.workoutService.users$.subscribe(users => {
      this.users = users;
      if (users.length > 0 && !this.selectedUser) {
        this.selectUser(users[0]);
      }
    });

    setTimeout(() => {
      this.showTooltip = true;
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  hasWorkouts(): boolean {
    return this.selectedUser !== null && 
           this.selectedUser.workouts && 
           this.selectedUser.workouts.length > 0;
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    if (!this.showCircularStats) {
      setTimeout(() => {
        this.createChart();
      });
    }
  }

  hideTooltip(): void {
    this.showTooltip = false;
  }

  toggleStatsView(): void {
    this.showCircularStats = !this.showCircularStats;
    if (!this.showCircularStats && this.selectedUser) {
      setTimeout(() => {
        this.createChart();
      });
    }
  }

  getWorkoutTypes(user: User): string {
    return this.workoutService.getWorkoutTypes(user);
  }

  getTotalMinutes(user: User): number {
    return this.workoutService.getTotalMinutes(user);
  }

  getProgressPercentage(): number {
    if (!this.selectedUser) return 0;
    return this.workoutService.getProgressPercentage(this.selectedUser);
  }

  private createChart(): void {
    if (!this.selectedUser || !this.chartCanvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.workoutService.processWorkoutData(this.selectedUser);
    const textColor = '#111827'; // Always black text
    const gridColor = 'rgba(0, 0, 0, 0.1)'; // Always black grid lines

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Minutes',
          data: data.data, // Changed from data.minutes to data.data
          backgroundColor: 'rgba(59, 130, 246, 0.8)', // Keep blue bars
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: { weight: 'bold' }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor,
              lineWidth: 1
            },
            ticks: {
              color: textColor,
              font: { weight: 'bold' }
            }
          },
          x: {
            grid: {
              color: gridColor,
              lineWidth: 1
            },
            ticks: {
              color: textColor,
              font: { weight: 'bold' }
            }
          }
        }
      }
    });
  }

  private updateChartColors(): void {
    if (!this.chart) return;

    const textColor = '#111827'; // Always black text
    const gridColor = 'rgba(0, 0, 0, 0.1)'; // Always black grid lines

    if (this.chart.data.datasets[0]) {
      this.chart.data.datasets[0].backgroundColor = 'rgba(59, 130, 246, 0.8)'; // Keep blue bars
    }

    if (this.chart.options.scales) {
      const scales = this.chart.options.scales as any;
      
      if (scales.y) {
        scales.y.grid.color = gridColor;
        scales.y.ticks.color = textColor;
      }
      
      if (scales.x) {
        scales.x.grid.color = gridColor;
        scales.x.ticks.color = textColor;
      }
    }

    if (this.chart.options.plugins?.legend?.labels) {
      this.chart.options.plugins.legend.labels.color = textColor;
    }

    this.chart.update();
  }
}
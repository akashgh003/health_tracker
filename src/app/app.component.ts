import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';
import { fadeInOut, listAnimation, slideInOut, dropdownAnimation, cardAnimation } from './animations';

interface Workout {
  type: string;
  minutes: number;
}

interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOut, listAnimation, slideInOut, dropdownAnimation, cardAnimation]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  isDarkTheme: boolean = false;
  
  showMenu: boolean = false;
  isStatsView: boolean = false;
  showCircularStats: boolean = false;

  userName: string = '';
  workoutType: string = '';
  workoutMinutes: number = 0;

  searchTerm: string = '';
  filterType: string = '';

  page: number = 1;
  pageSize: number = 5;

  users: User[] = [];
  selectedUser: User | null = null;

  @ViewChild('workoutChart') chartCanvas!: ElementRef;
  chart: Chart | null = null;

  private readonly targetMinutes: number = 500; // Weekly target minutes

  showTooltip: boolean = false;


  get filteredUsers(): User[] {
    return this.users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const typeMatch = !this.filterType || user.workouts.some(w => w.type === this.filterType);
      return nameMatch && typeMatch;
    });
  }

  processWorkoutData(user: User) {
    const workoutsByType = user.workouts.reduce((acc, workout) => {
      if (!acc[workout.type]) {
        acc[workout.type] = 0;
      }
      acc[workout.type] += workout.minutes;
      return acc;
    }, {} as Record<string, number>);

    const sortedEntries = Object.entries(workoutsByType)
      .sort(([, a], [, b]) => b - a);

    return {
      labels: sortedEntries.map(([type]) => type),
      minutes: sortedEntries.map(([, minutes]) => minutes)
    };
  }

  private saveToLocalStorage() {
    localStorage.setItem('workoutData', JSON.stringify(this.users));
  }


  get themeColors() {
    return {
      background: this.isDarkTheme ? '#1F2937' : '#FFFFFF',
      text: this.isDarkTheme ? '#FFFFFF' : '#111827',
      chartText: '#111827', 
      subtext: this.isDarkTheme ? '#9CA3AF' : '#6B7280',
      border: this.isDarkTheme ? '#374151' : '#E5E7EB',
      accent: this.isDarkTheme ? '#60A5FA' : '#3B82F6',
      success: this.isDarkTheme ? '#34D399' : '#10B981',
      progressBackground: this.isDarkTheme ? '#374151' : '#E5E7EB',
      userListText: '#111827' 
    };
  }

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme();
    }

    const savedData = localStorage.getItem('workoutData');
    if (savedData) {
      this.users = JSON.parse(savedData);
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.isStatsView && this.users.length > 0) {
      if (!this.selectedUser) {
        this.selectedUser = this.users[0];
      }
      setTimeout(() => {
        this.createChart();
      }, 0);
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getProgressPercentage(): number {
    if (!this.selectedUser) {
      return 0;
    }
    
    const totalMinutes = this.getTotalMinutes(this.selectedUser);
    const percentage = (totalMinutes / this.targetMinutes) * 100;
    
    return Math.min(Math.max(percentage, 0), 100);
  }

  getProgressStyle(): string {
    const percentage = this.getProgressPercentage();
    const colors = this.themeColors;
    return `conic-gradient(
      from 0deg,
      ${colors.success} ${percentage}%,
      ${colors.accent} ${percentage}%,
      ${colors.accent} 100%
    )`;
  }

  getCircleCenterStyle(): any {
    return {
      background: this.themeColors.background,
      color: this.themeColors.text
    };
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
    this.updateChartColors();
  }

  private applyTheme() {
    document.body.classList.toggle('dark-mode', this.isDarkTheme);
  }

  private updateChartColors() {
    if (this.chart && this.chart.options.scales) {
      const colors = this.themeColors;
      const gridColor = this.isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

      if (this.chart.data.datasets[0]) {
        this.chart.data.datasets[0].backgroundColor = this.isDarkTheme ? 
          'rgba(147, 197, 253, 0.8)' : 'rgba(59, 130, 246, 0.8)';
      }

      const scales = this.chart.options.scales as any;
      if (scales['y']) {
        if (scales['y'].grid) {
          scales['y'].grid.color = gridColor;
          scales['y'].grid.lineWidth = 1;
        }
        if (scales['y'].ticks) {
          scales['y'].ticks.color = colors.chartText;
          scales['y'].ticks.font = { weight: 'bold' };
        }
      }
      if (scales['x']) {
        if (scales['x'].grid) {
          scales['x'].grid.color = gridColor;
          scales['x'].grid.lineWidth = 1;
        }
        if (scales['x'].ticks) {
          scales['x'].ticks.color = colors.chartText;
          scales['x'].ticks.font = { weight: 'bold' };
        }
      }

      if (this.chart.options.plugins?.legend?.labels) {
        this.chart.options.plugins.legend.labels.color = colors.chartText;
        this.chart.options.plugins.legend.labels.font = { weight: 'bold' };
      }

      this.chart.update();
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  showHome() {
    this.showMenu = false;
    this.isStatsView = false;
  }

toggleStats() {
  this.showMenu = false;
  this.isStatsView = true;
  
  setTimeout(() => {
    this.showTooltip = true;
  }, 500);

  if (this.users.length > 0) {
    this.selectedUser = this.selectedUser || this.users[0];
    setTimeout(() => {
      this.createChart();
    }, 0);
  }
}

hideTooltip() {
  this.showTooltip = false;
}

  addWorkout() {
    if (!this.userName || !this.workoutType || !this.workoutMinutes) {
      alert('Please fill all required fields');
      return;
    }

    let user = this.users.find(u => u.name.toLowerCase() === this.userName.toLowerCase());
    
    if (!user) {
      user = {
        id: this.users.length + 1,
        name: this.userName,
        workouts: []
      };
      this.users.push(user);
    }

    user.workouts.push({
      type: this.workoutType,
      minutes: this.workoutMinutes
    });

    this.saveToLocalStorage();
    this.resetForm();
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(user => user.id !== userId);
      if (this.selectedUser?.id === userId) {
        this.selectedUser = null;
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }
      }
      this.saveToLocalStorage();
    }
  }

  resetForm() {
    this.userName = '';
    this.workoutType = '';
    this.workoutMinutes = 0;
  }

  getWorkoutTypes(user: User): string {
    return [...new Set(user.workouts.map(w => w.type))].join(', ');
  }

  getTotalMinutes(user: User): number {
    return user.workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  previousPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page * this.pageSize < this.filteredUsers.length) this.page++;
  }

  onStatsViewChange() {
    this.showCircularStats = !this.showCircularStats;
    if (!this.showCircularStats && this.selectedUser) {
      setTimeout(() => {
        this.createChart();
      }, 0);
    }
  }

  selectUser(user: User) {
    this.selectedUser = user;
    if (!this.showCircularStats) {
      setTimeout(() => {
        this.createChart();
      }, 0);
    }
  }
  toggleStatsView() {
    this.showCircularStats = !this.showCircularStats;
    
    if (!this.showCircularStats && this.selectedUser) {
      setTimeout(() => {
        if (this.chartCanvas) {
          this.createChart();
        } else {
          console.error('Chart canvas not found');
        }
      });
    }
  }


  createChart() {
    console.log('Creating chart...');
    
    if (!this.chartCanvas?.nativeElement) {
      console.error('No canvas element found');
      return;
    }

    if (!this.selectedUser) {
      console.error('No user selected');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const workoutData = this.processWorkoutData(this.selectedUser);
    const textColor = this.themeColors.chartText;
    const gridColor = this.isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

    try {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: workoutData.labels,
          datasets: [{
            label: 'Minutes',
            data: workoutData.minutes,
            backgroundColor: this.isDarkTheme ? 'rgba(147, 197, 253, 0.8)' : 'rgba(59, 130, 246, 0.8)',
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 300 // Faster animation
          },
          scales: {
            ['y']: {
              beginAtZero: true,
              grid: {
                color: gridColor,
                lineWidth: 1
              },
              ticks: {
                color: textColor,
                font: {
                  weight: 'bold'
                }
              }
            },
            ['x']: {
              grid: {
                color: gridColor,
                lineWidth: 1
              },
              ticks: {
                color: textColor,
                font: {
                  weight: 'bold'
                }
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: textColor,
                font: {
                  weight: 'bold'
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }
}
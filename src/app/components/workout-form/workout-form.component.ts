import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
import { fadeInOut } from '../../shared/animations';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.scss'],
  animations: [fadeInOut]
})
export class WorkoutFormComponent implements OnInit {
  workoutForm!: FormGroup;
  formErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.workoutForm = this.fb.group({
      userName: ['', [
        Validators.required
      ]],
      workoutType: ['', [
        Validators.required,
        this.workoutTypeValidator()
      ]],
      workoutMinutes: ['', [
        Validators.required,
        this.positiveNumberValidator()
      ]]
    });

    // Clear errors when form values change
    this.workoutForm.valueChanges.subscribe(() => {
      this.formErrors = [];
    });
  }

  private workoutTypeValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const validTypes = ['Running', 'Cycling', 'Swimming', 'Yoga'];
      return validTypes.includes(control.value) ? null : { invalidWorkoutType: true };
    };
  }

  private positiveNumberValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return !value || value <= 0 ? { positiveNumber: true } : null;
    };
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      const { userName, workoutType, workoutMinutes } = this.workoutForm.value;
      const result = this.workoutService.addWorkout(userName, workoutType, workoutMinutes);
      
      if (result.success) {
        this.workoutForm.reset();
        this.formErrors = [];
      } else {
        this.formErrors = result.errors || ['Failed to add workout'];
      }
    } else {
      Object.keys(this.workoutForm.controls).forEach(key => {
        const control = this.workoutForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
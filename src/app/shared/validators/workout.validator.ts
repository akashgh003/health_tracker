import { AbstractControl, ValidationErrors } from '@angular/forms';

export class WorkoutValidators {
  static required(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value || (typeof value === 'string' && !value.trim())) {
      return { required: true };
    }
    return null;
  }

  static positiveNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (isNaN(value) || value <= 0) {
      return { positiveNumber: true };
    }
    return null;
  }

  static validWorkoutType(control: AbstractControl): ValidationErrors | null {
    const validTypes = ['Running', 'Cycling', 'Swimming', 'Yoga'];
    const value = control.value;
    if (!validTypes.includes(value)) {
      return { invalidWorkoutType: true };
    }
    return null;
  }
}
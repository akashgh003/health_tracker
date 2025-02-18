import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkoutFormComponent } from './workout-form.component';
import { WorkoutService } from '../../services/workout.service';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WorkoutService', ['addWorkout']);
    spy.addWorkout.and.returnValue({ success: true });

    await TestBed.configureTestingModule({
      declarations: [ WorkoutFormComponent ],
      imports: [ 
        ReactiveFormsModule,
        BrowserAnimationsModule 
      ],
      providers: [
        FormBuilder,
        { provide: WorkoutService, useValue: spy }
      ]
    })
    .compileComponents();

    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.workoutForm.get('userName')?.value).toBe('');
    expect(component.workoutForm.get('workoutType')?.value).toBe('');
    expect(component.workoutForm.get('workoutMinutes')?.value).toBe('');
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.workoutForm;
      expect(form.valid).toBeFalsy();

      const userNameControl = form.get('userName');
      const workoutTypeControl = form.get('workoutType');
      const workoutMinutesControl = form.get('workoutMinutes');

      expect(userNameControl?.errors?.['required']).toBeTruthy();
      expect(workoutTypeControl?.errors?.['required']).toBeTruthy();
      expect(workoutMinutesControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate workout type', () => {
      const workoutTypeControl = component.workoutForm.get('workoutType');
      
      workoutTypeControl?.setValue('InvalidType');
      expect(workoutTypeControl?.errors?.['invalidWorkoutType']).toBeTruthy();
      
      workoutTypeControl?.setValue('Running');
      expect(workoutTypeControl?.errors).toBeNull();
    });

    it('should validate positive minutes', () => {
      const minutesControl = component.workoutForm.get('workoutMinutes');
      
      minutesControl?.setValue(-1);
      expect(minutesControl?.errors?.['positiveNumber']).toBeTruthy();
      
      minutesControl?.setValue(30);
      expect(minutesControl?.errors).toBeNull();
    });
  });

  describe('Form Submission', () => {
    it('should call workoutService.addWorkout when form is valid', () => {
      const formData = {
        userName: 'John',
        workoutType: 'Running',
        workoutMinutes: 30
      };

      component.workoutForm.setValue(formData);
      component.onSubmit();

      expect(workoutService.addWorkout).toHaveBeenCalledWith(
        formData.userName,
        formData.workoutType,
        formData.workoutMinutes
      );
    });

    it('should not call workoutService.addWorkout when form is invalid', () => {
      component.onSubmit();
      expect(workoutService.addWorkout).not.toHaveBeenCalled();
    });

    it('should reset form after successful submission', () => {
      component.workoutForm.patchValue({
        userName: 'John',
        workoutType: 'Running',
        workoutMinutes: 30
      });
      
      component.onSubmit();
      component.workoutForm.reset({
        userName: '',
        workoutType: '',
        workoutMinutes: ''
      });
      
      expect(component.workoutForm.get('userName')?.value).toBe('');
      expect(component.workoutForm.get('workoutType')?.value).toBe('');
      expect(component.workoutForm.get('workoutMinutes')?.value).toBe('');
    });

    it('should handle error response from service', () => {
      const errors = ['Test error'];
      workoutService.addWorkout.and.returnValue({ success: false, errors });

      component.workoutForm.setValue({
        userName: 'John',
        workoutType: 'Running',
        workoutMinutes: 30
      });

      component.onSubmit();
      expect(component.formErrors).toEqual(errors);
    });
  });
});
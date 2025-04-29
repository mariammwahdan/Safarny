import { Component, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from '../../shared/modal/modal.component';
import {
  AbstractControl,
  FormsModule,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { signupValidators } from '../../shared/validators/register-validators';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
interface User {
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  password: string;
  confirmPassword?: string;
}
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  registerErrorMsg: string = '';
  submitted = false;

  show = false;
  @Output() close = new EventEmitter<void>();

  signupForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', signupValidators.firstname],
        lastName: ['', signupValidators.lastname],
        email: ['', signupValidators.email],
        password: ['', signupValidators.password],
        phone: ['', signupValidators.phone],
        gender: ['', signupValidators.gender],
        confirmPassword: ['', Validators.required],
        birthdate: ['', Validators.required],
      },
      { validators: this.confirmPassword }
    );
  }

  confirmPassword(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  open() {
    this.show = true;
  }

  onClose() {
    this.show = false;
    this.close.emit();
  }

  submitForm() {
    this.submitted = true;
    if (this.signupForm.valid) {
      const user: User = {
        firstname: this.signupForm.value.firstName,
        lastname: this.signupForm.value.lastName,
        gender: this.signupForm.value.gender || undefined,
        email: this.signupForm.value.email || undefined,
        phone: this.signupForm.value.phone || undefined,
        birthDate: this.signupForm.value.birthdate || undefined,
        password: this.signupForm.value.password || '',
        confirmPassword: this.signupForm.value.confirmPassword || undefined,
      };
      console.log('Signup Data:', user);
      this.onClose();
    } else {
      console.log('Signup Data:', 'FAILED');
    }
  }
}

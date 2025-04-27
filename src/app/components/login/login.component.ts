import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ModalComponent } from '../../shared/modal/modal.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  submitted = false;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
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
    if (this.loginForm.valid) {
      console.log('Login Data:', this.loginForm.value);
      this.onClose();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

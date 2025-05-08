import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ModalComponent } from '../../shared/modal/modal.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, CommonModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginError: string = '';
  submitted = false;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
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

  async submitForm() {
    this.submitted = true;
    this.loginError = '';
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        
        // Check for admin credentials
        if (email === 'admin@safarny.com' && password === 'admin') {
          this.onClose();
          this.router.navigate(['/dashboard']);
          return;
        }
        
        // Regular user login
        await this.authService.login(this.loginForm.value);
        console.log('Login successful!');
        this.onClose();
      } catch (err: any) {
        console.error('Login failed:', err);
        this.loginError = err.message || 'Login failed. Please try again.';
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

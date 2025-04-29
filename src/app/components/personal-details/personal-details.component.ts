import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../types/user';
@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css',
})
export class PersonalDetailsComponent implements OnInit {
  updateForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  constructor(public auth: AuthService) {}
  ngOnInit(): void {
    var user = this.auth.getUserData();
    this.updateForm = new FormGroup({
      email: new FormControl(user.email || '', Validators.email),
      phone: new FormControl(user.phone || ''),
      firstname: new FormControl(user.firstname || '', Validators.minLength(2)),
      lastname: new FormControl(user.lastname || '', Validators.minLength(2)),
      birthdate: new FormControl(user.birthDate || ''),
    });
    this.updateForm.markAsPristine();
  }
  updateData() {
    console.log(this.updateForm.value);
    if (this.updateForm.valid) {
      const user: User = {
        firstname: this.updateForm.value.firstname || '',
        lastname: this.updateForm.value.lastname || '',
        email: this.updateForm.value.email || undefined,
        phone: this.updateForm.value.phone || '',
        birthDate: this.updateForm.value.birthdate || '',
      };
      console.log('Update Data:', this.updateForm.value);
      this.successMessage = 'Profile updated successfully!';
      //Reset form dirty state so that button disables again
      this.updateForm.markAsPristine();
      setTimeout(() => {
        this.successMessage = '';
      }, 3000); // 3 seconds
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000); // 3 seconds
    }
  }
}

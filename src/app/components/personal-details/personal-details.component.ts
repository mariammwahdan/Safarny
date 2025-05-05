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
// import { User } from '../../types/user';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css',
})
export class PersonalDetailsComponent implements OnInit {
  updateForm = new FormGroup({
    email: new FormControl('', [Validators.email]),
    phone: new FormControl(''),
    firstname: new FormControl('', Validators.minLength(2)),
    lastname: new FormControl('', Validators.minLength(2)),
    birthdate: new FormControl('', Validators.required),
  });

  successMessage: string = '';
  errorMessage: string = '';
  constructor(private firebaseAuth: FirebaseAuthService, private auth: Auth) {}

  // async ngOnInit(): Promise<void> {
  //   const currentUser = this.auth.currentUser;
  //   if (currentUser) {
  //     const userData = await this.firebaseAuth.getUserData(currentUser.uid);
  //     const timestamp = userData?.birthDate;
  //     const date = timestamp?.toDate?.() ;

  //     this.updateForm.patchValue({
  //       email: userData.email || '',
  //       phone: userData.phone || '',
  //       firstname: userData.firstname || '',
  //       lastname: userData.lastname || '',
  //       birthdate: date ? date.toISOString().substring(0, 10) : ''
  //     });

  //     this.updateForm.markAsPristine();
  //   }
  // }
  async ngOnInit(): Promise<void> {
    // Try to load from localStorage first
    const userString = localStorage.getItem('user');
    let userData = userString ? JSON.parse(userString) : null;

    // Fallback: Load from Firestore if missing
    if (!userData && this.auth.currentUser) {
      userData = await this.firebaseAuth.getUserData(this.auth.currentUser.uid);
      localStorage.setItem('user', JSON.stringify(userData)); // Cache it again
    }

    if (userData) {
      const rawBirthdate = userData.birthDate;
      let date: Date | null = null;

      if (rawBirthdate?.seconds) {
        date = new Date(rawBirthdate.seconds * 1000);
      } else if (typeof rawBirthdate === 'string') {
        date = new Date(rawBirthdate);
      }
      this.updateForm.patchValue({
        email: userData.email || '',
        phone: userData.phone || '',
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        birthdate: date ? date.toISOString().substring(0, 10) : '',
      });

      this.updateForm.markAsPristine();
    }
  }

  async updateData() {
    if (this.updateForm.valid && this.auth.currentUser) {
      const uid = this.auth.currentUser.uid;
      const timestamp = this.updateForm.value.birthdate;
      const date = timestamp?.toString() ? new Date(timestamp) : null;

      const dataToUpdate = {
        firstname: this.updateForm.value.firstname,
        lastname: this.updateForm.value.lastname,
        phone: this.updateForm.value.phone,
        birthDate: date ? date.toISOString().substring(0, 10) : '',
        email: this.updateForm.value.email,
      };

      try {
        await this.firebaseAuth.updateUserData(uid, dataToUpdate);
        this.successMessage = 'Profile updated successfully!';
        this.updateForm.markAsPristine();
      } catch (error) {
        this.errorMessage = 'Error updating profile.';
      }

      setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 3000);
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}

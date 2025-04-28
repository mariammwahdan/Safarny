import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css'
})
export class PersonalDetailsComponent {
 // Form data
 email = 'mariamwahdan32@gmail.com';
 phone = '+20-10-66498636';
 firstName = 'Mariam';
 lastName = 'Wahdan';
 nationality = '';
 birthday = '';
 gender = '';

 // Control readonly fields
 emailReadonly = true;
 phoneReadonly = true;
 firstNameReadonly = true;
 lastNameReadonly = true;

 // Control Update button
 isChanged = false;

 constructor() {}

  // When clicking pencil icon, allow editing
  enableField(field: string) {
    switch (field) {
      case 'email':
        this.emailReadonly = false;
        break;
      case 'phone':
        this.phoneReadonly = false;
        break;
      case 'firstName':
        this.firstNameReadonly = false;
        break;
      case 'lastName':
        this.lastNameReadonly = false;
        break;
    }
    this.isChanged = true; // Enable Update button after any edit
  }

  // Optional: Update function (later you can connect it to API)
  updateProfile() {
    console.log('Profile updated with data:', {
      email: this.email,
      phone: this.phone,
      firstName: this.firstName,
      lastName: this.lastName,
      nationality: this.nationality,
      birthday: this.birthday,
      gender: this.gender,
    });
    this.isChanged = false; // After saving, disable button again
    // You can also show success message here if you want
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BookingHistoryComponent } from '../booking-history/booking-history.component';
import { CommonModule } from '@angular/common';
import { ProfilePaymentsComponent } from '../profile-payments/profile-payments.component';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { User } from '../../types/user';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [
    PersonalDetailsComponent,
    BookingHistoryComponent,
    MatSidenavModule,
    CommonModule,
    ProfilePaymentsComponent,
    RouterModule,
  ],
})
export class UserProfileComponent implements OnInit {
  username: string = 'John Doe'; // Default username
  constructor(public _Nav: AuthService, private router: Router, private auth: Auth, private firebaseAuth: FirebaseAuthService) {}
  selectedMenu = 'profile'; // default selected

  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }
  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  async ngOnInit(): Promise<void> {
    this._Nav.hide();
    const userString = localStorage.getItem('user');
    let userData = userString ? JSON.parse(userString) : null;
    if (userData) {
      console.log(userData);
      this.username = userData.firstname + ' ' + userData.lastname;
    } else {
      this.username = 'Guest'; // Fallback if no user is logged in
  }
}

  ngOnDestroy(): void {
    this._Nav.show();
  }
  logout() {
    this._Nav.logout();
    this.router.navigate(['/home']);
  }


  goHome() {
    this.router.navigate(['/home']);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PersonalDetailsComponent } from "../personal-details/personal-details.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import { BookingHistoryComponent } from '../booking-history/booking-history.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [PersonalDetailsComponent,BookingHistoryComponent, MatSidenavModule,CommonModule],
})
export class UserProfileComponent  implements OnInit {
  constructor(public _Nav: AuthService) {}
  selectedMenu = 'profile'; // default selected

  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }
  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
   ngOnInit(): void {
    this._Nav.hide();
   }
}

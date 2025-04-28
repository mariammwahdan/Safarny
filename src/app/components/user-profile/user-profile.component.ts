import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PersonalDetailsComponent } from "../personal-details/personal-details.component";
import {MatSidenavModule} from '@angular/material/sidenav';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [PersonalDetailsComponent, MatSidenavModule],
})
export class UserProfileComponent  implements OnInit {
  constructor(public _Nav: AuthService) {}
  selected = 'home';
  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
   ngOnInit(): void {
    this._Nav.hide();
   }
}

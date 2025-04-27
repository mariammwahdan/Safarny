import { Component, ViewChild, OnInit } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';
import { SignupComponent } from '../../components/signup/signup.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule,LoginComponent, SignupComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn = false;
  @ViewChild(SignupComponent) signupModal?: SignupComponent;
  @ViewChild(LoginComponent) loginModal?: LoginComponent;

  constructor(public authService: AuthService) {}
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
  isModalOpen = false;
  openSignup() {
    if (this.signupModal) {
      this.signupModal.open();
      this.isModalOpen = true;
    } else {
      console.warn('Signup Modal not found yet!');
    }
  }

  openLogin() {
    if (this.loginModal) {
      this.loginModal.open();
      this.isModalOpen = true;
    } else {
      console.warn('Login Modal not found yet!');
    }
  }

  onModalClose() {
    this.isModalOpen = false;
  }
  logout(): void {
    this.authService.logout();
}
}

import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';
import { SignupComponent } from '../../components/signup/signup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LoginComponent, SignupComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @ViewChild(SignupComponent) signupModal?: SignupComponent;
  @ViewChild(LoginComponent) loginModal?: LoginComponent;

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
}

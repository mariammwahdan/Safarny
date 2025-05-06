import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../types/user';
import { FirebaseAuthService } from './firebase-auth.service';

import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  visible: boolean;
  constructor(private firebaseAuth: FirebaseAuthService) {
    this.visible = true;
    const token = localStorage.getItem('token');
    this.isAuthenticated.next(!!token);
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }
  // login(credentials: { email: string; password: string }): void {
  //   localStorage.setItem('token', 'dummy-token');
  //   this.isAuthenticated.next(true);
  // }

  async login(credentials: { email: string; password: string }): Promise<void> {
    try {

      const userCred = await this.firebaseAuth.login(
        credentials.email,
        credentials.password
      );
      const token = await userCred.user.getIdToken();
      localStorage.setItem('token', token);
      const uid = userCred.user.uid;
      await this.firebaseAuth.getUserData(uid);
      this.isAuthenticated.next(true);
    } catch (err: unknown) {
      const error = err as FirebaseError;
      console.error('Firebase login error:', error);

      if (error.code === 'auth/invalid-login-credentials') {
        throw new Error('Invalid email or password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email format.');
      } else {
        throw new Error('An error occurred during login. Please try again.');
      }

    }
  }

  async logout(): Promise<void> {
    await this.firebaseAuth.logout();
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
  }

  // logout(): void {
  //   localStorage.removeItem('token');
  //   this.isAuthenticated.next(false);
  // }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
  // getUserData(): User {
  //   return {
  //     firstname: 'Mariam',
  //     lastname: 'Wahdan',
  //     phone: '01066498636',
  //     email: 'mariamwahdan32@gmail.com',
  //     birthDate: '6-8-2002',
  //     password: 'Mariam@123',
  //     confirmPassword: 'Aml@123',
  //   };
  // }
}

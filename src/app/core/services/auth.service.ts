import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  visible: boolean;
  constructor() {
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
  login(credentials: { email: string; password: string }): void {
    localStorage.setItem('token', 'dummy-token');
    this.isAuthenticated.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
  getUserData(): User {
    return {
      firstname: 'Mariam',
      lastname: 'Wahdan',
      phone: '01066498636',
      email: 'mariamwahdan32@gmail.com',
      birthDate: '6-8-2002',
      password: 'Mariam@123',
      confirmPassword: 'Aml@123',
    };
  }
}

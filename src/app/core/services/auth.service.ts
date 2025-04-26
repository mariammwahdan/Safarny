import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() {
    const token = localStorage.getItem('token');
    this.isAuthenticated.next(!!token);
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
}

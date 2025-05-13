import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private firebaseAuth: FirebaseAuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const role = localStorage.getItem('role');
    
    if (role === 'admin') {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
} 
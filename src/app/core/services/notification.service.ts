import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showUpdateSuccess() {
    this.snackBar.open('User updated successfully', '', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['update-snackbar']
    });
  }

  showDeleteSuccess() {
    this.snackBar.open('User deleted successfully', '', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['delete-snackbar']
    });
  }

  showRefundSuccess() {
    this.snackBar.open('Booking refunded successfully', '', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['update-snackbar']
    });
  }

  showSuccess(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['update-snackbar']
    });
  }

  showError(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
} 
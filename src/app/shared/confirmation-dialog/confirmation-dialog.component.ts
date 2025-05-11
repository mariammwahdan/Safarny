import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="confirmation-dialog">
      <h2 mat-dialog-title>Confirm Deletion</h2>
      <mat-dialog-content>
        <p>Are you sure you want to delete this user?</p>
        <p class="user-info">User: {{ data.userName }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <div class="cancel-btn" (click)="onCancel()">Cancel</div>
        <div class="delete-btn" (click)="onConfirm()">Delete</div>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      padding: 20px;
    }
    .user-info {
      color: #666;
      font-style: italic;
      margin-top: 10px;
    }
    mat-dialog-actions {
      margin-top: 20px;
    }
    .cancel-btn {
      border-radius: 8px;
      padding: 0 20px;
      height: 40px;
      font-weight: 500;
      background: none;
      border: none;
      color: #6b7280;
      transition: background-color 0.2s ease;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }
    .cancel-btn:hover {
      background-color: #f3f4f6;
    }
    .delete-btn {
      border-radius: 8px;
      padding: 0 20px;
      height: 40px;
      font-weight: 500;
      margin-left: 10px;
      background-color: #ef4444;
      color: white;
      transition: background-color 0.2s ease;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }
    .delete-btn:hover {
      background-color: #dc2626;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userName: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
} 
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../types/user';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div class="delete-icon" (click)="onDelete()">
          <mat-icon>delete</mat-icon>
        </div>
        <h2 class="text-xl font-semibold text-gray-800">Edit User</h2>
        <div style="width: 40px"></div>
      </div>
      
      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="input-group">
          <label class="text-sm font-semibold text-gray-600">First Name</label>
          <input type="text" [(ngModel)]="userData.firstname" name="firstname" placeholder="First Name" required class="p-3 rounded-full bg-blue-50 w-full" (ngModelChange)="checkChanges()">
        </div>

        <div class="input-group">
          <label class="text-sm font-semibold text-gray-600">Last Name</label>
          <input type="text" [(ngModel)]="userData.lastname" name="lastname" placeholder="Last Name" required class="p-3 rounded-full bg-blue-50 w-full" (ngModelChange)="checkChanges()">
        </div>

        <div class="input-group">
          <label class="text-sm font-semibold text-gray-600">Email</label>
          <input type="email" [(ngModel)]="userData.email" name="email" placeholder="Email" required class="p-3 rounded-full bg-blue-50 w-full" (ngModelChange)="checkChanges()">
        </div>

        <div class="input-group">
          <label class="text-sm font-semibold text-gray-600">Phone</label>
          <input type="text" [(ngModel)]="userData.phone" name="phone" placeholder="Phone" required class="p-3 rounded-full bg-blue-50 w-full" (ngModelChange)="checkChanges()">
        </div>

        <div class="flex justify-end space-x-2 mt-6">
          <button mat-button type="button" (click)="onClose()" class="cancel-btn">Cancel</button>
          <button mat-raised-button type="submit" class="save-btn" [disabled]="!hasChanges">Save Changes</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 500px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 14px;
      font-weight: 600;
      color: #4b5563;
      margin-bottom: 4px;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 9999px;
      font-size: 15px;
      color: #1f2937;
      background-color: #eff6ff;
      transition: all 0.2s ease;
    }

    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input:hover {
      border-color: #d1d5db;
    }

    .delete-icon {
      color: #6b7280;
      transition: color 0.2s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
    }

    .delete-icon:hover {
      color: #ef4444;
    }

    .delete-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .cancel-btn {
      border-radius: 8px;
      padding: 0 20px;
      height: 40px;
      font-weight: 500;
    }

    .save-btn {
      border-radius: 8px;
      padding: 0 20px;
      height: 40px;
      font-weight: 500;
      background-color: #3b82f6;
      color: white;
    }

    .save-btn:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .save-btn:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
  `]
})
export class EditUserDialogComponent implements OnInit {
  userData: User;
  initialData: User;
  hasChanges: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.userData = { ...data.user };
    this.initialData = { ...data.user };
  }

  ngOnInit() {
    this.checkChanges();
  }

  checkChanges() {
    this.hasChanges = 
      this.userData.firstname !== this.initialData.firstname ||
      this.userData.lastname !== this.initialData.lastname ||
      this.userData.email !== this.initialData.email ||
      this.userData.phone !== this.initialData.phone;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.userData);
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', user: this.userData });
  }
} 
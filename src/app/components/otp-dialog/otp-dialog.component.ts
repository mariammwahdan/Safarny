import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-otp-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="p-6 bg-white rounded-lg shadow-xl max-w-md w-full">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Enter OTP</h2>
      <p class="text-gray-600 mb-6">
        Please enter the 6-digit OTP sent to your phone number
      </p>

      <div class="mb-6">
        <mat-form-field class="w-full">
          <mat-label>OTP Code</mat-label>
          <input
            matInput
            [(ngModel)]="otp"
            maxlength="6"
            placeholder="Enter 6-digit code"
            (keyup.enter)="onSubmit()"
          />
        </mat-form-field>
      </div>

      <div class="flex justify-end gap-4">
        <button
          mat-button
          (click)="onCancel()"
          class="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="!otp || otp.length !== 6"
          class="bg-blue-600 text-white hover:bg-blue-700"
        >
          Verify
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class OtpDialogComponent {
  otp: string = '';

  constructor(
    public dialogRef: MatDialogRef<OtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.otp && this.otp.length === 6) {
      this.dialogRef.close(this.otp);
    }
  }
}

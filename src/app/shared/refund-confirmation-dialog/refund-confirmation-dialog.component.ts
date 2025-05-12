import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-refund-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-center mb-4">
        <mat-icon class="text-4xl text-amber-500 mr-2">currency_exchange</mat-icon>
        <h2 class="text-2xl font-semibold text-gray-800">Confirm Refund</h2>
      </div>
      
      <div class="text-center mb-6">
        <p class="text-gray-600 mb-2">Are you sure you want to refund this booking?</p>
        <p class="text-sm text-gray-500">This action cannot be undone.</p>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          mat-button
          (click)="onCancel()"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onConfirm()"
          class="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg"
        >
          Confirm Refund
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-width: 300px;
    }
  `]
})
export class RefundConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RefundConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
} 
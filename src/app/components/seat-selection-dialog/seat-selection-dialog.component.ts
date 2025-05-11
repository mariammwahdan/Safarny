import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-seat-selection-dialog',
  templateUrl: './seat-selection-dialog.component.html',
  styleUrls: ['./seat-selection-dialog.component.css'],
  standalone: true,
    imports: [
    CommonModule, // ✅ This line is necessary for *ngFor and *ngIf
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    // ... add any other Angular Material modules you use
  ],

})
export class SeatSelectionDialogComponent {
  selectedSeats: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<SeatSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { numSeats: number }
  ) {}

  seatClicked(seatId: string) {
    const index = this.selectedSeats.indexOf(seatId);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else if (this.selectedSeats.length < this.data.numSeats) {
      this.selectedSeats.push(seatId);
    }
  }

  isSelected(seatId: string) {
    return this.selectedSeats.includes(seatId);
  }

  confirmSelection() {
    this.dialogRef.close(this.selectedSeats);
  }
}

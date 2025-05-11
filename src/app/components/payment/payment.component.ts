import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
})
export class PaymentComponent {
  booking: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.booking = navigation?.extras?.state?.['booking'];

    if (this.booking) {
      console.log('Received booking:', this.booking);
    } else {
      console.warn('No booking data received');
    }
  }
}

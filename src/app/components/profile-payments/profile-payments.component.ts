import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  PaymentService,
  BookingRecord,
} from '../../core/services/payment.service';
import { TripService } from '../../core/services/trip.service';
import { Trip } from '../../types/trips';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { Auth, User } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile-payments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-payments.component.html',
  styleUrl: './profile-payments.component.css',
})
export class ProfilePaymentsComponent implements OnInit {
  payments: Array<{
    booking: BookingRecord;
    trip: Trip | null;
    formattedDate: string;
  }> = [];
  isLoading: boolean = true;
  user: User | null = null;

  constructor(
    private paymentService: PaymentService,
    private tripService: TripService,
    private auth: Auth,
    private firebaseAuth: FirebaseAuthService
  ) {}

  async ngOnInit() {
    const userString = localStorage.getItem('user');
    let userData = userString ? JSON.parse(userString) : null;

    // Fallback: Load from Firestore if missing
    if (!userData && this.auth.currentUser) {
      userData = await this.firebaseAuth.getUserData(this.auth.currentUser.uid);
      localStorage.setItem('user', JSON.stringify(userData)); // Cache it again
    }

    this.user = userData;

    await this.loadPayments();
  }

  async loadPayments() {
    if (!this.user) {
      console.error('User not found');
      return;
    }

    try {
      this.isLoading = true;
      const bookings = await this.paymentService.getUserBookings(this.user.uid);
      console.log('Bookings:', bookings);

      // Load trip details for each booking
      const paymentsWithTrips = await Promise.all(
        bookings.map(async (booking: BookingRecord) => {
          const trip = await this.tripService.getTripById(booking.tripid);
          return {
            booking,
            trip,
            formattedDate: this.formatDate(booking.updatedAt),
          };
        })
      );

      this.payments = paymentsWithTrips;
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private formatDate(date: Date | Timestamp): string {
    // Convert Firestore Timestamp to Date if needed
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);

    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date);
      return 'Invalid Date';
    }

    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' });
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    return `${day}${this.getOrdinalSuffix(
      day
    )} ${month}, ${formattedHours}:${minutes} ${ampm}`;
  }

  formatPaymentDate(booking: BookingRecord): string {
    return this.formatDate(booking.createdAt);
  }

  formatRefundDate(booking: BookingRecord): string {
    return this.formatDate(booking.updatedAt);
  }

  private getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-purple-600';
      default:
        return 'text-yellow-600';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'success':
        return 'Paid';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      default:
        return 'Pending';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'success':
        return 'check_circle';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'replay';
      default:
        return 'pending';
    }
  }
}

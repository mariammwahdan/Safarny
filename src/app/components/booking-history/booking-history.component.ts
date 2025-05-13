import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { TripService } from '../../core/services/trip.service';
import { Auth, User } from '@angular/fire/auth';
import { BookingRecord, PaymentService } from '../../core/services/payment.service';
import { Trip } from '../../types/trips';

import { BookingWithTrip } from '../../types/booking';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  bookings: BookingWithTrip[] = [];

  constructor(
    private firestore: FirebaseAuthService,
    private tripService: TripService,
    private auth: Auth,
    private paymentService: PaymentService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initializeUser();
    await this.loadBookings();
  }

  private async initializeUser(): Promise<void> {
    const userString = localStorage.getItem('user');
    let userData = userString ? JSON.parse(userString) : null;

    // Fallback to Firestore fetch if local cache is missing
    if (!userData && this.auth.currentUser) {
      userData = await this.firestore.getUserData(this.auth.currentUser.uid);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    this.user = userData;
  }

  async loadBookings(): Promise<void> {
  if (!this.user) {
    console.error('User not found');
    return;
  }

  try {
    this.isLoading = true;

    const bookingWithTrips = await this.firestore.getUserBookings(this.user.uid);
    console.log('Bookings:', bookingWithTrips);

    this.bookings = bookingWithTrips;
  } catch (error) {
    console.error('Error loading bookings:', error);
  } finally {
    this.isLoading = false;
  }
}

}

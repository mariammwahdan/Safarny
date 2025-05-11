import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

export interface PaymentDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}

export interface BookingRecord {
  id?: string;
  userid: string;
  tripid: string;
  numberOfSeats: number;
  selectedExtras: Array<{
    extrasId: string;
    quantity: number;
  }>;
  selectedSeats: string[];
  totalPrice: number;
  status: 'pending' | 'success' | 'failed';
  paymentDetails?: PaymentDetails;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly BOOKINGS_COLLECTION = 'bookings';

  constructor(private firestore: Firestore, private router: Router) {}

  async processPayment(
    paymentDetails: PaymentDetails,
    bookingData: Omit<
      BookingRecord,
      'id' | 'status' | 'createdAt' | 'updatedAt'
    >
  ): Promise<{ success: boolean; bookingId: string }> {
    const bookingId = doc(
      collection(this.firestore, this.BOOKINGS_COLLECTION)
    ).id;

    const bookingRecord: BookingRecord = {
      ...bookingData,
      id: bookingId,
      status: 'pending',
      paymentDetails,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(
      doc(this.firestore, this.BOOKINGS_COLLECTION, bookingId),
      bookingRecord
    );

    // Simulate payment processing
    const isSuccessful = !paymentDetails.cardNumber.endsWith('8');

    if (isSuccessful) {
      await this.updateBookingStatus(bookingId, 'success');
    } else {
      await this.updateBookingStatus(bookingId, 'failed');
    }

    return { success: isSuccessful, bookingId };
  }

  async verifyOTP(otp: string): Promise<boolean> {
    return otp === '987654';
  }

  async getBookingById(bookingId: string): Promise<BookingRecord | null> {
    const bookingDoc = await getDoc(
      doc(this.firestore, this.BOOKINGS_COLLECTION, bookingId)
    );
    if (bookingDoc.exists()) {
      return bookingDoc.data() as BookingRecord;
    }
    return null;
  }

  async updateBookingStatus(
    bookingId: string,
    status: 'success' | 'failed'
  ): Promise<void> {
    await updateDoc(doc(this.firestore, this.BOOKINGS_COLLECTION, bookingId), {
      status,
      updatedAt: new Date(),
    });
  }

  async retryPayment(
    bookingId: string,
    paymentDetails: PaymentDetails
  ): Promise<boolean> {
    const booking = await this.getBookingById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'success') {
      return true;
    }

    const isSuccessful = !paymentDetails.cardNumber.endsWith('8');
    await this.updateBookingStatus(
      bookingId,
      isSuccessful ? 'success' : 'failed'
    );
    return isSuccessful;
  }
}

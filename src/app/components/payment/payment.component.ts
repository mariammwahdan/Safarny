import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import {
  PaymentService,
  PaymentDetails,
} from '../../core/services/payment.service';
import { TripService } from '../../core/services/trip.service';
import { Trip } from '../../types/trips';
import {
  getCardType,
  formatCardNumber,
  formatExpiryDate,
  getCardImage,
  CardType,
} from '../../core/utils/card.utils';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';

interface BookingData {
  userid: string;
  tripid: string;
  numberOfSeats: number;
  selectedExtras: Array<{
    extrasId: string;
    quantity: number;
    name?: string;
    price?: number;
  }>;
  selectedSeats: string[];
  totalPrice: number;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
})
export class PaymentComponent implements OnInit {
  booking: BookingData | null = null;
  trip: Trip | null = null;
  paymentForm: FormGroup;
  cardType: CardType = 'Unknown';
  cardImage: string = getCardImage('Unknown');
  isProcessing: boolean = false;
  isRetryMode: boolean = false;
  bookingId: string | null = null;
  isLoading: boolean = true;
  isPaymentSuccessful: boolean = false;
  maskedCardNumber: string = '';
  cardHolderName: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private tripService: TripService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ref: ChangeDetectorRef
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(/^[\d\s-]{13,19}$/)],
      ],
      cardHolderName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,50}$/)],
      ],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    this.bookingId = this.route.snapshot.paramMap.get('id');
    this.isRetryMode = !!this.bookingId;

    try {
      if (this.isRetryMode) {
        await this.loadBookingDetails();
      } else {
        const state = history.state;
        const bookingData = state?.['booking'] as BookingData;

        if (!bookingData) {
          console.error('No booking data found in state');
          this.showError('No booking data found. Please try booking again.');
          return;
        }

        // Validate required booking data
        if (
          !bookingData.tripid ||
          !bookingData.userid ||
          !bookingData.totalPrice
        ) {
          console.error('Invalid booking data:', bookingData);
          this.showError('Invalid booking data. Please try booking again.');
          return;
        }

        this.booking = bookingData;
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.showError('An error occurred while loading booking details.');
    } finally {
      this.isLoading = false;
    }

    this.paymentForm.get('cardNumber')?.valueChanges.subscribe((value) => {
      const cardType = getCardType(value);
      this.cardType = cardType;
      this.cardImage = getCardImage(cardType);
    });
    this.ref.detectChanges();
  }

  async loadTripDetails() {
    if (!this.booking?.tripid) {
      console.error('No trip ID found in booking');
      return;
    }

    try {
      this.trip = await this.tripService.getTripById(this.booking.tripid);
    } catch (error) {
      console.error('Error loading trip details:', error);
      this.showError('Error loading trip details. Please try again.');
    }
  }

  async loadBookingDetails() {
    if (!this.bookingId) {
      console.error('No booking ID provided for retry mode');
      this.showError('No booking ID provided. Please try booking again.');
      return;
    }

    try {
      const booking = await this.paymentService.getBookingById(this.bookingId);

      if (!booking) {
        console.error('Booking not found in database');
        this.showError('Booking not found. Please try booking again.');
        return;
      }

      if (booking.status === 'success') {
        this.isPaymentSuccessful = true;
        if (booking.paymentDetails) {
          this.cardType = getCardType(booking.paymentDetails.cardNumber);
          this.cardImage = getCardImage(this.cardType);
          this.maskedCardNumber = this.maskCardNumber(
            booking.paymentDetails.cardNumber
          );
          this.cardHolderName = booking.paymentDetails.cardHolderName;
        }
      }

      // Convert the booking data to match our BookingData interface
      this.booking = {
        userid: booking.userid,
        tripid: booking.tripid,
        numberOfSeats: booking.numberOfSeats,
        selectedExtras: booking.selectedExtras.map((extra) => ({
          ...extra,
          name: this.getExtraName(extra.extrasId),
          price: this.getExtraPrice(extra.extrasId),
        })),
        selectedSeats: booking.selectedSeats,
        totalPrice: booking.totalPrice,
      };
      // Load trip details first
      console.log('Loading trip details first', this.trip);
      await this.loadTripDetails();
    } catch (error) {
      console.error('Error loading booking details:', error);
      this.showError('Error loading booking details. Please try again.');
    }
  }

  private getExtraName(extrasId: string): string {
    // This should be replaced with actual extra name lookup from your service
    return 'Extra Service';
  }

  private getExtraPrice(extrasId: string): number {
    // This should be replaced with actual extra price lookup from your service
    return 0;
  }

  private maskCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\D/g, '');
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    return `${masked}${lastFour}`;
  }

  formatCardNumber(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    value = formatCardNumber(value);
    input.value = value;
    this.paymentForm.patchValue({ cardNumber: value }, { emitEvent: false });
  }

  formatExpiryDate(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    value = formatExpiryDate(value);
    input.value = value;
    this.paymentForm.patchValue({ expiryDate: value }, { emitEvent: false });
  }

  async onSubmit() {
    if (!this.booking) {
      this.showError('No booking data found. Please try booking again.');
      return;
    }

    if (this.paymentForm.invalid) {
      this.showError('Please fill in all fields correctly');
      return;
    }

    this.isProcessing = true;

    try {
      const otp = await this.showOtpDialog();
      const isValidOtp = await this.paymentService.verifyOTP(otp || '');

      if (!isValidOtp) {
        this.showError('Invalid OTP. Please try again.');
        return;
      }

      const paymentDetails: PaymentDetails = this.paymentForm.value;
      let success: boolean;

      if (this.isRetryMode && this.bookingId) {
        success = await this.paymentService.retryPayment(
          this.bookingId,
          paymentDetails
        );
        if (success) {
          this.showSuccessMessage();
          this.router.navigate(['/payment', this.bookingId]);
        } else {
          this.showError('Payment failed.');
        }
      } else {
        const result = await this.paymentService.processPayment(
          paymentDetails,
          this.booking
        );
        success = result.success;
        this.bookingId = result.bookingId;
        if (success) {
          this.showSuccessMessage();
          this.router.navigate(['/payment', this.bookingId]);
        } else {
          this.showError('Payment failed.');
        }
      }
    } catch (error) {
      this.showError('An error occurred. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  showOtpDialog(): Promise<string | undefined> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(OtpDialogComponent, {
        width: '400px',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
    });
  }

  showSuccessMessage() {
    this.snackBar.open('Payment successful!', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}

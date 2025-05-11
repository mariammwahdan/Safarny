import { Component, OnInit } from '@angular/core';
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
import {
  PaymentService,
  PaymentDetails,
} from '../../core/services/payment.service';
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
  ],
})
export class PaymentComponent implements OnInit {
  booking: BookingData | null = null;
  paymentForm: FormGroup;
  cardType: CardType = 'Unknown';
  cardImage: string = getCardImage('Unknown');
  isProcessing: boolean = false;
  isRetryMode: boolean = false;
  bookingId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

    const navigation = this.router.getCurrentNavigation();
    const bookingData = navigation?.extras?.state?.['booking'] as BookingData;
    if (bookingData) {
      this.booking = bookingData;
    }
  }

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('id');
    this.isRetryMode = !!this.bookingId;

    if (this.isRetryMode) {
      this.loadBookingDetails();
    } else {
      const state = history.state;
      const bookingData = state?.['booking'] as BookingData;
      console.log('Booking data:', bookingData);

      if (!bookingData) {
        this.showError('No booking data found. Please try booking again.');
        return;
      }

      this.booking = bookingData;
    }

    this.paymentForm.get('cardNumber')?.valueChanges.subscribe((value) => {
      const cardType = getCardType(value);
      this.cardType = cardType;
      this.cardImage = getCardImage(cardType);
    });
  }

  async loadBookingDetails() {
    console.log('Loading booking details...', this.bookingId);
    if (!this.bookingId) return;

    try {
      console.log('Loading booking details...', this.bookingId);
      const booking = await this.paymentService.getBookingById(this.bookingId);
      if (!booking) {
        this.showError('Booking not found. Please try booking again.');
        // this.router.navigate(['/']);
        return;
      }

      if (booking.status === 'success') {
        this.showSuccessMessage();
        return;
      }

      this.booking = {
        userid: booking.userid,
        tripid: booking.tripid,
        numberOfSeats: booking.numberOfSeats,
        selectedExtras: booking.selectedExtras,
        selectedSeats: booking.selectedSeats,
        totalPrice: booking.totalPrice,
      };
    } catch (error) {
      this.showError('Error loading booking details. Please try again.');
      // this.router.navigate(['/']);
    }
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
      const paymentDetails: PaymentDetails = this.paymentForm.value;
      let success: boolean;

      if (this.isRetryMode && this.bookingId) {
        success = await this.paymentService.retryPayment(
          this.bookingId,
          paymentDetails
        );
      } else {
        const result = await this.paymentService.processPayment(
          paymentDetails,
          this.booking
        );
        success = result.success;
        this.bookingId = result.bookingId;
      }

      if (success) {
        const otp = await this.showOtpDialog();
        if (otp) {
          const isValidOtp = await this.paymentService.verifyOTP(otp);
          if (isValidOtp) {
            this.showSuccessMessage();
          } else {
            this.showError('Invalid OTP. Please try again.');
          }
        }
      } else {
        this.showError('Payment failed. Insufficient balance.');
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

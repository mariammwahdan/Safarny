import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; // <-- Make sure this is imported
import { SeatSelectionDialogComponent } from '../seat-selection-dialog/seat-selection-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Trip } from '../../types/trips';
import { TripExtrasService } from '../../core/services/trip-extras.service';
import { Booking, TripExtra } from '../../types/booking';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { Firestore, doc, DocumentReference } from '@angular/fire/firestore';
import { LoginComponent } from '../login/login.component';
import { user } from '@angular/fire/auth';

// Custom validator factory for Comfort Seat
function maxComfortSeatValidator(getMax: () => number): ValidatorFn {
  return (control: AbstractControl) => {
    if (control.value > getMax()) {
      return { maxComfort: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    // RouterLink,

    MatCardModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    // MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    LoginComponent,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  tripId!: string;
  tripData!: Trip;
  bookingForm!: FormGroup;
  tripExtras: TripExtra[] = [];
  totalPrice: number = 0;
  backgroundImageUrl = 'booking.png';
  selectedSeats: string[] = [];
  comfortSeatError: string | null = null;
  @ViewChild(LoginComponent) loginModal!: LoginComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private extrasService: TripExtrasService,
    private firebaseAuthService: FirebaseAuthService,
    private firestore: Firestore,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['trip']) {
      this.tripData = navigation.extras.state['trip'];
      console.log('Trip data received in constructor:', this.tripData);
    } else {
      console.error('No trip data found. Redirecting...');
      this.router.navigate(['/']);
    }

    this.initForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.tripId = id;
      }
    });
  }

  initForm() {
    this.bookingForm = this.fb.group({
      numberOfSeats: [1, [Validators.required, Validators.min(1)]],
      selectedExtras: this.fb.array([]),
    });

    this.bookingForm.get('numberOfSeats')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });
  }
  async ngAfterViewInit() {
    this.tripExtras = await this.extrasService.getExtrasByTransport(
      this.tripData.transportationType
    );
    const extrasFormArray = this.bookingForm.get('selectedExtras') as FormArray;

    this.tripExtras.forEach((extra) => {
      if (extra.isQuantifiable) {
        let validators = [Validators.min(0)];
        if (extra.extrasName === 'Comfort Seat') {
          validators.push(
            maxComfortSeatValidator(
              () => this.bookingForm.get('numberOfSeats')?.value || 1
            )
          );
        }
        extrasFormArray.push(
          this.fb.group({
            extrasId: [extra.extrasId],
            name: [extra.extrasName],
            quantity: [0, validators],
            price: [extra.extrasPrice],
          })
        );
      } else {
        extrasFormArray.push(
          this.fb.group({
            extrasId: [extra.extrasId],
            name: [extra.extrasName],
            selected: [false],
            price: [extra.extrasPrice],
          })
        );
      }
    });

    extrasFormArray.valueChanges.subscribe(() => this.updateTotalPrice());
    this.updateTotalPrice();
  }

  get selectedExtrasControls() {
    return (this.bookingForm.get('selectedExtras') as FormArray).controls;
  }

  showValidationError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  openSeatSelection() {
    const numSeats = this.bookingForm.get('numberOfSeats')?.value || 1;

    const dialogRef = this.dialog.open(SeatSelectionDialogComponent, {
      width: '600px',
      data: { numSeats },
    });

    dialogRef.afterClosed().subscribe((result: string[] | undefined) => {
      if (result) {
        this.selectedSeats = result;
        console.log('Selected seats:', result);
      }
    });
  }

  updateTotalPrice() {
    const seats = this.bookingForm.get('numberOfSeats')?.value || 1;
    const extrasArray = this.bookingForm.get('selectedExtras') as FormArray;
    let extrasPrice = 0;
    this.comfortSeatError = null;

    extrasArray.controls.forEach((control, i) => {
      if (this.tripExtras[i]?.isQuantifiable) {
        const quantity = control.get('quantity')?.value || 0;
        const price = control.get('price')?.value || 0;
        extrasPrice += quantity * price;

        // Set error for Comfort Seat if quantity exceeds seats
        if (
          this.tripExtras[i].extrasName === 'Comfort Seat' &&
          quantity > seats
        ) {
          this.comfortSeatError =
            'Comfort Seat quantity cannot exceed number of seats';
        }
      } else {
        const selected = control.get('selected')?.value;
        const price = control.get('price')?.value || 0;
        if (selected) {
          extrasPrice += price;
        }
      }
    });
    this.totalPrice = this.tripData.price * seats + extrasPrice;
  }

  async proceedToPayment() {
    const uid = await this.firebaseAuthService.getCurrentUserId();
    if (!uid) {
      this.loginModal.open();
      return;
    }

    const extrasArray = this.bookingForm.get('selectedExtras') as FormArray;
    const selectedExtras = extrasArray.controls
      .map((control, i) => {
        if (this.tripExtras[i].isQuantifiable) {
          return {
            extrasId: control.get('extrasId')?.value,
            quantity: control.get('quantity')?.value,
          };
        } else {
          return {
            extrasId: control.get('extrasId')?.value,
            quantity: control.get('selected')?.value ? 1 : 0,
          };
        }
      })
      .filter((extra) => extra.quantity > 0);

    const tripRef = doc(
      this.firestore,
      'trips',
      this.tripId
    ) as DocumentReference<Trip>;

    const booking: Booking = {
      userid: uid,
      tripid: tripRef,
      numberOfSeats: this.bookingForm.get('numberOfSeats')?.value,
      selectedExtras,
      selectedSeats: this.selectedSeats,
      totalPrice: this.totalPrice,
    };

    console.log('Booking details:', booking);
    alert('Booking confirmed! 🎉');

    const plainBooking = {
      userid: booking.userid,
      tripid: booking.tripid.id,
      numberOfSeats: booking.numberOfSeats,
      selectedExtras: booking.selectedExtras.map((extra) => ({
        extrasId: extra.extrasId.id,
        quantity: extra.quantity,
      })),
      selectedSeats: booking.selectedSeats,
      totalPrice: booking.totalPrice,
    };

    this.router.navigate(['/payment'], { state: { booking: plainBooking } });
  }

  onExtraCheckboxChange(event: any, extraCtrl: any) {
    extraCtrl.get('quantity').setValue(event.checked ? 1 : 0);
  }
}

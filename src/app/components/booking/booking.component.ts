import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
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
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  tripId!: number;
  tripData!: Trip;
  bookingForm!: FormGroup;
  tripExtras: TripExtra[] = [];
  totalPrice: number = 0;
  backgroundImageUrl = 'booking.png';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private extrasService: TripExtrasService
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
        this.tripId = +id;
      }
    });
  }

  initForm() {
    this.bookingForm = this.fb.group({
      numberOfSeats: [1, [Validators.required, Validators.min(1)]],
      selectedExtras: this.fb.array([]), // FormArray for checkboxes/multiple selections
    });

    this.bookingForm.get('numberOfSeats')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });
  }
  ngAfterViewInit() {
    this.tripExtras = this.extrasService.getExtrasByTransport(
      this.tripData.transportationType
    );
    const extrasFormArray = this.bookingForm.get('selectedExtras') as FormArray;

    this.tripExtras.forEach((extra) => {
      extrasFormArray.push(
        this.fb.group({
          name: [extra.extrasName],
          quantity: [0, [Validators.min(0)]],
          price: [extra.extrasPrice],
        })
      );
    });

    extrasFormArray.valueChanges.subscribe(() => this.updateTotalPrice());
    this.updateTotalPrice();
  }

  get selectedExtrasControls() {
    return (this.bookingForm.get('selectedExtras') as FormArray).controls;
  }

  updateTotalPrice() {
    const seats = this.bookingForm.get('numberOfSeats')?.value || 1;
    const extrasArray = this.bookingForm.get('selectedExtras') as FormArray;
    let extrasPrice = 0;

    extrasArray.controls.forEach((control) => {
      const quantity = control.get('quantity')?.value || 0;
      const price = control.get('price')?.value || 0;
      extrasPrice += quantity * price;
    });
    this.totalPrice = this.tripData.price * seats + extrasPrice;
  }

  proceedToPayment() {
    const extrasArray = this.bookingForm.get('selectedExtras') as FormArray;
    const selectedExtras = extrasArray.controls
      .map((control) => {
        const name = control.get('name')?.value;
        const quantity = control.get('quantity')?.value;
        return { name, quantity };
      })
      .filter((extra) => extra.quantity > 0)
      .map((extra) => `${extra.name} x${extra.quantity}`);

    const bookingDetails: Booking = {
      tripid: this.tripId,
      numberOfSeats: this.bookingForm.get('numberOfSeats')?.value,
      selectedExtras,
      totalPrice: this.totalPrice,
    };

    console.log('Booking details:', bookingDetails);
    alert('Booking confirmed! 🎉');
    // this.router.navigate(['/payment'], { state: { booking: bookingDetails } });
  }
}

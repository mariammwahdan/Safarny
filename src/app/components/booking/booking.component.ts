import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
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
import { CountryService } from '../../core/services/country.service'; // Optional if you need services
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
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
  tripForm!: FormGroup;
  extrasOptions: string[] = [];
  selectedExtras: string[] = [];
  totalPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
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
    this.tripForm = this.fb.group({
      numberOfSeats: [1, [Validators.required, Validators.min(1)]],
      selectedExtras: [[]],
    });

    // Watch number of seats change
    this.tripForm.get('numberOfSeats')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });

    // Watch selected extras change
    this.tripForm.get('selectedExtras')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });
  }

  ngAfterViewInit() {
    // Suggest extras based on transportationType
    if (this.tripData.transportationType.toLowerCase() === 'flight') {
      this.extrasOptions = ['Meal', 'First Class Upgrade', 'Extra Luggage'];
    } else if (this.tripData.transportationType.toLowerCase() === 'train') {
      this.extrasOptions = ['Meal', 'First Class Upgrade', 'WiFi'];
    } else if (this.tripData.transportationType.toLowerCase() === 'bus') {
      this.extrasOptions = ['WiFi', 'AC', 'Extra Legroom'];
    } else {
      this.extrasOptions = ['Insurance', 'Priority Boarding'];
    }

    this.updateTotalPrice();
  }

  // check selected extras
  checkSelectedExtras(extra: string) {
    if (extra=== 'Meal') {
      return 50;
    
    } else if (extra === 'First Class Upgrade') {
      return 100;
    
    } else if (extra === 'Extra Luggage') {
      return 150;
    }
    else {
      return 50;
    }
  }
    

  updateTotalPrice() {
    const seats = this.tripForm.get('numberOfSeats')?.value || 1;
    const extrasCount = (this.tripForm.get('selectedExtras')?.value || []).length;
    const basePrice = this.tripData.price;
    this.totalPrice = (basePrice * seats) + (extrasCount * 50); // Assume 50 EGP per extra option
  }

  bookTrip() {
    console.log('Booking confirmed with details:', this.tripForm.value);
    alert('Booking confirmed! 🎉');
  }
}

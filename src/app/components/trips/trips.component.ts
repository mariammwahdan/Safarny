import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface TripSearchRequest {
  tripType: string;
  source: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  numberOfPassengers: number;
}

interface Trip {
  id: number;
  source: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  transportationType: string;
  price: number;
}

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatGridListModule,
    MatCardModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css',
})
export class TripsComponent implements OnInit {
  trips: Trip[] = [];
  locations: string[] = [
    'Cairo',
    'Alexandria',
    'Luxor',
    'Aswan',
    'Sharm El Sheikh',
    'Hurghada',
  ];

  tripForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.tripForm = this.fb.group({
      tripType: ['one-way', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      depatureDate: ['', Validators.required],
      returnDate: [''],
      numberOfPassengers: [1, [Validators.required, Validators.min(1)]],
    });

    // If round trip is selected, make return date required
    this.tripForm.get('tripType')?.valueChanges.subscribe((tripType) => {
      const returnDateControl = this.tripForm.get('returnDate');
      if (tripType === 'round-trip') {
        returnDateControl?.setValidators(Validators.required);
      } else {
        returnDateControl?.clearValidators();
      }
      returnDateControl?.updateValueAndValidity();
    });
  }


  bookTrip(trip: Trip) {
    console.log('Booking trip:', trip);
  }

  availableTrips: any[] = []; 
  isLoadingTrips: boolean = false;

  searchTrips() {
    this.isLoadingTrips = true;

    
    setTimeout(() => {
      this.availableTrips = [
        {
          id: 1,
          source: this.tripForm.value.source,
          destination: this.tripForm.value.destination,
          departureDate: this.tripForm.value.departureDate,
          departureTime: '10:00 AM',
          arrivalTime: '12:00 PM',
          duration: '2h',
          transportationType: 'Flight',
          price: 100,
        },
        {
          id: 2,
          source: this.tripForm.value.source,
          destination: this.tripForm.value.destination,
          depatureDate: this.tripForm.value.depatureDate,
          departureTime: '3:00 PM',
          arrivalTime: '5:00 PM',
          duration: '2h',
          transportationType: 'Train',
          price: 50,
        },
      ]
      this.isLoadingTrips = false;
    }, 1500);
  }
}

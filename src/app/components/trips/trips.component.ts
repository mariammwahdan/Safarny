import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Trip } from '../../types/trips';


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
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css',
})
export class TripsComponent implements OnInit {
  @ViewChild('resultsSection') resultsSection!: ElementRef;

  selectedTransportation: string = 'all';

  locations: string[] = [
    'Cairo',
    'Alexandria',
    'Luxor',
    'Aswan',
    'Sharm El Sheikh',
    'Hurghada',
  ];

  tripForm!: FormGroup;
searchPerformed: any;

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

  availableTrips: Trip[] = [];
  isLoadingTrips: boolean = false;

  searchTrips() {
    this.isLoadingTrips = true;
    this.searchPerformed = true;

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
          departureDate: this.tripForm.value.depatureDate,
          departureTime: '3:00 PM',
          arrivalTime: '5:00 PM',
          duration: '2h',
          transportationType: 'Train',
          price: 50,
        },
      ];
      this.isLoadingTrips = false;

      // Scroll to the results section after a short delay
      setTimeout(() => {
        this.scrollToResults();
      }, 100);
    }, 1500);
  }

  scrollToResults() {
    if (this.availableTrips.length > 0 && this.resultsSection) {
      this.resultsSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  get filteredTrips(): Trip[] {
    if (!this.availableTrips) return [];
    if (this.selectedTransportation === 'all') return this.availableTrips;

    return this.availableTrips.filter(
      (trip) =>
        trip.transportationType.toLowerCase() ===
        this.selectedTransportation.toLowerCase()
    );
  }
}

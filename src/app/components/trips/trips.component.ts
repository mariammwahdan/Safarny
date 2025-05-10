import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Trip, TransportationType, TripSearchRequest } from '../../types/trips';
import { CountryService } from '../../core/services/country.service';
import { City } from '../../types/city';
import { finalize } from 'rxjs/operators';
import { TripService } from '../../core/services/trip.service';

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

  TransportationType = TransportationType;
  selectedTransportation: TransportationType | null = null;
  minDate: Date = new Date();

  cities: City[] = [];
  loadingCities = false;
  availableTrips: Trip[] = [];
  filteredTrips: Trip[] = [];
  isLoadingTrips: boolean = false;
  searchPerformed: boolean = false;

  tripForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private router: Router,
    private tripService: TripService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadCities('Egypt');
  }

  loadCities(country: string) {
    this.loadingCities = true;
    this.countryService
      .getAllCitiesWithCountry(country)
      .pipe(finalize(() => (this.loadingCities = false)))
      .subscribe({
        next: (response) => {
          const cityNames = response.data;
          this.cities = cityNames.map((city) => ({
            name: city,
            value: city,
          }));
        },
        error: (error) => {
          console.error('Error loading cities:', error);
          this.cities = [
            { name: 'Cairo', value: 'Cairo' },
            { name: 'Alexandria', value: 'Alexandria' },
            { name: 'Luxor', value: 'Luxor' },
            { name: 'Aswan', value: 'Aswan' },
            { name: 'Sharm El Sheikh', value: 'Sharm El Sheikh' },
            { name: 'Hurghada', value: 'Hurghada' },
          ];
        },
      });
  }

  initForm() {
    this.tripForm = this.fb.group({
      tripType: ['one-way', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: [''],
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
    this.router.navigate(['/booking', trip.id], { state: { trip: trip } });
  }

  searchTrips() {
    if (!this.tripForm.valid) return;

    this.isLoadingTrips = true;
    this.searchPerformed = true;
    this.selectedTransportation = null;

    const formValue = this.tripForm.value;
    const searchRequest: TripSearchRequest = {
      ...formValue,
      departureDate: new Date(formValue.departureDate),
      returnDate: formValue.returnDate ? new Date(formValue.returnDate) : undefined
    };

    this.tripService.searchTrips(searchRequest).then((trips: Trip[]) => {
      this.availableTrips = trips;
      this.filterTrips();
      this.isLoadingTrips = false;

      setTimeout(() => {
        this.scrollToResults();
      }, 1500);
    });
  }

  scrollToResults() {
    if (this.availableTrips.length > 0 && this.resultsSection) {
      this.resultsSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  filterTrips() {
    this.filteredTrips = this.availableTrips.filter(trip => {
      return !this.selectedTransportation || trip.transportationType === this.selectedTransportation;
    });
  }
}

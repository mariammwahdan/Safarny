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
import { Trip } from '../../types/trips';
import { CountryService } from '../../core/services/country.service';
import { City } from '../../types/city';
import { finalize } from 'rxjs/operators';

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
  minDate: Date = new Date(); 

  cities: City[] = [];
  loadingCities = false;

  tripForm!: FormGroup;
  searchPerformed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private router: Router
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
    this.router.navigate(['/booking', trip.id]);
  }

  availableTrips: Trip[] = [];
  isLoadingTrips: boolean = false;

  searchTrips() {
    this.isLoadingTrips = true;
    this.searchPerformed = true;
    this.selectedTransportation = 'all';

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
          departureDate: this.tripForm.value.departureDate,
          departureTime: '3:00 PM',
          arrivalTime: '5:00 PM',
          duration: '2h',
          transportationType: 'Train',
          price: 50,
        },
      ];
      this.isLoadingTrips = false;

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

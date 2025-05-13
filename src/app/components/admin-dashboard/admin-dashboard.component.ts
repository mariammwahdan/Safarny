import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { User } from '../../types/user';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { EditUserDialogComponent } from '../../shared/edit-user-dialog/edit-user-dialog.component';
import { NotificationService } from '../../core/services/notification.service';
import { PaymentService, BookingRecord } from '../../core/services/payment.service';
import { TripService } from '../../core/services/trip.service';
import { Trip, TransportationType } from '../../types/trips';
import { doc, updateDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { RefundConfirmationDialogComponent } from '../../shared/refund-confirmation-dialog/refund-confirmation-dialog.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { finalize } from 'rxjs/operators';
import { CountryService } from '../../core/services/country.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatSidenavModule,
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  username: string = 'Admin User';
  selectedMenu = 'users';
  showDropdown = false;
  users: User[] = [];
  selectedUser: User | null = null;
  userBookings: BookingRecord[] = [];
  tripDetails: Map<string, Trip> = new Map();
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phone', 'actions'];
  bookingColumns: string[] = ['source', 'destination', 'numberOfSeats', 'totalPrice', 'status', 'refund'];
  tripForm: FormGroup;
  transportationTypes = Object.values(TransportationType);
  cities: { name: string; value: string }[] = [];
  loadingCities = false;
  minDate: Date = new Date();

  constructor(
    public _Nav: AuthService,
    private router: Router,
    private auth: Auth,
    private firebaseAuth: FirebaseAuthService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private paymentService: PaymentService,
    private tripService: TripService,
    private firestore: Firestore,
    private fb: FormBuilder,
    private countryService: CountryService
  ) {
    this.tripForm = this.fb.group({
      source: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      departureDate: [null, [Validators.required]],
      departureTime: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]],
      arrivalTime: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]],
      duration: [{value: '', disabled: true}],
      transportationType: [TransportationType.Bus, Validators.required],
      price: [0, [Validators.required, Validators.max(10000)]]
    });

    this.tripForm.get('departureTime')?.valueChanges.subscribe(() => this.calculateDuration());
    this.tripForm.get('arrivalTime')?.valueChanges.subscribe(() => this.calculateDuration());
  }

  async ngOnInit(): Promise<void> {
    this._Nav.hide();
    const userString = localStorage.getItem('user');
    let userData = userString ? JSON.parse(userString) : null;
    if (userData) {
      this.username = userData.firstname + ' ' + userData.lastname;
    }
    await this.loadUsers();
    this.loadCities('Egypt');
  }

  ngOnDestroy(): void {
    this._Nav.show();
  }

  async loadUsers() {
    try {
      const allUsers = await this.firebaseAuth.getAllUsers();
      this.users = allUsers.filter(user => user.role !== 'admin');
    } catch (error) {
      console.error('Error loading users:', error);
      this.notificationService.showError('Failed to load users');
    }
  }

  openEditDialog(user: User) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (result.action === 'delete') {
          await this.deleteUser(result.user);
        } else {
          try {
            await this.firebaseAuth.updateUserData(result.uid!, result);
            await this.loadUsers();
            this.notificationService.showUpdateSuccess();
            if (this.selectedUser && this.selectedUser.uid === result.uid) {
              this.selectedUser = result;
            }
          } catch (error) {
            console.error('Error updating user:', error);
            this.notificationService.showError('Failed to update user');
          }
        }
      }
    });
  }

  async deleteUser(user: User) {
    if (!user.uid) {
      console.error('Cannot delete user: No UID provided');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { userName: `${user.firstname} ${user.lastname}` }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.firebaseAuth.deleteUser(user.uid!);
          await this.loadUsers();
          this.notificationService.showDeleteSuccess();
        } catch (error) {
          console.error('Error deleting user:', error);
          this.notificationService.showError('Failed to delete user');
        }
      }
    });
  }

  async selectUser(user: User) {
    this.selectedUser = user;
    this.selectedMenu = 'bookings';
    await this.loadUserBookings(user.uid!);
  }

  async loadUserBookings(userId: string) {
    try {
      this.userBookings = await this.paymentService.getUserBookings(userId);
      await this.loadTripDetails();
    } catch (error) {
      console.error('Error loading user bookings:', error);
      this.notificationService.showError('Failed to load user bookings');
    }
  }

  async loadTripDetails() {
    try {
      for (const booking of this.userBookings) {
        if (!this.tripDetails.has(booking.tripid)) {
          const trip = await this.tripService.getTripById(booking.tripid);
          if (trip) {
            this.tripDetails.set(booking.tripid, trip);
          }
        }
      }
    } catch (error) {
      console.error('Error loading trip details:', error);
      this.notificationService.showError('Failed to load trip details');
    }
  }

  getTripDetails(tripId: string): Trip | undefined {
    return this.tripDetails.get(tripId);
  }

  selectMenu(menu: string) {
    this.selectedMenu = menu;
    if (menu === 'users') {
      this.loadUsers();
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this._Nav.logout();
    this.router.navigate(['/home']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  async refundBooking(booking: BookingRecord) {
    const dialogRef = this.dialog.open(RefundConfirmationDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await updateDoc(doc(this.firestore, 'bookings', booking.id!), {
            status: 'refunded',
            updatedAt: new Date()
          });
          
          const index = this.userBookings.findIndex(b => b.id === booking.id);
          if (index !== -1) {
            this.userBookings[index] = {
              ...this.userBookings[index],
              status: 'refunded',
              updatedAt: new Date()
            };
          }
          this.notificationService.showRefundSuccess();
        } catch (error) {
          console.error('Error refunding booking:', error);
          this.notificationService.showError('Failed to refund booking');
        }
      }
    });
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
          this.notificationService.showError('Failed to load cities');
        }
      });
  }

  calculateDuration() {
    const departureTime = this.tripForm.get('departureTime')?.value;
    const arrivalTime = this.tripForm.get('arrivalTime')?.value;

    if (departureTime && arrivalTime) {
      const [depHours, depMinutes] = departureTime.split(':').map(Number);
      const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);

      let totalMinutes = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes);
      
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
      }

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      const duration = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
      this.tripForm.get('duration')?.setValue(duration);
    }
  }

  async createTrip() {
    if (this.tripForm.valid) {
      try {
        const tripData = {
          ...this.tripForm.value,
          duration: this.tripForm.get('duration')?.value,
          departureDate: new Date(this.tripForm.value.departureDate)
        };
        
        await this.tripService.addTrip(tripData);
        this.notificationService.showSuccess('Trip created successfully');
        
        this.tripForm.reset({
          transportationType: TransportationType.Bus,
          price: 0
        });
        
        Object.keys(this.tripForm.controls).forEach(key => {
          const control = this.tripForm.get(key);
          control?.markAsPristine();
          control?.markAsUntouched();
        });
      } catch (error) {
        console.error('Error creating trip:', error);
        this.notificationService.showError('Failed to create trip');
      }
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.tripForm.get(controlName);
    if (!control) return '';

    switch (controlName) {
      case 'source':
      case 'destination':
        if (control.hasError('minlength')) {
          return 'City name must be at least 2 characters';
        }
        if (control.hasError('maxlength')) {
          return 'City name cannot exceed 50 characters';
        }
        break;
      case 'departureTime':
      case 'arrivalTime':
        if (control.hasError('pattern')) {
          return 'Please enter time in HH:MM format (e.g., 14:30)';
        }
        break;
      case 'price':
        if (control.hasError('max')) {
          return 'Price cannot exceed $10,000';
        }
        break;
    }

    return '';
  }
}

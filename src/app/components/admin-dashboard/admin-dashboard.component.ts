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
import { Trip } from '../../types/trips';
import { doc, updateDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { RefundConfirmationDialogComponent } from '../../shared/refund-confirmation-dialog/refund-confirmation-dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatSidenavModule,
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
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

  constructor(
    public _Nav: AuthService,
    private router: Router,
    private auth: Auth,
    private firebaseAuth: FirebaseAuthService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private paymentService: PaymentService,
    private tripService: TripService,
    private firestore: Firestore
  ) {}

  async ngOnInit(): Promise<void> {
    this._Nav.hide();
    const userString = localStorage.getItem('user');
    let userData = userString ? JSON.parse(userString) : null;
    if (userData) {
      this.username = userData.firstname + ' ' + userData.lastname;
    }
    await this.loadUsers();
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
      // Load trip details for each booking
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
          // Update the booking status in Firestore
          await updateDoc(doc(this.firestore, 'bookings', booking.id!), {
            status: 'refunded',
            updatedAt: new Date()
          });
          
          // Update the local booking status
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
}

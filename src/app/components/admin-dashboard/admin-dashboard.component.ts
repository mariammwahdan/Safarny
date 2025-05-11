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
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phone', 'actions'];

  constructor(
    public _Nav: AuthService,
    private router: Router,
    private auth: Auth,
    private firebaseAuth: FirebaseAuthService,
    private dialog: MatDialog,
    private notificationService: NotificationService
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

  selectUser(user: User) {
    this.selectedUser = user;
    this.selectedMenu = 'bookings';
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
}

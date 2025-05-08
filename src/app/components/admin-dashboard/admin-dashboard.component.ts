import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { UserManagementService } from '../../core/services/user-management.service';
import { User } from '../../types/user';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

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
  selectedMenu = 'dashboard';
  showDropdown = false;
  users: User[] = [];
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phone', 'actions'];

  constructor(
    public _Nav: AuthService,
    private router: Router,
    private auth: Auth,
    private firebaseAuth: FirebaseAuthService,
    private userManagementService: UserManagementService,
    private dialog: MatDialog
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
      this.users = await this.userManagementService.getAllUsers();
    } catch (error) {
      console.error('Error loading users:', error);
    }
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
          await this.userManagementService.deleteUser(user.uid!);
          await this.loadUsers(); // Reload the users list
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      }
    });
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

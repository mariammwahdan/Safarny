import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TripsComponent } from './components/trips/trips.component';
import { BookingComponent } from './components/booking/booking.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'trips', component: TripsComponent },
  {path:'profile',component: UserProfileComponent},
  { path: 'booking/:id', component: BookingComponent },
  { path: '**', redirectTo: 'home' },
];

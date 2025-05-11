import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TripsComponent } from './components/trips/trips.component';
import { BookingComponent } from './components/booking/booking.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
// import { AdminComponent } from './components/admin/admin.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'trips', component: TripsComponent },
  {path:'profile',component: UserProfileComponent},
  { path: 'booking/:id', component: BookingComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us', component: AboutUsComponent },
  {path: 'payment', component: PaymentComponent},
  // { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: 'home' },
];

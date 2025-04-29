import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface Booking {
  date: string;
  status: 'Canceled' | 'Assigned';
  time: string;
  from: string;
  to: string;
}
@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent {
  bookings: Booking[] = [
    {
      date: '25.4.2025',
      status: 'Canceled',
      time: '9:32 AM',
      from: 'Cairo',
      to: 'Aswan',
    },
    {
      date: '30.10.2025',
      status: 'Assigned',
      time: '10:00 AM',
      from: 'Cairo',
      to: 'Alex',
    },
  ];
}

import { Injectable } from '@angular/core';
import { TripExtra } from '../types/booking';

@Injectable({
  providedIn: 'root'
})
export class TripExtrasService {
  private extras: TripExtra[] = [
    { extrasId: 1, extrasName: 'Meal', extrasquantity: 0, extrasPrice: 50 },
    { extrasId: 2, extrasName: 'First Class Upgrade', extrasquantity: 0, extrasPrice: 100 },
    { extrasId: 3, extrasName: 'Extra Luggage', extrasquantity: 0, extrasPrice: 150 },
    { extrasId: 4, extrasName: 'WiFi', extrasquantity: 0, extrasPrice: 20 },
    { extrasId: 5, extrasName: 'AC', extrasquantity: 1, extrasPrice: 30 }, // fixed quantity
    { extrasId: 6, extrasName: 'Extra Legroom', extrasquantity: 0, extrasPrice: 40 },
    { extrasId: 7, extrasName: 'Insurance', extrasquantity: 0, extrasPrice: 60 },
    { extrasId: 8, extrasName: 'Priority Boarding', extrasquantity: 0, extrasPrice: 80 },
  ];

  getExtrasByTransport(type: string): TripExtra[] {
    switch (type.toLowerCase()) {
      case 'flight':
        return this.extras.filter(extra => ['Meal', 'First Class Upgrade', 'Extra Luggage'].includes(extra.extrasName));
      case 'train':
        return this.extras.filter(extra => ['Meal', 'First Class Upgrade', 'WiFi'].includes(extra.extrasName));
      case 'bus':
        return this.extras.filter(extra => ['WiFi', 'AC', 'Extra Legroom'].includes(extra.extrasName));
      default:
        return this.extras;
    }
  }
  constructor() { }
}

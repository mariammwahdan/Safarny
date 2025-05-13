export interface TripSearchRequest {
  tripType: string;
  source: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  departureDate: Date;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  transportationType: TransportationType;
  price: number;
  departureDateString: String;
}

export enum TransportationType {
  Flight = 'Flight',
  Train = 'Train',
  Bus = 'Bus',
  Car = 'Car',
}

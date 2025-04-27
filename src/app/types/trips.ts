export interface TripSearchRequest {
  tripType: string;
  source: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
}

export interface Trip {
  id: number;
  source: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  transportationType: string;
  price: number;
}

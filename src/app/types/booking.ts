export interface Booking {
    userid: string;
    tripid: number;
    numberOfSeats: number;
    selectedExtras: string[];
    totalPrice: number;
}

export interface TripExtra {
    extrasId: number;
    extrasName: string;
    extrasquantity: number;
    extrasPrice: number;
}

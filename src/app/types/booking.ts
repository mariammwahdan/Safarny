import { DocumentReference } from "@angular/fire/firestore";
import { Trip, TransportationType } from "./trips";

export interface Booking {
    userid: string;
    tripid: DocumentReference<Trip>;
    numberOfSeats: number;
    selectedExtras: SelectedExtras[];
    selectedSeats: string[];
    totalPrice: number;
}

export interface TripExtra {
    extrasId: string;
    extrasName: string;
    extrasPrice: number;
    isQuantifiable: boolean;
    transportationType: TransportationType[];
}

export interface SelectedExtras {
    extrasId: DocumentReference<TripExtra>;
    quantity?: number;
}
import { Injectable } from '@angular/core';
import { TripExtra } from '../../types/booking';
import {
  Firestore,
  getDocs,
  where,
  query,
  addDoc,
  collection,
} from '@angular/fire/firestore';
import { TransportationType } from '../../types/trips';

@Injectable({
  providedIn: 'root',
})
export class TripExtrasService {
  private readonly COLLECTION_NAME = 'trip-extras';

  constructor(private firestore: Firestore) {}

  async getAllExtras(): Promise<TripExtra[]> {
    const tripExtrasRef = collection(this.firestore, this.COLLECTION_NAME);
    const tripExtrasSnapshot = await getDocs(tripExtrasRef);
    return tripExtrasSnapshot.docs.map((doc) => ({
      extrasId: doc.id,
      ...(doc.data() as Omit<TripExtra, 'extrasId'>),
    })) as TripExtra[];
  }
  async getExtrasByTransport(
    transportationType: TransportationType
  ): Promise<TripExtra[]> {
    const tripExtrasRef = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(
      tripExtrasRef,
      where('transportationType', 'array-contains', transportationType)
    );
    const tripExtrasSnapshot = await getDocs(q);
    return tripExtrasSnapshot.docs.map((doc) => ({
      extrasId: doc.id,
      ...(doc.data() as Omit<TripExtra, 'extrasId'>),
    })) as TripExtra[];
  }

  async addTestData() {
    const tripExtrasRef = collection(this.firestore, this.COLLECTION_NAME);

    const testData = [
      {
        extrasName: 'Meal',
        extrasPrice: 50,
        isQuantifiable: true,
        transportationType: [
          TransportationType.Flight,
          TransportationType.Train,
        ],
      },
      {
        extrasName: 'Extra Baggage',
        extrasPrice: 100,
        isQuantifiable: true,
        transportationType: [TransportationType.Flight],
      },
      {
        extrasName: 'Priority Boarding',
        extrasPrice: 75,
        isQuantifiable: false,
        transportationType: [
          TransportationType.Flight,
          TransportationType.Train,
        ],
      },
      {
        extrasName: 'WiFi Access',
        extrasPrice: 30,
        isQuantifiable: false,
        transportationType: [TransportationType.Train, TransportationType.Bus],
      },
      {
        extrasName: 'Comfort Seat',
        extrasPrice: 60,
        isQuantifiable: true,
        transportationType: [TransportationType.Bus, TransportationType.Car],
      },
    ];

    for (const extra of testData) {
      await addDoc(tripExtrasRef, extra);
    }
  }
}

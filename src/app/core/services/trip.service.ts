import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp} from '@angular/fire/firestore';
import { Trip, TripSearchRequest, TransportationType } from '../../types/trips';


@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly COLLECTION_NAME = 'trips';

  constructor(private firestore: Firestore) {}

  async searchTrips(searchRequest: TripSearchRequest): Promise<Trip[]> {
    const tripsRef = collection(this.firestore, this.COLLECTION_NAME);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = searchRequest.departureDate.getFullYear();
    const month = pad(searchRequest.departureDate.getMonth() + 1);
    const day = pad(searchRequest.departureDate.getDate());
    const searchDateString = `${year}-${month}-${day}`;

    const firstQuery = query(
      tripsRef,
      where('source', '==', searchRequest.source.toLowerCase()),
      where('destination', '==', searchRequest.destination.toLowerCase()),
      where('departureDateString', '==', searchDateString)
    );
      
    let secondQuery = query(tripsRef, where('id', '==', 'none'));
    if (searchRequest.tripType === 'round-trip' && searchRequest.returnDate) {
      const returnYear = searchRequest.returnDate.getFullYear();
      const returnMonth = pad(searchRequest.returnDate.getMonth() + 1);
      const returnDay = pad(searchRequest.returnDate.getDate());
      const returnDateString = `${returnYear}-${returnMonth}-${returnDay}`;
      secondQuery = query(
        tripsRef,
        where('source', '==', searchRequest.destination.toLowerCase()),
        where('destination', '==', searchRequest.source.toLowerCase()),
        where('departureDateString', '==', returnDateString)
      );
    }

    const firstQuerySnapshot = await getDocs(firstQuery);
    const secondQuerySnapshot = await getDocs(secondQuery);
    return [
      ...firstQuerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Trip, 'id'>)
      })),
      ...secondQuerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Trip, 'id'>)
      }))
    ];
  }

  
  async getTripById(id: string): Promise<Trip | null> {
    const tripRef = doc(this.firestore, this.COLLECTION_NAME, id);
    const tripSnap = await getDoc(tripRef);

    if (tripSnap.exists()) {
      return {
        id: tripSnap.id,
        ...tripSnap.data()
      } as Trip;
    }
    return null;
  }

  async addTrip(trip: Omit<Trip, 'id'>): Promise<Trip> {
    const tripsRef = collection(this.firestore, this.COLLECTION_NAME);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = trip.departureDate.getFullYear();
    const month = pad(trip.departureDate.getMonth() + 1);
    const day = pad(trip.departureDate.getDate());
    const departureDateString = `${year}-${month}-${day}`;
    const docRef = await addDoc(tripsRef, {
      ...trip,
      departureDateString,
      source: trip.source.toLowerCase(),
      destination: trip.destination.toLowerCase(),
      transportationType: trip.transportationType || TransportationType.Bus,
      createdAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...trip
    } as Trip;
  }

 
  async updateTrip(id: string, tripData: Partial<Trip>): Promise<void> {
    const tripRef = doc(this.firestore, this.COLLECTION_NAME, id);
    
    const updatedData = {
      ...tripData,
      source: tripData.source?.toLowerCase(),
      destination: tripData.destination?.toLowerCase(),
      transportationType: tripData.transportationType || TransportationType.Bus,
      updatedAt: Timestamp.now()
    };

    await updateDoc(tripRef, updatedData);
  }

  async deleteTrip(id: string): Promise<void> {
    const tripRef = doc(this.firestore, this.COLLECTION_NAME, id);
    await deleteDoc(tripRef);
  }

  async getAllTrips(filters?: Partial<Trip>): Promise<Trip[]> {
    const tripsRef = collection(this.firestore, this.COLLECTION_NAME);
    let q = query(tripsRef);

    if (filters) {
      const conditions = Object.entries(filters).map(([key, value]) => 
        where(key, '==', typeof value === 'string' ? value.toLowerCase() : value)
      );
      q = query(tripsRef, ...conditions);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Trip));
  }
} 
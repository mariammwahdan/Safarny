// firebase-auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, UserCredential, signInWithEmailAndPassword,
  signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, deleteDoc, query, where, DocumentReference } from '@angular/fire/firestore';
import { User } from '../../types/user';
import { BookingWithTrip } from '../../types/booking';
import { Trip } from '../../types/trips';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async signup(user: User): Promise<UserCredential> {
    const email = user.email!;
    const password = user.password!;

    const userCred = await createUserWithEmailAndPassword(this.auth, email, password);

    const userDocRef = doc(this.firestore, `users/${userCred.user.uid}`);
    await setDoc(userDocRef, {
      uid: userCred.user.uid,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      gender: user.gender ?? null,
      birthDate: user.birthDate ?? null,
      role: user.role ?? 'user',
      createdAt: new Date()
    });

    return userCred;
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    return await signOut(this.auth);
  }

  async getUserData(uid: string): Promise<User | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) return null;

    const userData = userSnap.data() as User;
    localStorage.setItem('user', JSON.stringify(userData));

    return userData;
  }

  async updateUserData(uid: string, data: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const updateData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    await updateDoc(userRef, updateData);

    const updatedUser = await this.getUserData(uid);
    if (updatedUser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }

  async getCurrentUserId(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  async getAllUsers(): Promise<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const users: User[] = [];

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        firstname: data['firstname'] || '',
        lastname: data['lastname'] || '',
        email: data['email'] || '',
        phone: data['phone'] || '',
        gender: data['gender'] || '',
        birthDate: data['birthDate'] || '',
        role: data['role'] || 'user'
      });
    });

    return users;
  }

  async deleteUser(uid: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    await deleteDoc(userDoc);
  }
  async getUserBookings(uid: string): Promise<BookingWithTrip[]> {
  const bookingsCollection = collection(this.firestore, 'bookings');
  const q = query(bookingsCollection, where('userid', '==', uid));
  const bookingsSnapshot = await getDocs(q);

  const bookings: BookingWithTrip[] = [];

  for (const bookingDoc of bookingsSnapshot.docs) {
    const bookingData = bookingDoc.data();

const tripRef = doc(
      this.firestore,
      'trips',
      bookingData['tripid']
    ) as DocumentReference<Trip>;
    const tripSnap = await getDoc(tripRef);

    if (tripSnap.exists()) {
      bookings.push({
        bookingId: bookingDoc.id,
        booking: {
          userid: bookingData['userid'],
          tripid: tripRef,
          numberOfSeats: bookingData['numberOfSeats'],
          selectedExtras: bookingData['selectedExtras'],
          selectedSeats: bookingData['selectedSeats'],
          totalPrice: bookingData['totalPrice'],

        },
        trip: tripSnap.data() as Trip,
      });
    }
  }

  return bookings;
}

}



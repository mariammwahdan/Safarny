// firebase-auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, UserCredential,signInWithEmailAndPassword,
  signOut, } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { User } from '../../types/user';

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
  async getUserData(uid: string): Promise<any> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userDocRef);
    return userSnap.exists() ? userSnap.data() : null;
  }
  async updateUserData(uid: string, data: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, data);
  }
}

import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  constructor(private firestore: Firestore) {}

  async getAllUsers(): Promise<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        firstname: data['firstname'] || '',
        lastname: data['lastname'] || '',
        email: data['email'] || '',
        phone: data['phone'] || '',
        birthDate: data['birthDate'] || null,
        gender: data['gender'] || null
      } as User;
    });
  }

  async updateUser(uid: string, data: Partial<User>): Promise<void> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    await updateDoc(userDoc, data);
  }

  async deleteUser(uid: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    await deleteDoc(userDoc);
  }
} 
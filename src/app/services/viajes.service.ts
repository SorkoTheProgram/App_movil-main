import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Viaje } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ViajesService {
  constructor(private firestore: AngularFirestore) {}

  getHistorialViajes(email: string): Observable<Viaje[]> {
    return this.firestore
      .collection<Viaje>('viajes', (ref) =>
        ref.where('pasajeros', 'array-contains', email)
      )
      .valueChanges();
  }
}

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Viaje } from 'src/app/models/models'; // Ruta a tu modelo de Viaje

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.page.html',
  styleUrls: ['./mis-viajes.page.scss'],
})
export class MisViajesPage implements OnInit {
  viajes: Viaje[] = []; // Lista de viajes creados por el usuario
  userEmail: string | null = null; // Email del usuario logueado

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    // Obtener el correo del usuario logueado
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userEmail = user.email; // Guardar el email del usuario logueado
        this.cargarMisViajes();
      }
    });
  }

  cargarMisViajes() {
    if (!this.userEmail) return;

    // Cargar los viajes donde el creador es el usuario logueado
    this.firestore
      .collection('viajes', (ref) => ref.where('creadorEmail', '==', this.userEmail))
      .snapshotChanges()
      .subscribe((data) => {
        this.viajes = data.map((e) => {
          const viaje = e.payload.doc.data() as Viaje;
          viaje.id = e.payload.doc.id; // Obtener el ID del viaje
          return viaje;
        });
      });
  }
}

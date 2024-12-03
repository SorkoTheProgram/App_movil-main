import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Viaje } from '../../models/models'; // Ruta a tu archivo de modelos

@Component({
  selector: 'app-viajes-disponibles',
  templateUrl: './viajes-disponibles.page.html',
  styleUrls: ['./viajes-disponibles.page.scss'],
})
export class ViajesDisponiblesPage implements OnInit {
  viajes: Viaje[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    // Cargar los viajes disponibles desde Firebase
    this.firestore.collection('viajes', ref => ref.where('estado', '==', 'disponible')).snapshotChanges().subscribe(data => {
      this.viajes = data.map(e => {
        const viaje = e.payload.doc.data() as Viaje;
        viaje.id = e.payload.doc.id;  // Accedemos al ID del viaje

        // No necesitamos hacer ninguna conversión de fecha, ya que ahora es un string
        return viaje;
      });
    });
  }

  solicitarViaje(viaje: Viaje) {
    // Lógica para solicitar un viaje
    console.log('Viaje solicitado:', viaje);
  }
}

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Viaje } from '../../models/models'; // Ruta al modelo de Viaje

@Component({
  selector: 'app-viajes-disponibles',
  templateUrl: './viajes-disponibles.page.html',
  styleUrls: ['./viajes-disponibles.page.scss'],
})
export class ViajesDisponiblesPage implements OnInit {
  viajes: Viaje[] = [];
  userEmail: string | null = null;
  loading: boolean = false; // Bandera para controlar el indicador de carga
  disablingButtons: boolean = false; // Bandera para desactivar temporalmente los botones

  constructor(
    private firestore: AngularFirestore, 
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    // Obtener el email del usuario autenticado
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.userEmail = user.email;
      }
    });

    // Cargar los viajes disponibles desde Firebase
    this.firestore
      .collection('viajes', (ref) => ref.where('estado', '==', 'disponible'))
      .snapshotChanges()
      .subscribe((data) => {
        this.viajes = data.map((e) => {
          const viaje = e.payload.doc.data() as Viaje;
          viaje.id = e.payload.doc.id; // Obtener el ID del viaje
          return viaje;
        });
      });
  }

  // Verificar si el usuario está intentando unirse a su propio viaje o ya está en el viaje
  isUserInTravel(viaje: Viaje) {
    return viaje.pasajeros.includes(this.userEmail) || viaje.creadorEmail === this.userEmail;
  }

  // Método para solicitar unirse a un viaje
  async solicitarViaje(viaje: Viaje) {
    if (!this.userEmail) {
      console.error('Usuario no autenticado');
      return;
    }

    this.loading = true; // Mostrar indicador de carga
    this.disablingButtons = true; // Desactivar temporalmente los botones

    try {
      const viajeRef = this.firestore.collection('viajes').doc(viaje.id);
      const viajeDoc = await viajeRef.get().toPromise();
      const viajeData = viajeDoc?.data() as Viaje;

      // Verificar si el usuario ya está en el viaje o es el creador
      if (viajeData.pasajeros.includes(this.userEmail)) {
        console.log('Ya estás unido a este viaje.');
        return;
      }

      if (viajeData.creadorEmail === this.userEmail) {
        console.log('No puedes unirte a tu propio viaje.');
        return;
      }

      // Verificar si hay asientos disponibles
      if (viajeData.asientos <= 0) {
        console.log('El viaje está lleno.');
        alert('No hay asientos disponibles en este viaje.');
        return;
      }

      // Reducir el número de asientos disponibles
      await viajeRef.update({
        pasajeros: [...viajeData.pasajeros, this.userEmail],
        asientos: viajeData.asientos - 1, // Decrementar los asientos disponibles
      });

      console.log('Te has unido al viaje con éxito.');

      // Guardar en localStorage (si lo deseas)
      let viajesGuardados = JSON.parse(localStorage.getItem('viajesActuales') || '[]');
      viajesGuardados.push(viaje);
      localStorage.setItem('viajesActuales', JSON.stringify(viajesGuardados));

    } catch (error) {
      console.error('Error al unirse al viaje:', error);
    } finally {
      this.loading = false; // Ocultar indicador de carga
      this.disablingButtons = false; // Reactivar botones
    }
  }
}

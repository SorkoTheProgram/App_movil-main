import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Viaje } from '../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viajes-disponibles',
  templateUrl: './viajes-disponibles.page.html',
  styleUrls: ['./viajes-disponibles.page.scss'],
})
export class ViajesDisponiblesPage implements OnInit {
  viajes: Viaje[] = [];
  userEmail: string | null = null;
  loading: boolean = false;
  disablingButtons: boolean = false;

  constructor(
    private firestore: AngularFirestore, 
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.userEmail = user.email;
      }
    });

    this.firestore
      .collection('viajes', (ref) => ref.where('estado', '==', 'disponible'))
      .snapshotChanges()
      .subscribe((data) => {
        this.viajes = data.map((e) => {
          const viaje = e.payload.doc.data() as Viaje;
          viaje.id = e.payload.doc.id;
          return viaje;
        });
      });
  }

  isUserInTravel(viaje: Viaje) {
    return viaje.pasajeros.includes(this.userEmail) || viaje.creadorEmail === this.userEmail;
  }

  async solicitarViaje(viaje: Viaje) {
    if (!this.userEmail) {
      console.error('Usuario no autenticado');
      return;
    }

    this.loading = true;
    this.disablingButtons = true;

    try {
      const viajeRef = this.firestore.collection('viajes').doc(viaje.id);
      const viajeDoc = await viajeRef.get().toPromise();
      const viajeData = viajeDoc?.data() as Viaje;

      if (viajeData.pasajeros.includes(this.userEmail)) {
        console.log('Ya estás unido a este viaje.');
        return;
      }

      if (viajeData.creadorEmail === this.userEmail) {
        console.log('No puedes unirte a tu propio viaje.');
        return;
      }

      if (viajeData.asientos <= 0) {
        console.log('El viaje está lleno.');
        alert('No hay asientos disponibles en este viaje.');
        return;
      }

      await viajeRef.update({
        pasajeros: [...viajeData.pasajeros, this.userEmail],
        asientos: viajeData.asientos - 1,
      });

      console.log('Te has unido al viaje con éxito.');

      // Guardar en localStorage el viaje para llevarlo a la página de pago
      localStorage.setItem('viajeSeleccionado', JSON.stringify(viaje));

      // Redirigir a la página de pago
      this.router.navigate(['/pago']);
    } catch (error) {
      console.error('Error al unirse al viaje:', error);
    } finally {
      this.loading = false;
      this.disablingButtons = false;
    }
  }

  verEnMapa(viaje: Viaje) {
    const coordenadas = viaje.coordenadas;
    localStorage.setItem('coordenadasViaje', JSON.stringify(coordenadas));
    this.router.navigate(['/mapa']);
  }

  irAPago(viaje: Viaje) {
    // Este método redirige a la página de pago y guarda el viaje seleccionado en localStorage
    localStorage.setItem('viajeSeleccionado', JSON.stringify(viaje));
    this.router.navigate(['/pago']);
  }
}

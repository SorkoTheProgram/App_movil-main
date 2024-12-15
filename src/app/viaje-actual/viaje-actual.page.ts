import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Viaje } from 'src/app/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viaje-actual',
  templateUrl: './viaje-actual.page.html',
  styleUrls: ['./viaje-actual.page.scss'],
})
export class ViajeActualPage implements OnInit {
  userEmail: string | null = null;
  viajesActuales: Viaje[] = [];
  loading: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.userEmail = user.email;
        this.cargarViajesActuales();
      }
    });
  }

  cargarViajesActuales() {
    if (!this.userEmail) return;

    this.loading = true;

    this.firestore
      .collection('viajes', (ref) =>
        ref.where('pasajeros', 'array-contains', this.userEmail)
      )
      .snapshotChanges()
      .subscribe(
        (data) => {
          const viajes = data.map((e) => {
            const viaje = e.payload.doc.data() as Viaje;
            viaje.id = e.payload.doc.id;
            return viaje;
          });

          // Actualizamos los datos locales
          this.viajesActuales = viajes;
          this.loading = false;

          // Guardamos en localStorage
          localStorage.setItem(
            'viajesActuales',
            JSON.stringify(this.viajesActuales)
          );
        },
        (error) => {
          console.error('Error al cargar los viajes actuales:', error);

          // Si hay error, intentamos cargar desde localStorage
          const datosGuardados = localStorage.getItem('viajesActuales');
          if (datosGuardados) {
            this.viajesActuales = JSON.parse(datosGuardados);
            console.log('Cargado desde localStorage debido a error en el servidor.');
          } else {
            this.viajesActuales = [];
            console.log('No hay datos guardados en localStorage.');
          }
          this.loading = false;
          const viajesGuardados = JSON.parse(localStorage.getItem('viajesActuales') || '[]');
          this.viajesActuales = viajesGuardados;
        }
      );
  }

  async confirmarCancelacion(viaje: Viaje) {
    const alert = await this.alertController.create({
      header: 'Cancelar Viaje',
      message: `¿Estás seguro que deseas cancelar tu participación en el viaje a ${viaje.destino}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            this.cancelarViaje(viaje);
          },
        },
      ],
    });

    await alert.present();
  }

  cancelarViaje(viaje: Viaje) {
    if (!this.userEmail) return;

    this.loading = true;

    const viajeRef = this.firestore.collection('viajes').doc(viaje.id);
    viajeRef
      .update({
        pasajeros: viaje.pasajeros.filter((email) => email !== this.userEmail),
      })
      .then(() => {
        console.log(`Has cancelado tu participación en el viaje a ${viaje.destino}`);
        const viajesGuardados = JSON.parse(localStorage.getItem('viajesActuales') || '[]');
        const index = viajesGuardados.findIndex((v: Viaje) => v.id === viaje.id);
        if (index > -1) {
          viajesGuardados.splice(index, 1);
        }
        localStorage.setItem('viajesActuales', JSON.stringify(viajesGuardados));
        this.cargarViajesActuales();
      })
      .catch((error) => {
        console.error('Error al cancelar el viaje:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  // Nueva función para ver el viaje en el mapa
  verEnMapa(viaje: Viaje) {
    console.log('Coordenadas del viaje:', viaje.coordenadas);
    const coordenadasViaje = {
      latitud: viaje.coordenadas.latitud,  // Acceder a latitud
      longitud: viaje.coordenadas.longitud, // Acceder a longitud
    };
  
    if (coordenadasViaje.latitud && coordenadasViaje.longitud) {
      localStorage.setItem('coordenadasViaje', JSON.stringify(coordenadasViaje));
      this.router.navigate(['/mapa']);  // <-- Aquí rediriges a la página del mapa
    } else {
      console.error('Coordenadas no válidas');
    }
  }
}
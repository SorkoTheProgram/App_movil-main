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
      } else {
        // Modo offline: Obtener el email desde localStorage
        const storedCredentials = JSON.parse(localStorage.getItem('userCredentials') || '{}');
        if (storedCredentials.email) {
          this.userEmail = storedCredentials.email;
          this.cargarViajesActualesOffline();
        } else {
          console.error('No se encontraron credenciales offline.');
        }
      }
    });
  }
  
  cargarViajesActualesOffline() {
    const datosGuardados = localStorage.getItem('viajesActuales');
    if (datosGuardados) {
      this.viajesActuales = JSON.parse(datosGuardados);
      console.log('Viajes cargados offline desde localStorage:', this.viajesActuales);
    } else {
      console.log('No hay viajes guardados en localStorage.');
      this.viajesActuales = [];
    }
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
          console.log('Viajes cargados desde Firestore:', this.viajesActuales);

          // Guardamos en localStorage
          localStorage.setItem(
            'viajesActuales',
            JSON.stringify(this.viajesActuales)
          );
          console.log('Viajes guardados en localStorage.');
          this.loading = false;
        },
        (error) => {
          console.error('Error al cargar los viajes actuales:', error);

          // Si hay error, intentamos cargar desde localStorage
          const datosGuardados = localStorage.getItem('viajesActuales');
          if (datosGuardados) {
            this.viajesActuales = JSON.parse(datosGuardados);
            console.log('Viajes cargados desde localStorage debido a error en el servidor:', this.viajesActuales);
          } else {
            this.viajesActuales = [];
            console.log('No hay datos guardados en localStorage.');
          }
          this.loading = false;
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
        console.log('Viaje actualizado en localStorage tras cancelación:', viajesGuardados);
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
      latitud: viaje.coordenadas.latitud,
      longitud: viaje.coordenadas.longitud,
    };

    if (coordenadasViaje.latitud && coordenadasViaje.longitud) {
      localStorage.setItem('coordenadasViaje', JSON.stringify(coordenadasViaje));
      console.log('Coordenadas guardadas en localStorage:', coordenadasViaje);
      this.router.navigate(['/mapa']);
    } else {
      console.error('Coordenadas no válidas');
    }
  }
}

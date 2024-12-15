import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Viaje } from 'src/app/models/models';

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
    private alertController: AlertController
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

  async cancelarViaje(viaje: Viaje) {
    if (!this.userEmail) return;

    this.loading = true;

    const viajeRef = this.firestore.collection('viajes').doc(viaje.id);
    const pasajerosActualizados = viaje.pasajeros.filter(
      (email) => email !== this.userEmail
    );
    const asientosDisponiblesActualizados = viaje.asientos + 1;

    try {
      await viajeRef.update({
        pasajeros: pasajerosActualizados,
        asientos: asientosDisponiblesActualizados,
      });

      console.log(`Has cancelado tu participación en el viaje a ${viaje.destino}`);

      // Actualizamos los datos locales
      this.viajesActuales = this.viajesActuales.filter((v) => v.id !== viaje.id);

      // Guardamos en localStorage
      localStorage.setItem(
        'viajesActuales',
        JSON.stringify(this.viajesActuales)
      );

      this.cargarViajesActuales();
    } catch (error) {
      console.error('Error al cancelar el viaje:', error);
    } finally {
      this.loading = false;
    }
  }
}

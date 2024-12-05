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

  // Cargar los viajes en los que el usuario está como pasajero
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
          this.viajesActuales = data.map((e) => {
            const viaje = e.payload.doc.data() as Viaje;
            viaje.id = e.payload.doc.id;
            return viaje;
          });
          this.loading = false;
        },
        (error) => {
          console.error('Error al cargar los viajes actuales:', error);
          this.loading = false;
        }
      );
  }

  // Confirmar cancelación de un viaje
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

  // Cancelar la participación en un viaje
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
        this.cargarViajesActuales();
      })
      .catch((error) => {
        console.error('Error al cancelar el viaje:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}

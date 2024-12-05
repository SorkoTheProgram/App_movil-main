import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Viaje } from 'src/app/models/models';

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.page.html',
  styleUrls: ['./mis-viajes.page.scss'],
})
export class MisViajesPage implements OnInit {
  viajes: Viaje[] = []; // Lista de viajes creados por el usuario
  userEmail: string | null = null; // Email del usuario logueado
  loading: boolean = false; // Indicador de carga

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userEmail = user.email; // Guardar el email del usuario logueado
        this.cargarMisViajes();
      }
    });
  }

  cargarMisViajes() {
    if (!this.userEmail) return;

    this.loading = true; // Mostrar el indicador de carga
    this.firestore
      .collection('viajes', (ref) => ref.where('creadorEmail', '==', this.userEmail))
      .snapshotChanges()
      .subscribe(
        (data) => {
          this.viajes = data.map((e) => {
            const viaje = e.payload.doc.data() as Viaje;
            viaje.id = e.payload.doc.id; // Obtener el ID del viaje
            return viaje;
          });
          this.loading = false; // Ocultar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar los viajes:', error);
          this.loading = false;
        }
      );
  }

  async confirmarCancelacion(viaje: Viaje) {
    const alert = await this.alertController.create({
      header: 'Cancelar Viaje',
      message: `¿Estás seguro de que deseas cancelar el viaje a ${viaje.destino}?`,
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
    this.loading = true; // Mostrar el indicador de carga
    this.firestore
      .collection('viajes')
      .doc(viaje.id)
      .delete()
      .then(() => {
        console.log(`Viaje a ${viaje.destino} cancelado.`);
        this.cargarMisViajes(); // Recargar los viajes después de eliminar uno
      })
      .catch((error) => {
        console.error('Error al cancelar el viaje:', error);
      })
      .finally(() => {
        this.loading = false; // Ocultar el indicador de carga
      });
  }
}

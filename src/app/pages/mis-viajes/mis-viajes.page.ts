import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetallesViajeModalPage } from '../../detalles-viaje-modal/detalles-viaje-modal.page'; // Importa tu modal

// Definir la interfaz para un viaje
interface Viaje {
  origen: string;
  destino: string;
  fecha: string;
  costo: number;
  conductor?: string;
  vehiculo?: string;
}

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.page.html',
  styleUrls: ['./mis-viajes.page.scss'],
})
export class MisViajesPage {
  // Viajes programados
  viajesProgramados: Viaje[] = [
    {
      origen: 'Campus Plaza Oeste',
      destino: 'Casa',
      fecha: '2024-09-25',
      costo: 2000,
      conductor: 'Juan Pérez',
      vehiculo: 'Toyota Prius'
    },
    {
      origen: 'Campus Plaza Oeste',
      destino: 'Centro',
      fecha: '2024-09-26',
      costo: 1500,
      conductor: 'María Gómez',
      vehiculo: 'Honda Civic'
    },
  ];

  // Viajes finalizados
  viajesFinalizados: Viaje[] = [
    {
      origen: 'Campus San Joaquín',
      destino: 'Casa',
      fecha: '2023-09-15',
      costo: 1200,
      conductor: 'Carlos Soto',
      vehiculo: 'Chevrolet Spark'
    },
    {
      origen: 'Campus Alameda',
      destino: 'Centro',
      fecha: '2023-09-12',
      costo: 1800,
      conductor: 'Ana Ruiz',
      vehiculo: 'Ford Focus'
    },
  ];

  constructor(private modalController: ModalController) {}

  // Función para abrir el modal de detalles
  async verDetalles(viaje: Viaje) {
    const modal = await this.modalController.create({
      component: DetallesViajeModalPage,
      componentProps: {
        viaje: viaje // Pasamos el objeto del viaje al modal
      }
    });

    return await modal.present();
  }
}

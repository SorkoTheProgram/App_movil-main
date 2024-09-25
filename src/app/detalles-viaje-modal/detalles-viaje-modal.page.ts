import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalles-viaje-modal',
  templateUrl: './detalles-viaje-modal.page.html',
  styleUrls: ['./detalles-viaje-modal.page.scss'],
})
export class DetallesViajeModalPage {
  // Recibir los datos del viaje
  @Input() viaje: any;

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss(); // Cerrar el modal
  }
}

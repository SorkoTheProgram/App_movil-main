import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesViajeModalPageRoutingModule } from './detalles-viaje-modal-routing.module';

import { DetallesViajeModalPage } from './detalles-viaje-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesViajeModalPageRoutingModule
  ],
  declarations: [DetallesViajeModalPage]
})
export class DetallesViajeModalPageModule {}

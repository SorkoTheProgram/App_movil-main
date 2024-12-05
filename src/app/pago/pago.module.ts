import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagoPage } from './pago.page';
import { PagoPageRoutingModule } from './pago-routing.module';
import { ReactiveFormsModule } from '@angular/forms'; // IMPORTANTE: IMPORTAR ReactiveFormsModule AQUÍ

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoPageRoutingModule,
    ReactiveFormsModule,  // Asegúrate de que ReactiveFormsModule esté importado aquí
  ],
  declarations: [PagoPage]
})
export class PagoPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajeEnCursoPageRoutingModule } from './viaje-en-curso-routing.module';

import { ViajeEnCursoPage } from './viaje-en-curso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajeEnCursoPageRoutingModule
  ],
  declarations: [ViajeEnCursoPage]
})
export class ViajeEnCursoPageModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ViajesDisponiblesPageRoutingModule } from './viajes-disponibles-routing.module';
import { ViajesDisponiblesPage } from './viajes-disponibles.page';

const routes: Routes = [
  {
    path: '',
    component: ViajesDisponiblesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ViajesDisponiblesPageRoutingModule
  ],
  declarations: [ViajesDisponiblesPage]
})
export class ViajesDisponiblesPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesViajeModalPage } from './detalles-viaje-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesViajeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesViajeModalPageRoutingModule {}

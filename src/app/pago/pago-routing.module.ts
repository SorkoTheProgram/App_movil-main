import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagoPage } from './pago.page'; // Este import debe funcionar

const routes: Routes = [
  {
    path: '',
    component: PagoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagoPageRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path:'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'mis-viajes',
    loadChildren: () => import('./pages/mis-viajes/mis-viajes.module').then( m => m.MisViajesPageModule)
  },
  {
    path: 'detalles-viaje-modal',
    loadChildren: () => import('./detalles-viaje-modal/detalles-viaje-modal.module').then( m => m.DetallesViajeModalPageModule)
  },
  {
    path: 'viajes-disponibles',
    loadChildren: () => import('./pages/viajes-disponibles/viajes-disponibles.module').then(m => m.ViajesDisponiblesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

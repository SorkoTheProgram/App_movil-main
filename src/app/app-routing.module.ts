import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ViajeEnCursoPage } from './pages/viaje-en-curso/viaje-en-curso.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'inicio-sesion',  
    pathMatch: 'full'
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  
  {
    path: 'detalles-viaje-modal',
    loadChildren: () => import('./detalles-viaje-modal/detalles-viaje-modal.module').then(m => m.DetallesViajeModalPageModule)
  },
  {
    path: 'viajes-disponibles',
    loadChildren: () => import('./pages/viajes-disponibles/viajes-disponibles.module').then(m => m.ViajesDisponiblesPageModule)
  },
  {
    path: 'programar-viaje',
    loadChildren: () => import('./pages/programar-viaje/programar-viaje.module').then(m => m.ProgramarViajePageModule)
  },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then(m => m.InicioSesionPageModule)
  },
  {
    path: 'registrarse',
    loadChildren: () => import('./pages/registrarse/registrarse.module').then(m => m.RegistrarsePageModule)
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./pages/editar-perfil/editar-perfil.module').then(m => m.EditarPerfilPageModule)
  },
  {
    path: 'reestablecer',
    loadChildren: () => import('./pages/reestablecer/reestablecer.module').then(m => m.ReestablecerPageModule)
  },
  {
    path: 'viaje-en-curso/:id',  // Ruta con parámetro de ID
    loadChildren: () => import('./pages/viaje-en-curso/viaje-en-curso.module').then(m => m.ViajeEnCursoPageModule)
  },   {
    path: 'mis-viajes',
    loadChildren: () => import('./pages/mis-viajes/mis-viajes.module').then( m => m.MisViajesPageModule)
  },


  /* {
    path: 'viaje-en-curso/:id',  // Ruta con parámetro de ID
    component: ViajeEnCursoPage
  }, */

  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

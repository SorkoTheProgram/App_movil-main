import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { RegistrarsePageRoutingModule } from './registrarse-routing.module';
import { RegistrarsePage } from './registrarse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Agrega ReactiveFormsModule aquí
    IonicModule,
    RegistrarsePageRoutingModule
  ],
  declarations: [RegistrarsePage]
})
export class RegistrarsePageModule {}

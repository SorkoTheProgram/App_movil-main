import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  fechaNacimiento: string = '';

  constructor(private navCtrl: NavController) {}

  onSubmit() {
    console.log('Nombre:', this.nombre);
    console.log('Apellido:', this.apellido);
    console.log('Correo:', this.email);
    console.log('Fecha de Nacimiento:', this.fechaNacimiento);
    // Aquí puedes agregar lógica para enviar estos datos a una API o guardarlos localmente
  }

  volveraHome() {
    this.navCtrl.navigateBack('/home'); 
  }
  
}







import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  telefono: string = '';
  direccion: string = '';

  constructor(private navCtrl: NavController, private alertController: AlertController) {}

  onSubmit() {
    console.log('Nombre:', this.nombre);
    console.log('Apellido:', this.apellido);
    console.log('Correo Electrónico:', this.email);
    console.log('Teléfono:', this.telefono);
    console.log('Dirección:', this.direccion);
    
  }

  async guardarCambios() {
  
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Los cambios han sido guardados exitosamente.',
      buttons: ['OK']
    });

    await alert.present();
  }
  volveraHome() {
    this.navCtrl.navigateBack('/home'); 
  }
}

import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage {
  usuario: string = '';
  password: string = '';

  constructor(private navCtrl: NavController, private alertController: AlertController) {}

  async login() {
    if (this.usuario === 'admin' && this.password === '123456') {
      
      this.navCtrl.navigateForward('/home');
    } else {
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  volveraHome() {
    this.navCtrl.navigateBack('/home'); 
  }
}

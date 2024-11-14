import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {
  usuario: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private menuController: MenuController // Importamos MenuController
  ) {}

  ngOnInit() {
    this.menuController.enable(false); // Deshabilitar el menú al iniciar
  }

  ionViewWillLeave() {
    this.menuController.enable(true); // Habilitar el menú al salir de esta página
  }

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

  restablecerContrasena() {
    this.navCtrl.navigateForward('/reestablecer');
  }

  volveraHome() {
    this.navCtrl.navigateBack('/home'); 
  }
}

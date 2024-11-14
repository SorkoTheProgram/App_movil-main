import { Component } from '@angular/core';
import { AuthService } from './services/auth.service'; // Ajusta la ruta si es necesario
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authSvc: AuthService,
    private navCtrl: NavController
  ) {}

  async cerrarSesion() {
    try {
      await this.authSvc.cerrarSesion(); // Llama al método de cierre de sesión del servicio
      this.navCtrl.navigateRoot('/inicio-sesion'); // Redirige a la página de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Opcional: Mostrar un mensaje de error al usuario
    }
  }
}

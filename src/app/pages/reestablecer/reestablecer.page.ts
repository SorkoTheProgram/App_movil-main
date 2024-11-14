import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { UtilsService } from '../../services/utils.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-reestablecer',
  templateUrl: './reestablecer.page.html',
  styleUrls: ['./reestablecer.page.scss'],
})
export class ReestablecerPage implements OnInit {
  
  email: string = '';

  constructor(
    private navCtrl: NavController,
    private authSvc: AuthService, // Inyecta el servicio de autenticación
    private utilsSvc: UtilsService // Inyecta el servicio de utilidades
  ) { }

  ngOnInit() {}

  volveraHome() {
    this.navCtrl.navigateBack('/inicio-sesion');
  }

  async sendResetLink() {
    if (this.email.trim() === '') {
      this.utilsSvc.mostrarToast({
        mensaje: 'Por favor, ingresa un correo válido.',
        duracion: 3000,
        color: 'warning'
      });
      return;
    }

    const loading = await this.utilsSvc.presentarCargando('Enviando enlace...');
    loading.present();

    try {
      await this.authSvc.resetPasswordEmail(this.email);
      this.utilsSvc.mostrarToast({
        mensaje: 'Posible correo de restablecimiento enviado. Revisa tu bandeja de entrada.',
        duracion: 3000,
        color: 'success'
      });
      this.volveraHome(); // Navegar de vuelta al inicio de sesión después de enviar el correo
    } catch (error: any) {
      console.error('Error al enviar el enlace de restablecimiento:', error);
      if (error.code === 'auth/user-not-found') {
        this.utilsSvc.mostrarToast({
          mensaje: 'El correo no está registrado. Verifica e intenta de nuevo.',
          duracion: 3000,
          color: 'danger'
        });
      } else {
        this.utilsSvc.mostrarToast({
          mensaje: 'Hubo un error. Verifica el correo y vuelve a intentarlo.',
          duracion: 3000,
          color: 'danger'
        });
      }
    } finally {
      loading.dismiss();
    }
  }
}

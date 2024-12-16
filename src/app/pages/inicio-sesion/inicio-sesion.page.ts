import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {
  constructor(
    private utils: UtilsService,
    private authSvc: AuthService,
    private menuCtrl: MenuController
  ) {}

  formAcceso = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  async acceder() {
    const { email, password } = this.formAcceso.value; // Obtén los valores del formulario
    const loading = await this.utils.presentarCargando('Verificando...');
    loading.present();

    try {
      // Intento de inicio de sesión online
      const user = await this.authSvc.iniciarSesion(email!, password!);
      if (user) {
        console.log('Inicio de sesión exitoso. Guardando credenciales en localStorage.');

        // Guardar las credenciales directamente en localStorage
        localStorage.setItem(
          'userCredentials',
          JSON.stringify({ email, password })
        );

        this.utils.navegarAlInicio('/home');
      }
    } catch (error) {
      console.error('Error al iniciar sesión online:', error);

      // Intentar autenticación offline
      const storedCredentials = JSON.parse(localStorage.getItem('userCredentials') || '{}');
      if (
        storedCredentials.email === email &&
        storedCredentials.password === password
      ) {
        console.log('Inicio de sesión offline exitoso.');
        this.utils.navegarAlInicio('/home');
        return;
      }

      // Mostrar error si las credenciales no coinciden
      this.utils.mostrarToast({
        icono: 'alert-circle',
        mensaje: 'Error: usuario o contraseña incorrectos.',
        color: 'danger',
        duracion: 3000,
      });
    } finally {
      loading.dismiss();
    }
  }
}

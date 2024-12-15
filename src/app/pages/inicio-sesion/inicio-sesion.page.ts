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
    const formValues = this.formAcceso.value;
    const loading = await this.utils.presentarCargando('Verificando...');
    loading.present();

    try {
      // Intento de inicio de sesión online
      const user = await this.authSvc.iniciarSesion(formValues.email!, formValues.password!);
      if (user) {
        // Guardar las credenciales en localStorage
        localStorage.setItem('userCredentials', JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }));
        this.utils.navegarAlInicio('/home');
      }
    } catch (error) {
      // Intento de inicio de sesión offline
      const storedCredentials = JSON.parse(localStorage.getItem('userCredentials') || '{}');
      if (
        storedCredentials.email === formValues.email &&
        storedCredentials.password === formValues.password
      ) {
        this.utils.navegarAlInicio('/home');
      } else {
        this.utils.mostrarToast({
          icono: 'alert-circle',
          mensaje: 'Error: usuario o contraseña incorrectos.',
          color: 'danger',
          duracion: 3000,
        });
      }
    } finally {
      loading.dismiss();
    }
  }
}

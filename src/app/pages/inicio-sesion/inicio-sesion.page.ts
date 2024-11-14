import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { MenuController } from '@ionic/angular'; // Importación de MenuController

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {
  // Constructor con inyección de servicios
  constructor(
    private utils: UtilsService,
    private authSvc: AuthService,
    private menuCtrl: MenuController // Inyección de MenuController
  ) {}

  // Formulario de acceso con validaciones
  formAcceso = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  // Método requerido por la interfaz OnInit
  ngOnInit() {}

  ionViewWillEnter() {
    // Desactiva el menú cada vez que la página se muestra
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // Activa el menú al salir de la página de inicio de sesión
    this.menuCtrl.enable(true);
  }

  // Método para iniciar sesión
  async acceder() {
    const formValues = this.formAcceso.value;
    const loading = await this.utils.presentarCargando('Verificando...');
    loading.present();

    try {
      // Intento de inicio de sesión
      const user = await this.authSvc.iniciarSesion(formValues.email!, formValues.password!);
      if (user) {
        this.utils.navegarAlInicio('/home');
      }
    } catch (error) {
      // Manejo de errores
      this.utils.mostrarToast({
        icono: 'alert-circle',
        mensaje: 'Error: usuario o contraseña incorrectos.',
        color: 'danger',
        duracion: 3000
      });
    } finally {
      // Cierre del loading
      loading.dismiss();
    }
  }
}

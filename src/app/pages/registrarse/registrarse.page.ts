import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';


@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {
  formRegistro = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private navCtrl: NavController,
    private authSvc: AuthService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {}

  validarContraseniasIguales() {
    const pass1 = this.formRegistro.value.password;
    const pass2 = this.formRegistro.value.password2;

    if (pass1 !== pass2) {
      this.formRegistro.controls.password2.setErrors({ noIguales: true });
    }
  }

  async registrarUsuario() {
    if (this.formRegistro.valid) {
      const loading = await this.utilsSvc.presentarCargando('Registrando...');
      loading.present();
      const { email, password, nombre, apellido } = this.formRegistro.value;

      try {
        const user = await this.authSvc.signUp(email!, password!, nombre!, apellido!);
        if (user) {
          this.utilsSvc.mostrarToast({
            icono: 'checkmark-circle',
            mensaje: 'Registro exitoso. Bienvenido!',
            color: 'success',
            duracion: 3000
          });
          this.navCtrl.navigateForward('/inicio-sesion');
        }
      } catch (error) {
        this.utilsSvc.mostrarToast({
          icono: 'close-circle',
          mensaje: 'Hubo un error al registrarse. Inténtalo de nuevo.',
          color: 'danger',
          duracion: 3000
        });
      } finally {
        loading.dismiss();
      }
    }
  }

  volverAInicio() {
    this.navCtrl.navigateBack('/inicio-sesion');
  }
}

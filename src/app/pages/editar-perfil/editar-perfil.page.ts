import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private authSvc: AuthService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {}

  async changePassword() {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword } = this.passwordForm.value;
    const loading = await this.utilsSvc.presentarCargando('Actualizando contraseña...');
    loading.present();

    try {
      await this.authSvc.changePassword(newPassword!, currentPassword!);
      this.utilsSvc.mostrarToast({
        mensaje: 'Contraseña actualizada con éxito',
        color: 'success',
        duracion: 2500,
      });
      this.passwordForm.reset();
      this.utilsSvc.navegarARaiz('/perfil'); // Redirigir al perfil después de cambiar la contraseña
    } catch (error) {
      this.utilsSvc.mostrarToast({
        mensaje: 'Error al cambiar la contraseña. Verifica tus datos.',
        color: 'danger',
        duracion: 2500,
      });
    } finally {
      loading.dismiss();
    }
  }

  volver() {
    this.utilsSvc.navegarARaiz('/perfil'); // Navegar de vuelta al perfil
  }
}

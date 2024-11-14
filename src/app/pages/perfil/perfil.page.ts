import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { Usuario } from 'src/app/models/models';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: Usuario | null = null;

  private authSvc = inject(AuthService);
  private utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    this.usuario = this.utilsSvc.obtenerDelLocalStorage('usuario');
    if (!this.usuario) {
      try {
        const usuarioData = await this.authSvc.obtenerDatosUsuarioActual();
        if (usuarioData) {
          this.usuario = usuarioData;
          this.utilsSvc.guardarEnLocalStorage('usuario', usuarioData);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    }
  }

  editarPerfil() {
    console.log('Editando perfil...');
  }

  cerrarSesion() {
    this.authSvc.cerrarSesion();
  }
}

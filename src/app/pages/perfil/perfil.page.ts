import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { ViajesService } from '../../services/viajes.service';
import { Usuario, Viaje } from 'src/app/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: Usuario | null = null;
  viajes: Viaje[] = [];

  private authSvc = inject(AuthService);
  private utilsSvc = inject(UtilsService);
  private viajesSvc = inject(ViajesService);

  constructor(private router: Router) {}

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
          this.cargarHistorialViajes(usuarioData.email);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    } else {
      this.cargarHistorialViajes(this.usuario.email);
    }
  }

  cargarHistorialViajes(usuarioId: string) {
    this.viajesSvc.getHistorialViajes(usuarioId).subscribe(
      (data: Viaje[]) => {
        this.viajes = data;
        // Actualizar el localStorage
        localStorage.setItem('viajesHistorial', JSON.stringify(this.viajes));
      },
      (error) => {
        console.error('Error al cargar el historial de viajes:', error);
        // Si hay error, cargar desde el localStorage
        const viajesGuardados = JSON.parse(localStorage.getItem('viajesHistorial') || '[]');
        this.viajes = viajesGuardados;
      }
    );
  }

  editarPerfil() {
    console.log('Editando perfil...');
  }

  cerrarSesion() {
    this.authSvc.cerrarSesion();
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: any;
  router: any;


  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    this.usuario = {
      nombreCompleto: 'Juan Pérez',
      email: 'juan.perez@example.com',
      telefono: '+569 1234 5678',
      vehiculo: {
        modelo: 'Toyota Corolla',
        placa: 'ABCD-123',
        espaciosDisponibles: 3
      },
      historialViajes: 15,
      calificacion: 4.5
    };
  }

  // Métodos para manejar acciones del usuario
  editarPerfil() {
    console.log('Editando perfil...');
    // Lógica para editar el perfil
  }

  cerrarSesion() {
    console.log('Cerrando sesión...');
    // Lógica para cerrar la sesión del usuario
  }

  volverHome() {
    this.navCtrl.navigateBack('/home');
  }
}
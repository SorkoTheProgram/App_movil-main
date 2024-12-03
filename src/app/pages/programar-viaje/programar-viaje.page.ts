import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Viaje } from 'src/app/models/models';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage {
  destino: string = '';
  comunaViaje: string = '';
  fecha: string;
  precio: number = 0;
  asientos: number = 0;
  modelo: string = '';
  patente: string = '';
  conductorId: string = '';

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.conductorId = user.uid; // Obtener el ID del conductor desde la autenticación
      }
    });
  }

  // Método para programar el viaje
  programarViaje() {
    const viaje: Viaje = {
      destino: this.destino,
      comunaViaje: this.comunaViaje,
      fecha: this.fecha,
      precio: this.precio,
      asientos: this.asientos,
      conductor: this.conductorId, // El ID del conductor se guarda aquí
      modelo: this.modelo,
      patente: this.patente,
      pasajeros: [], // Inicialmente no hay pasajeros
      estado: 'disponible' // El estado del viaje es 'disponible' cuando se programa
    };

    // Guardar el viaje en Firestore
    this.firestore.collection('viajes').add(viaje).then(() => {
      console.log('Viaje programado exitosamente!');
      this.router.navigate(['/home']);  // Redirigir a la página de inicio 
    }).catch((error) => {
      console.error('Error al programar el viaje:', error);
    });
  }

  // Verificar si el formulario es válido
  formValid() {
    return this.destino && this.comunaViaje && this.precio && this.asientos && this.modelo && this.patente;
  }


  volverAlHome() {
    this.router.navigate(['/home']);  // Navega a la página Home
  }
}







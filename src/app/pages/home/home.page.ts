import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth, // Inyección de AngularFireAuth
    private firestore: AngularFirestore // Inyección de AngularFirestore
  ) {}

  async ngOnInit() {
    // Verificar si hay un usuario autenticado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log('Usuario autenticado:', user.email);
      } else {
        console.log('No hay un usuario autenticado.');
      }
    });

    // Probar la conexión a Firestore
    try {
      const snapshot = await this.firestore.collection('usuarios').get().toPromise();
      if (!snapshot.empty) {
        console.log('Conexión a Firestore exitosa. Documentos obtenidos:', snapshot.docs.map(doc => doc.data()));
      } else {
        console.log('Conexión a Firestore exitosa, pero no se encontraron documentos en la colección "usuarios".');
      }
    } catch (error) {
      console.error('Error al conectar con Firestore:', error);
    }
  }

  // Función para redirigir a la página de "Pasajero"
  irAPasajero() {
    // Navegar a la página de viajes disponibles
    this.navCtrl.navigateForward('/viajes-disponibles');
  }

  // Función para redirigir a la página de "Conductor"
  irAConductor() {
    console.log('Navegando a "Programar Viaje"');
    this.router.navigate(['/programar-viaje']);
  }
}


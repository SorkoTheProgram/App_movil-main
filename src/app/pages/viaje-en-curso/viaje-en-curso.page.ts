import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Viaje } from 'src/app/models/models';
import { Router } from '@angular/router'; 
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-viaje-en-curso',
  templateUrl: './viaje-en-curso.page.html',
  styleUrls: ['./viaje-en-curso.page.scss'],
})
export class ViajeEnCursoPage implements OnInit {
  viajeId: string = '';  // Variable para almacenar el ID del viaje
  viaje: Viaje | null = null;  // Variable para almacenar los detalles del viaje

  constructor(
    private route: ActivatedRoute,  // Para acceder a los parámetros de la URL
    private firestore: AngularFirestore,  // Para interactuar con Firestore
    private navCtrl: NavController  // Para la navegación
  ) {}

  ngOnInit() {
    // Obtén el viajeId desde la URL
    this.viajeId = this.route.snapshot.paramMap.get('id')!;
    
    // Verifica si viajeId es válido
    if (!this.viajeId) {
      console.error('Error: viajeId no está definido en la URL');
      return;  // Si el ID es inválido, evita hacer la consulta
    }

    // Si el viajeId es válido, carga los detalles del viaje
    this.cargarViajeEnCurso();
  }

  // Cargar los detalles del viaje en curso
  cargarViajeEnCurso() {
    this.firestore.collection('viajes').doc(this.viajeId).get().subscribe(doc => {
      if (doc.exists) {
        this.viaje = doc.data() as Viaje;
      } else {
        console.log('Viaje no encontrado');
      }
    });
  }

  // Función para volver al home
  volverHome() {
    this.navCtrl.navigateBack('/home');  // Redirige a la página de inicio
  }
}

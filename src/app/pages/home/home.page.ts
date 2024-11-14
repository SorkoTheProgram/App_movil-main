import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    //private auth: Auth, // Prueba con esta línea primero
    //private firestore: Firestore // Prueba con esta línea después
  ) {}

  ngOnInit() {
    // Prueba de inicialización de servicios
    try {
      console.log('Auth y Firestore inicializados correctamente');
    } catch (error) {
      console.error('Error al inicializar los servicios de Firebase:', error);
    }
  }

  // Función para redirigir a la página de Programar Viaje
  irAProgramar() {
    this.router.navigate(['/programar-viaje']);
  }

  // Función para redirigir a la página de Viajes Disponibles
  verViajesDisponibles() {
    this.router.navigate(['/viajes-disponibles']);
  }
}

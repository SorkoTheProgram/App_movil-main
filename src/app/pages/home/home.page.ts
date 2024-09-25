import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Para la navegación entre páginas

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  
  constructor(private router: Router) {}

  // Función para redirigir a la página de Programar Viaje
  irAProgramar() {
    this.router.navigate(['/programar-viaje']);  // Asegúrate de tener la ruta '/programar-viaje' configurada
  }

  // Función para redirigir a la página de Viajes Disponibles
  verViajesDisponibles() {
    this.router.navigate(['/viajes-disponibles']);  // Asegúrate de tener la ruta '/viajes-disponibles' configurada
  }
}

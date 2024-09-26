import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage {
  viaje = {
    monto: null,
    capacidad: null,
    hora: '',
    fecha: ''
  };

  // Propiedades para definir el rango de fechas permitido
  fechaMin: string;
  fechaMax: string;

  constructor(private router: Router) {
    // Calculamos la fecha mínima (hoy) y la fecha máxima (una semana desde hoy)
    const hoy = new Date();
    const maxDate = new Date();
    maxDate.setDate(hoy.getDate() + 7); // Sumar 7 días

    // Convertimos las fechas a formato ISO para que ion-datetime las pueda utilizar
    this.fechaMin = hoy.toISOString().split('T')[0];  // Solo la parte de la fecha
    this.fechaMax = maxDate.toISOString().split('T')[0];
  }

  volverAlHome() {
    this.router.navigate(['/home']);  // Navega a la página Home
  }

  programarViaje() {
    console.log('Viaje programado:', this.viaje);
    alert('Viaje programado con éxito');
    this.router.navigate(['/home']);  // Después de programar el viaje, vuelve al Home
  }
}

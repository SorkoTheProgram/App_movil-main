import { Component } from '@angular/core';

interface Viaje {
  origen: string;
  destino: string;
  hora: string;
  capacidadRestante: number;
}

@Component({
  selector: 'app-viajes-disponibles',
  templateUrl: './viajes-disponibles.page.html',
  styleUrls: ['./viajes-disponibles.page.scss'],
})
export class ViajesDisponiblesPage {
  viajesDisponibles: Viaje[] = [
    {
      origen: 'Campus Plaza Oeste',
      destino: 'Centro',
      hora: '10:30 AM',
      capacidadRestante: 2
    },
    {
      origen: 'Campus San Joaquín',
      destino: 'Casa',
      hora: '11:00 AM',
      capacidadRestante: 1
    }
  ];

  constructor() {}

  unirseAlViaje(viaje: Viaje) {
    if (viaje.capacidadRestante > 0) {
      viaje.capacidadRestante -= 1;
      alert('Te has unido al viaje.');
    } else {
      alert('Este viaje no tiene más capacidad disponible.');
    }
  }
}

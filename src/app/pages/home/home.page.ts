import { Component } from '@angular/core';

interface Viaje {
  origen: string;
  destino: string;
  hora: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  viajesProntos: Viaje[] = [
    {
      origen: 'Campus Plaza Oeste',
      destino: 'Centro',
      hora: '10:30 AM'
    },
    {
      origen: 'Campus San Joaquín',
      destino: 'Casa',
      hora: '11:00 AM'
    }
  ];

  constructor() {}
}

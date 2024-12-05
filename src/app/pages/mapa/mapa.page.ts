import { Component, OnInit, AfterViewInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { Router } from '@angular/router';  // Importar el Router para redirigir
import { MapboxService } from 'src/app/services/mapbox.service';

@Component({
  selector: 'app-map',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  map: mapboxgl.Map | undefined;
  userLocation: mapboxgl.LngLat | undefined;
  inicio: [number, number];
  fin: [number, number];

  constructor(
    private mapboxService: MapboxService,
    private router: Router  // Inyectar Router para redirigir
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.inicializarMapa();
  }

  // Método para inicializar el mapa
  async inicializarMapa() {
    try {
      const mapa = await this.mapboxService.buildMap((map) => {
        console.log('Mapa cargado', map);
        
        const coordsInicioString = localStorage.getItem('coordsInicio');
        const coordsFinString = localStorage.getItem('coordsFin');
        
        if (coordsInicioString && coordsFinString) {
          const coordsInicio: [number, number] = JSON.parse(coordsInicioString);
          const coordsFin: [number, number] = JSON.parse(coordsFinString);

          this.inicio = coordsInicio;
          this.fin = coordsFin;

          // Llamar al servicio para trazar la ruta
          this.mapboxService.obtenerRuta(map, this.inicio, this.fin)
            .then(() => {
              console.log('Ruta mostrada en el mapa');
            })
            .catch((error) => {
              console.error('Error al obtener la ruta:', error);
            });
        } else {
          console.error('No se encontraron coordenadas en localStorage');
        }
      });
    } catch (error) {
      console.error('Error al inicializar el mapa', error);
    }
  }

  // Método para volver a la página de "Viajes Disponibles"
  volverAViajesDisponibles() {
    this.router.navigate(['/viajes-disponibles']);  // Redirigir a la página de Viajes Disponibles
  }
}

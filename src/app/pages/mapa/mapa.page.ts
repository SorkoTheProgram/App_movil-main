import { Component, OnInit, AfterViewInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { MapaboxService } from 'src/app/services/mapbox.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  map: mapboxgl.Map | undefined;
  userLocation: mapboxgl.LngLat | undefined;

  constructor(private mapaboxService: MapaboxService) {}
  inicio: [number, number]
  fin: [number, number]

  ngOnInit() {}

  ngAfterViewInit() {
    // Llamar al método buildMap después de que la vista haya sido cargada
    this.inicializarMapa();
  }

  // Método para inicializar el mapa
  async inicializarMapa() {
    // Crear y mostrar el cargador desde el utilsSvc
    

    try {
      // Crear el mapa
      const mapa = await this.mapaboxService.buildMap((map) => {
        // Este callback se ejecuta cuando el mapa se carga
        console.log('Mapa cargado', map);
        
        // Obtener las coordenadas desde localStorage
        const coordsInicioString = localStorage.getItem('coordsInicio');
        const coordsFinString = localStorage.getItem('coordsFin');
        
        if (coordsInicioString && coordsFinString) {
          const coordsInicio: [number, number] = JSON.parse(coordsInicioString);
          const coordsFin: [number, number] = JSON.parse(coordsFinString);

          this.inicio=coordsInicio;
          this.fin=coordsFin;

     
          // Llamar al servicio para trazar la ruta
          this.mapaboxService.obtenerRuta(map, this.inicio, this.fin)
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
}
import { inject, Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { UtilsService } from './utils.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  constructor() {
    mapboxgl.accessToken = environment.mapboxToken;
  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async obtenerRuta(mapa: mapboxgl.Map, start: [number, number], end: [number, number]) {
    const url = mapboxgl.baseApiUrl + `/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Directamente usar la geometría proporcionada por Mapbox sin modificarla manualmente
      const routeGeoJSON = data.routes[0].geometry; // Esto es un GeoJSON válido

      // Agregar la ruta al mapa
      mapa.addSource('route', {
        type: 'geojson',
        data: routeGeoJSON  // Usamos directamente la geometría recibida
      });

      // Agregar la capa al mapa
      mapa.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#36c6ff',
          'line-width': 8
        }
      });
    } catch (error) {
      console.error('Error al obtener la ruta:', error);
      throw error;
    }
  }

  crearMarcador(mapa: mapboxgl.Map, coords: [number, number], opts: mapboxgl.MarkerOptions) {
    return new mapboxgl.Marker(opts).setLngLat(coords).addTo(mapa);
  }

  crearElementoMarcadorAuto() {
    const elemento = document.createElement('div');
    elemento.className = 'marker-auto';
    elemento.style.backgroundImage = "url(../../assets/icon/vehiculo.png)";
    elemento.style.width = '32px';
    elemento.style.height = '32px';
    elemento.style.backgroundSize = '100%';
    return elemento;
  }
}
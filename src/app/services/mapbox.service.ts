import { inject, Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { UtilsService } from './utils.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MapaboxService {


  constructor() {
    mapboxgl.accessToken = environment.mapboxToken;
  }



  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  
  

  async buildMap(onLoad?: (map: mapboxgl.Map) => void): Promise<mapboxgl.Map> {
    try {
  
  
      // Obtener coordenadas actuales
      const coords = (await this.getCurrentPosition()).coords;
      // Crear el mapa
      const mapa = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [coords.longitude, coords.latitude],
        zoom: 10,
        pitch: 40
      });
      if (onLoad) {
        mapa.on('load', () => {
          mapa.resize();
          onLoad(mapa);
        });
      }
      return mapa;
    } catch (error) {
      console.error('Error al construir el mapa', error);
      throw error;
    }
  }

  async obtenerRuta(mapa: mapboxgl.Map, start: [number, number], end: [number, number]) {
    // Url de la API de Mapbox
    const url = mapboxgl.baseApiUrl + `/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Agregar la ruta al mapa
      mapa.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: data.routes[0].geometry
        }
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
      // Agregar marcadores
      const startMarker = this.crearMarcador(mapa, start,{ color: '#29dbed', draggable: false, pitchAlignment: 'auto' });
      const endMarker = this.crearMarcador(mapa, end, { color: '#0ded3b', draggable: false, pitchAlignment: 'auto' });
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
import { Component, OnInit, AfterViewInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { MapboxService } from 'src/app/services/mapbox.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  map: mapboxgl.Map | undefined;
  userLocation: mapboxgl.LngLat | undefined;
  destino: mapboxgl.LngLat | undefined;

  constructor(private mapboxService: MapboxService,
              private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Llamar al método buildMap después de que la vista haya sido cargada
    this.inicializarMapa();
  }

  async inicializarMapa() {
    try {
      // Obtener coordenadas de viaje desde localStorage
      const coordenadasViaje = JSON.parse(localStorage.getItem('coordenadasViaje') || '{}');
      if (!coordenadasViaje.latitud || !coordenadasViaje.longitud) {
        console.error('No se encontraron coordenadas de viaje.');
        return;
      }

      this.destino = new mapboxgl.LngLat(coordenadasViaje.longitud, coordenadasViaje.latitud);

      // Crear el mapa
      this.map = new mapboxgl.Map({
        container: 'map', // ID del contenedor
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.destino,
        zoom: 12,
      });

      // Agregar un marcador en el destino
      new mapboxgl.Marker()
        .setLngLat(this.destino)
        .addTo(this.map);

      // Obtener la ubicación actual del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude);

            // Mostrar la ubicación del usuario en el mapa
            new mapboxgl.Marker({ color: 'blue' })
              .setLngLat(this.userLocation)
              .addTo(this.map);

            // Trazar la ruta entre el usuario y el destino
            this.trazarRuta();
          },
          (error) => {
            console.error('Error al obtener la ubicación del usuario:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  // Trazar la ruta entre la ubicación del usuario y el destino
  trazarRuta() {
    if (this.userLocation && this.destino) {
      const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.userLocation.lng},${this.userLocation.lat};${this.destino.lng},${this.destino.lat}?geometries=geojson&access_token=pk.eyJ1IjoiY3Jpc3RpYW5kdW9jIiwiYSI6ImNtNGFkZThpODA2dnYycXB0YXVja3oxYmMifQ.SKCcsYUVVVDkgXjf6MjdTA`;

      fetch(routeUrl)
        .then(response => response.json())
        .then(data => {
          const route = data.routes[0].geometry.coordinates;

          // Directamente usar la geometría proporcionada por Mapbox sin modificarla manualmente
          const routeGeoJSON = data.routes[0].geometry; // Usamos directamente la geometría recibida

          // Dibujar la ruta en el mapa
          this.map?.addSource('route', {
            type: 'geojson',
            data: routeGeoJSON  // Usamos directamente la geometría recibida
          });

          this.map?.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#0074cc',
              'line-width': 5
            }
          });
        })
        .catch(error => console.error('Error al trazar la ruta:', error));
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Viaje } from 'src/app/models/models';
import { Usuario } from 'src/app/models/models';
import { MapboxService } from 'src/app/services/mapbox.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  viajeForm!: FormGroup;
  conductorId: string = '';
  creadorEmail: string = '';
  conductorNombreCompleto: string = '';
  minFecha: string = '';
  coordenadas: { latitud: number; longitud: number } = { latitud: 0, longitud: 0 };

  // Búsqueda de direcciones
  direccionInicio: string = '';
  direccionDestino: string = '';
  searchResultsInicio: any[] = [];
  searchResultsDestino: any[] = [];
  searchSubject: Subject<{ query: string; tipo: string }> = new Subject();

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private mapboxService: MapboxService
  ) {}

  ngOnInit() {
    this.minFecha = new Date().toISOString();

    // Configurar formulario reactivo
    this.viajeForm = this.fb.group({
      inicio: ['', Validators.required],
      destino: ['', Validators.required],
      fecha: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
      asientos: [null, [Validators.required, Validators.min(1)]],
      modelo: ['', Validators.required],
      patente: ['', Validators.required],
    });

    // Obtener el ID y email del usuario autenticado (conductor)
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.conductorId = user.uid;
        this.creadorEmail = user.email || '';

        // Obtener datos adicionales del usuario
        this.firestore
          .collection('usuarios')
          .doc(user.uid)
          .get()
          .subscribe((doc) => {
            const userData = doc.data() as Usuario;
            if (userData) {
              this.conductorNombreCompleto = `${userData.nombre} ${userData.apellido}`;
            }
          });
      }
    });

    // Suscribirse al Subject para búsqueda
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(({ query, tipo }) => {
      this.buscarDireccionMapbox(query, tipo);
    });

    this.cargarCoordenadas();
  }

  cargarCoordenadas() {
    const coordenadasViajeString = localStorage.getItem('coordenadasViaje');
    if (coordenadasViajeString) {
      this.coordenadas = JSON.parse(coordenadasViajeString);
    } else {
      console.error('No se encontraron coordenadas en localStorage');
    }
  }

  buscarDireccionMapbox(query: string, tipo: string) {
    const accessToken = 'pk.eyJ1IjoiY3Jpc3RpYW5kdW9jIiwiYSI6ImNtNGFkZThpODA2dnYycXB0YXVja3oxYmMifQ.SKCcsYUVVVDkgXjf6MjdTA';
    const baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
    const encodedQuery = encodeURIComponent(query);
  
    // Parámetros: sin 'postcode', restringiendo a Chile
    // y agregando 'poi' para lugares como "Duoc", "Mall Trebol", etc.
    const params = [
      `access_token=${accessToken}`,
      'country=cl',
      'types=address,place,poi,locality,region,district', // SIN 'postcode'
      'language=es',
      'limit=5',
      'autocomplete=true'
    ].join('&');
  
    const mapboxUrl = `${baseUrl}/${encodedQuery}.json?${params}`;
  
    fetch(mapboxUrl)
      .then(response => response.json())
      .then(data => {
        // data.features puede traer 'postcode' raramente.
        let results = data.features || [];
  
        // FILTRO MANUAL: excluir cualquier feature con "postcode" en place_type
        results = results.filter(feature => !feature.place_type.includes('postcode'));
  
        if (tipo === 'inicio') {
          this.searchResultsInicio = results;
        } else if (tipo === 'destino') {
          this.searchResultsDestino = results;
        }
      })
      .catch(error => console.error('Error al obtener la dirección de Mapbox:', error));
  }

  onSelectResult(result: any, tipo: string) {
    const coords = result.geometry.coordinates;
    this.coordenadas = { latitud: coords[1], longitud: coords[0] };

    if (tipo === 'inicio') {
      this.direccionInicio = result.place_name;
      this.viajeForm.get('inicio')?.setValue(this.direccionInicio);
      this.searchResultsInicio = [];
    } else if (tipo === 'destino') {
      this.direccionDestino = result.place_name;
      this.viajeForm.get('destino')?.setValue(this.direccionDestino);
      this.searchResultsDestino = [];
    }

    localStorage.setItem('coordenadasViaje', JSON.stringify(this.coordenadas));
  }

  onSearch(event: any, tipo: string) {
    const query = event.target.value;

    if (query.length > 2) {
      this.searchSubject.next({ query, tipo });
    } else {
      if (tipo === 'inicio') {
        this.searchResultsInicio = [];
      } else if (tipo === 'destino') {
        this.searchResultsDestino = [];
      }
    }
  }

  programarViaje() {
    if (this.viajeForm.invalid) {
      return;
    }
    if (this.coordenadas.latitud === 0 && this.coordenadas.longitud === 0) {
      console.error('Coordenadas inválidas. Selecciona la dirección primero.');
      return;
    }

    const viaje: Viaje = {
      ...this.viajeForm.value,
      conductor: this.conductorNombreCompleto,
      creadorEmail: this.creadorEmail,
      pasajeros: [],
      estado: 'disponible',
      coordenadas: this.coordenadas,
    };

    this.firestore
      .collection('viajes')
      .add(viaje)
      .then(() => {
        console.log('Viaje programado exitosamente');
        let viajesProgramados = JSON.parse(localStorage.getItem('viajesProgramados') || '[]');
        viajesProgramados.push(viaje);
        localStorage.setItem('viajesProgramados', JSON.stringify(viajesProgramados));
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Error al programar el viaje:', error);
      });
  }
}

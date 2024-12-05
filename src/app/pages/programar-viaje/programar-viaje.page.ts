import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Viaje, Usuario } from 'src/app/models/models';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  viajeForm!: FormGroup;
  conductorId: string = '';
  creadorEmail: string = ''; 
  conductorNombreCompleto: string = ''; // Aquí guardaremos el nombre y apellido concatenados
  minFecha: string = ''; 
  coordenadas: { latitud: number; longitud: number } = { latitud: 0, longitud: 0 };

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.minFecha = new Date().toISOString();

    // Configurar formulario reactivo
    this.viajeForm = this.fb.group({
      destino: ['', Validators.required],
      comunaViaje: ['', Validators.required],
      fecha: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
      asientos: [null, [Validators.required, Validators.min(1)]],
      modelo: ['', Validators.required],
      patente: ['', Validators.required],
    });

    // Obtener datos del usuario autenticado
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
  }

  getCoordenadasConductor() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.coordenadas.latitud = position.coords.latitude;
        this.coordenadas.longitud = position.coords.longitude;

        // Guardar en localStorage las coordenadas
        localStorage.setItem('coordenadas', JSON.stringify(this.coordenadas));

        console.log('Coordenadas:', this.coordenadas);
      });
    } else {
      console.log('Geolocalización no disponible');
    }
  }

  programarViaje() {
    if (this.viajeForm.invalid) {
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

    // Guardar en Firestore
    this.firestore
      .collection('viajes')
      .add(viaje)
      .then(() => {
        console.log('Viaje programado exitosamente');
        // Guardar en localStorage
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

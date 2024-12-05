import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Viaje } from 'src/app/models/models';
import { Usuario } from 'src/app/models/models'; // Importa el tipo Usuario

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

    // Configuramos el formulario reactivo con validaciones
    this.viajeForm = this.fb.group({
      destino: ['', Validators.required],
      comunaViaje: ['', Validators.required],
      fecha: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
      asientos: [null, [Validators.required, Validators.min(1)]],
      modelo: ['', Validators.required],
      patente: ['', Validators.required],
    });

    // Obtenemos el ID y email del usuario autenticado (conductor)
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.conductorId = user.uid;
        this.creadorEmail = user.email || ''; // Guardamos el correo del creador

        // Obtenemos los datos del usuario del firestore
        this.firestore
          .collection('usuarios')
          .doc(user.uid)
          .get()
          .subscribe((doc) => {
            const userData = doc.data() as Usuario;  // Usamos el tipo Usuario
            if (userData) {
              // Concatenamos el nombre y apellido del conductor
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
      conductor: this.conductorNombreCompleto, // Guardamos el nombre completo del conductor aquí
      creadorEmail: this.creadorEmail, // Guardamos el correo del creador
      pasajeros: [],
      estado: 'disponible',
      coordenadas: this.coordenadas,
    };

    // Guardamos el viaje en Firestore
    this.firestore
      .collection('viajes')
      .add(viaje)
      .then(() => {
        console.log('Viaje programado exitosamente');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Error al programar el viaje:', error);
      });
  }
}

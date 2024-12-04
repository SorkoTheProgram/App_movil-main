import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Viaje } from 'src/app/models/models';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  viajeForm!: FormGroup;
  conductorId: string = '';
  creadorEmail: string = ''; // Cambiar el nombre del campo a creadorEmail
  minFecha: string = ''; // Variable para almacenar la fecha mínima

  constructor(
    public router: Router, // Cambia a `public` para que sea accesible desde el HTML
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    // Configuramos la fecha mínima (hoy)
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
      }
    });
  }

  // Método para programar el viaje
  programarViaje() {
    if (this.viajeForm.invalid) {
      return;
    }

    const viaje: Viaje = {
      ...this.viajeForm.value,
      conductor: this.conductorId,
      creadorEmail: this.creadorEmail, // Guardamos el correo del creador
      pasajeros: [],
      estado: 'disponible',
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

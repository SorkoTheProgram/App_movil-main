import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Viaje } from 'src/app/models/models';



@Component({
  selector: 'app-viajes-disponibles',
  templateUrl: './viajes-disponibles.page.html',
  styleUrls: ['./viajes-disponibles.page.scss'],
})
export class ViajesDisponiblesPage implements OnInit {
  viajeId: string = '';
  viaje: Viaje | null = null;
  pasajeroId: string = 'user-id'; 

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.viajeId = this.route.snapshot.paramMap.get('id')!;
    this.cargarViaje();
  }

  // Cargar los detalles del viaje
  cargarViaje() {
    this.firestore.collection('viajes').doc(this.viajeId).get().subscribe(doc => {
      if (doc.exists) {
        this.viaje = doc.data() as Viaje;
      } else {
        console.log('Viaje no encontrado');
      }
    });
  }

  // Función para que el pasajero tome el viaje
  tomarViaje() {
    if (this.viaje) {
      const pasajeros = this.viaje.pasajeros;

      // Verificar si el pasajero ya está en la lista de pasajeros
      if (!pasajeros.includes(this.pasajeroId)) {
        pasajeros.push(this.pasajeroId);  // Agregar al pasajero a la lista
        this.firestore.collection('viajes').doc(this.viajeId).update({
          pasajeros: pasajeros,  // Actualizar la lista de pasajeros
          estado: 'pendiente'     // Marcar el viaje como pendiente
        }).then(() => {
          console.log('Viaje tomado con éxito');
          this.router.navigate(['/viaje-en-curso']);  // Redirigir a la página de inicio o donde sea necesario
        }).catch(error => {
          console.error('Error al tomar el viaje: ', error);
        });
      } else {
        console.log('Ya estás en la lista de pasajeros');
      }
    }
  }
}
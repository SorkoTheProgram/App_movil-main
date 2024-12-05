import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Viaje } from 'src/app/models/models';  // Asegúrate de tener este modelo de Viaje

@Component({
  selector: 'app-viaje-detalle',
  templateUrl: './viaje-detalle.page.html',
  styleUrls: ['./viaje-detalle.page.scss'],
})
export class ViajeDetallePage implements OnInit {
  viaje: Viaje | null = null;  // Almacena los detalles del viaje
  pasajeros: string[] = [];    // Lista de correos de pasajeros
  loading: boolean = false;    // Indicador de carga

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    const viajeId = this.route.snapshot.paramMap.get('id');  // Obtener el ID del viaje desde la ruta

    if (viajeId) {
      this.cargarViaje(viajeId);
    }
  }

  cargarViaje(viajeId: string) {
    this.loading = true;  // Mostrar indicador de carga

    // Obtener el viaje desde Firestore usando el ID
    this.firestore
      .collection('viajes')
      .doc(viajeId)
      .get()
      .subscribe((doc) => {
        if (doc.exists) {
          this.viaje = doc.data() as Viaje;  // Asignar los detalles del viaje
          this.pasajeros = this.viaje?.pasajeros || [];  // Asignar la lista de pasajeros
        } else {
          console.error('Viaje no encontrado');
        }
        this.loading = false;  // Ocultar indicador de carga
      });
  }
}

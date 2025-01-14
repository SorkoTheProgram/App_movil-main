import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { Viaje } from 'src/app/models/models'; 

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  pagoForm!: FormGroup;
  viajeSeleccionado: Viaje | undefined; 
  userEmail: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private firestore: AngularFirestore, 
    private afAuth: AngularFireAuth 
  ) {}

  ngOnInit() {
    // Recuperamos el viaje desde localStorage
    const viajeSeleccionado = localStorage.getItem('viajeSeleccionado');
    if (viajeSeleccionado) {
      this.viajeSeleccionado = JSON.parse(viajeSeleccionado);
    }

    // Inicializamos el formulario de pago
    this.pagoForm = this.fb.group({
      nombre: ['', Validators.required],
      numero: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{16}$')
      ]],
      fechaVencimiento: ['', Validators.required],
      cvc: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{3}$')
      ]],
    });

    // Obtener el email del usuario autenticado
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.userEmail = user.email;
      }
    });
  }

  // Procesar el pago
  async procesarPago() {
    if (this.pagoForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    // Simulamos un procesamiento de pago (siempre exitoso en este caso)
    console.log('Procesando pago para:', this.pagoForm.value);

    if (this.viajeSeleccionado) {
      const viajeRef = this.firestore.collection('viajes').doc(this.viajeSeleccionado.id);
      const viajeDoc = await viajeRef.get().toPromise();
      const viajeData = viajeDoc?.data() as Viaje;

      if (viajeData) {
        // Reducir los asientos disponibles y agregar al usuario como pasajero
        await viajeRef.update({
          pasajeros: [...viajeData.pasajeros, this.userEmail],
          asientos: viajeData.asientos - 1,
        });

        // Mostrar un mensaje de éxito usando ion-toast
        const toast = await this.toastController.create({
          message: 'Pago realizado con éxito.',
          duration: 2000,
          position: 'top',
        });
        toast.present();

        // Redirigir al usuario al home después de que el pago se ha procesado
        this.router.navigate(['/home']);
      }
    }
  }
}

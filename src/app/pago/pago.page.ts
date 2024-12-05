import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  pagoForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.pagoForm = this.fb.group({
      nombre: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]], // Validación simple para el número de tarjeta
      fechaVencimiento: ['', Validators.required],
      cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]], // Validación simple para CVC
    });
  }

  procesarPago() {
    if (this.pagoForm.invalid) {
      return;
    }

    const pago = this.pagoForm.value;

    // Simulamos un procesamiento de pago (siempre es exitoso en este caso)
    console.log('Procesando pago para:', pago);

    // Mostrar un mensaje de éxito o redirigir a otra página
    alert('Pago realizado con éxito');
    this.router.navigate(['/mis-viajes']); // Redirigir a la página de mis viajes después de pagar
  }
}

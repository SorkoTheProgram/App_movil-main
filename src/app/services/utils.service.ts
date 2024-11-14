import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router'; // Para la navegación

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router // Agrega el Router para navegar a la raíz
  ) {}

  async presentarCargando(mensaje: string = 'Cargando...') {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      spinner: 'crescent',
      duration: 2000 // Puedes ajustar la duración si lo deseas
    });
    return loading;
  }

  async mostrarToast(opciones: { mensaje: string; duracion: number; color: string; icono?: string }) {
    const toast = await this.toastCtrl.create({
      message: opciones.mensaje,
      duration: opciones.duracion,
      color: opciones.color,
      icon: opciones.icono || 'information-circle'
    });
    toast.present();
  }

  guardarEnLocalStorage(clave: string, valor: any) {
    localStorage.setItem(clave, JSON.stringify(valor));
  }

  navegarARaiz(ruta: string) {
    this.router.navigate([ruta]);
  }

  navegarAlInicio(ruta: string) {
    this.navegarARaiz(ruta); // Puedes usar este método como base
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reestablecer',
  templateUrl: './reestablecer.page.html',
  styleUrls: ['./reestablecer.page.scss'],
})
export class ReestablecerPage implements OnInit {
  
  email: string = ''; // Agregamos la propiedad email aquí

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  volveraHome() {
    this.navCtrl.navigateBack('/home');
  }

  sendResetLink() {
    console.log('Correo ingresado:', this.email);
    alert('Se ha enviado un código de restablecimiento si el correo es válido.');
  }
}

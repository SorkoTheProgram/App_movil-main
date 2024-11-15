import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getDoc, setDoc, doc, collection, addDoc } from "@angular/fire/firestore";
import { UtilsService } from './utils.service';
import { Usuario } from '../models/models'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyecciones de dependencias
  private afAuth = inject(AngularFireAuth);
  private firestore = inject(AngularFirestore);
  private utilsService = inject(UtilsService);

  constructor() {}

  async iniciarSesion(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const userData = await this.obtenerDocumento(`usuarios/${userCredential.user?.uid}`);
      this.utilsService.guardarEnLocalStorage('usuario', userData);
      return userCredential.user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, nombre: string, apellido: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (userCredential.user) {
        // Guardar el documento del usuario en Firestore
        await this.establecerDocumento(`usuarios/${userCredential.user.uid}`, {
          nombre,
          apellido,
          email,
          uid: userCredential.user.uid
        });
      }
      return userCredential.user;
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error;
    }
  }

  async cerrarSesion() {
    try {
      await this.afAuth.signOut();
      console.log('Sesión cerrada exitosamente');
      localStorage.removeItem('usuario');
      this.utilsService.navegarARaiz('/inicio-sesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
  async changePassword(newPassword: string, currentPassword: string) {
    try {
      const user = await this.afAuth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
  
      // Reautenticar al usuario antes de actualizar la contraseña
      const credential = await this.afAuth.signInWithEmailAndPassword(user.email!, currentPassword);
      if (credential) {
        await user.updatePassword(newPassword);
        console.log('Contraseña actualizada con éxito');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      throw error;
    }
  }
  
  async obtenerDocumento(ruta: string): Promise<Usuario | null> {
    try {
      const docSnap = await getDoc(doc(this.firestore.firestore, ruta));
      return docSnap.exists() ? (docSnap.data() as Usuario) : null;
    } catch (error) {
      console.error(`Error al obtener el documento de la ruta ${ruta}:`, error);
      throw error;
    }
  }
async resetPasswordEmail(email: string) {
  try {
    await this.afAuth.sendPasswordResetEmail(email);
    console.log('Correo de restablecimiento enviado.');
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento:', error);
    throw error;
  }
}
async obtenerDatosUsuarioActual() {
  try {
    const usuarioActual = await this.afAuth.currentUser;
    if (usuarioActual) {
      const uid = usuarioActual.uid;
      return this.obtenerDocumento(`usuarios/${uid}`);
    }
    return null;
  } catch (error) {
    console.error('Error al obtener los datos del usuario actual:', error);
    throw error;
  }
}

  establecerDocumento(ruta: string, data: any) {
    return setDoc(doc(this.firestore.firestore, ruta), data);
  }

  agregarDocumento(ruta: string, data: any) {
    return addDoc(collection(this.firestore.firestore, ruta), data);
  }

  obtenerInstanciaAuth() {
    return this.afAuth;
  }
}

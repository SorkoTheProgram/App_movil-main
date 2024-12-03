export interface Usuario {
    email: string;
    nombre: string;
    apellido: string;
    password: string;
}
export interface Viaje {
    id?: string;
    destino: string;
    comunaViaje: string;
    fecha: string;
    precio: number;
    asientos: number;
    conductor: string;
    modelo: string;
    patente: string;
    pasajeros: string[];
    estado: 'disponible' | 'cancelado' | 'finalizado' | 'iniciado' | 'pendiente' | 'lleno';
}
export interface Usuario {
    email: string;
    name: string;
    lastName: string;
    uid: string;
}
export interface Viaje {
    id?: string;
    destino: string;
    comunaDestino: string;
    fecha: Date;
    precio: number;
    asientos: number;
    conductor: string;
    modeloAuto: string;
    patenteAuto: string;
    pasajeros: string[];
    estado: 'disponible' | 'cancelado' | 'finalizado' | 'iniciado' | 'pendiente' | 'lleno';
}
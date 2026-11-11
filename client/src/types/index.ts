export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'cliente';
}

export interface Habitacion {
    id: number;
    numero: string;
    tipo: string;
    precio_base: number;
    capacidad: number;
    estado: 'Disponible' | 'Ocupada' | 'Mantenimiento';
}

export interface Reserva {
    id?: number;
    cliente_nombre: string;
    cliente_email: string;
    usuario_id?: number;
    habitacion_id: number;
    fecha_checkin: string;
    fecha_checkout: string;
    anticipacion_dias: number;
    precio_aplicado: number;
}
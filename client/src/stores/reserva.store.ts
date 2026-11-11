import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../services/api';
import type { Reserva } from '../types';

export const useReservaStore = defineStore('reserva', () => {
    const reservas = ref<Reserva[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    async function fetchReservas() {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await api.get('/reservas');
            reservas.value = data.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Error al cargar reservas';
        } finally {
            loading.value = false;
        }
    }

    async function crearReserva(nuevaReserva: Reserva) {
        loading.value = true;
        try {
            const { data } = await api.post('/reservas', nuevaReserva);
            reservas.value.push(data.data);
            return data;
        } finally {
            loading.value = false;
        }
    }

    return { reservas, loading, error, fetchReservas, crearReserva };
});
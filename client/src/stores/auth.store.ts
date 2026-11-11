import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../services/api';
import type { Usuario } from '../types';

export const useAuthStore = defineStore('auth', () => {
    const usuario = ref<Usuario | null>(null);
    const isAuthenticated = ref<boolean>(false);
    const isLoading = ref<boolean>(false);

    async function login(credentials: { email: string; password_hash: string }) {
        isLoading.value = true;
        try {
            const { data } = await api.post('/auth/login', credentials);
            usuario.value = data.user || data.usuario;
            isAuthenticated.value = true;
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        try {
            await api.post('/auth/logout');
        } finally {
            usuario.value = null;
            isAuthenticated.value = false;
        }
    }

    return { usuario, isAuthenticated, isLoading, login, logout };
});
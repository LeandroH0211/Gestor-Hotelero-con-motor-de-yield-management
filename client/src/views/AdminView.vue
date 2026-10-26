<template>
  <div class="admin-container">
    <h2>Panel de Administración y Control</h2>
    <p class="subtitle">Gestión de tarifas, precios dinámicos y cuartelería del hotel.</p>

    <div class="admin-grid">
      <!-- Tarjeta de gestión de precios / Yield Management -->
      <div class="admin-card">
        <h3>Motor de Yield Management</h3>
        <p>Ajustar multiplicadores de precio según temporada y anticipación.</p>
        <button class="btn-action" @click="modificarPrecios">Modificar Tarifas</button>
      </div>

      <!-- Tarjeta de control de habitaciones -->
      <div class="admin-card">
        <h3>Control de Cuartelería</h3>
        <p>Habilitar, deshabilitar o cambiar estados de las habitaciones.</p>
        <button class="btn-action" @click="gestionarHabitaciones">Gestionar Habitaciones</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'AdminView',
  methods: {
    async modificarPrecios() {
      try {
        // Conexión con la API para listar o actualizar reglas de Yield Management
        const response = await api.get('/habitaciones'); 
        alert('Conexión exitosa con el sistema de tarifas y habitaciones.');
        console.log('Datos obtenidos:', response.data);
      } catch (error) {
        const mensaje = error.response?.data?.error || error.response?.data?.message || 'No tienes permisos de administrador o la sesión expiró.';
        alert('Error de acceso: ' + mensaje);
      }
    },

    async gestionarHabitaciones() {
      try {
        // Ejemplo conectando con la ruta PUT protegida por rol admin en el backend
        // Cambia el ID (ej: 1) por el de la habitación que desees gestionar
        const response = await api.put('/habitaciones/1/estado', {
          estado: 'Ocupada'
        });
        
        alert('¡Estado de la cuartelería actualizado con éxito!');
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        const mensaje = error.response?.data?.error || error.response?.data?.message || 'No autorizado para cambiar el estado de las habitaciones.';
        alert('Acceso denegado: ' + mensaje);
      }
    }
  }
};
</script>

<style scoped>
.admin-container {
  padding: 2rem;
  color: #fff;
}

.subtitle {
  color: #a0aec0;
  margin-bottom: 2rem;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.admin-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.admin-card h3 {
  margin-bottom: 0.5rem;
  color: #f6ad55;
}

.admin-card p {
  color: #cbd5e0;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.btn-action {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.btn-action:hover {
  opacity: 0.9;
}
</style>
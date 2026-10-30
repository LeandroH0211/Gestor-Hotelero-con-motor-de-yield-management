<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <div class="admin-header">
        <h2>Panel de Administración y Control</h2>
        <span class="badge-admin">Admin Privilegios</span>
      </div>
      <p class="subtitle">Gestión de tarifas, precios dinámicos y cuartelería del hotel.</p>

      <div class="admin-grid">
        <!-- Tarjeta de gestión de precios / Yield Management -->
        <div class="admin-card">
          <div class="card-content">
            <h3>Motor de Yield Management</h3>
            <p>Ajustar multiplicadores de precio según temporada y anticipación.</p>
          </div>
          <button class="btn-action" @click="modificarPrecios">Modificar Tarifas</button>
        </div>

        <!-- Tarjeta de control de habitaciones -->
        <div class="admin-card">
          <div class="card-content">
            <h3>Control de Cuartelería</h3>
            <p>Habilitar, deshabilitar o cambiar estados de las habitaciones.</p>
          </div>
          <button class="btn-action" @click="gestionarHabitaciones">Gestionar Habitaciones</button>
        </div>
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
.admin-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.admin-container {
  max-width: 1000px;
  width: 100%;
  color: #fff;
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.admin-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
}

.badge-admin {
  font-size: 0.75rem;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.75rem;
}

.admin-card {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.92) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.admin-card:hover {
  transform: translateY(-6px);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 30px 60px -15px rgba(99, 102, 241, 0.25);
}

.admin-card h3 {
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 700;
}

.admin-card p {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.btn-action {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.55);
  opacity: 1;
}
</style>
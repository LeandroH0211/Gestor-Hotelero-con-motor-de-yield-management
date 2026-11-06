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
          <button class="btn-action" @click="abrirModalTarifas">Modificar Tarifas</button>
        </div>

        <!-- Tarjeta de control de habitaciones -->
        <div class="admin-card">
          <div class="card-content">
            <h3>Control de Cuartelería</h3>
            <p>Habilitar, deshabilitar o cambiar estados de las habitaciones.</p>
          </div>
          <button class="btn-action" @click="abrirModalCuarteleria">Gestionar Habitaciones</button>
        </div>
      </div>

      <!-- ================= MODAL 1: MODIFICAR TARIFAS ================= -->
      <div v-if="modalTarifas" class="modal-overlay" @click.self="modalTarifas = false">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Gestión de Tarifas y Yield</h3>
            <button class="close-btn" @click="modalTarifas = false">×</button>
          </div>
          <p class="modal-sub">Selecciona una habitación para ajustar su precio base.</p>
          
          <div class="modal-body">
            <div v-for="hab in habitaciones" :key="hab.id" class="item-row">
              <div>
                <strong>Habitación {{ hab.numero }}</strong> ({{ hab.tipo }})
                <br><small>Base actual: ${{ hab.precio_base }}</small>
              </div>
              <button class="btn-sm" @click="seleccionarParaTarifa(hab)">Editar</button>
            </div>

            <!-- Formulario de edición rápida para la habitación seleccionada -->
            <div v-if="habSeleccionada" class="edit-box">
              <p>Actualizando precio para Habitación <strong>{{ habSeleccionada.numero }}</strong></p>
              <label>Nuevo Precio Base ($):</label>
              <input type="number" v-model.number="nuevoPrecioBase" min="0" />
              <button class="btn-action btn-save" @click="guardarNuevaTarifa">Guardar Cambios</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= MODAL 2: GESTIONAR CUARTELERÍA ================= -->
      <div v-if="modalCuarteleria" class="modal-overlay" @click.self="modalCuarteleria = false">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Control de Estados de Cuartelería</h3>
            <button class="close-btn" @click="modalCuarteleria = false">×</button>
          </div>
          <p class="modal-sub">Cambia el estado operativo de las habitaciones en tiempo real.</p>
          
          <div class="modal-body">
            <div v-for="hab in habitaciones" :key="hab.id" class="item-row">
              <div>
                <strong>Hab. {{ hab.numero }}</strong> ({{ hab.tipo }}) - 
                <span :class="hab.estado === 'Disponible' ? 'text-green' : 'text-red'">{{ hab.estado }}</span>
              </div>
              <div class="action-buttons">
                <button 
                  class="btn-sm btn-green" 
                  @click="cambiarEstadoHabitacion(hab.id, 'Disponible')"
                  :disabled="hab.estado === 'Disponible'"
                >
                  Disponible
                </button>
                <button 
                  class="btn-sm btn-red" 
                  @click="cambiarEstadoHabitacion(hab.id, 'Ocupada')"
                  :disabled="hab.estado === 'Ocupada'"
                >
                  Ocupada
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'AdminView',
  data() {
    return {
      habitaciones: [],
      modalTarifas: false,
      modalCuarteleria: false,
      habSeleccionada: null,
      nuevoPrecioBase: 0
    };
  },
  methods: {
    async cargarHabitaciones() {
      try {
        const response = await api.get('/habitaciones');
        this.habitaciones = response.data.data;
      } catch (error) {
        console.error('Error al cargar habitaciones:', error);
        alert('No se pudieron cargar las habitaciones.');
      }
    },

    async abrirModalTarifas() {
      await this.cargarHabitaciones();
      this.habSeleccionada = null;
      this.modalTarifas = true;
    },

    async abrirModalCuarteleria() {
      await this.cargarHabitaciones();
      this.modalCuarteleria = true;
    },

    seleccionarParaTarifa(hab) {
      this.habSeleccionada = hab;
      this.nuevoPrecioBase = hab.precio_base;
    },

    async guardarNuevaTarifa() {
      try {
        await api.put(`/habitaciones/${this.habSeleccionada.id}`, {
          precio_base: this.nuevoPrecioBase
        });
        alert('¡Tarifa actualizada correctamente!');
        this.habSeleccionada = null;
        await this.cargarHabitaciones();
      } catch (error) {
        const mensaje = error.response?.data?.error || error.response?.data?.message || 'Error al actualizar la tarifa.';
        alert('Error: ' + mensaje);
      }
    },

    async cambiarEstadoHabitacion(id, nuevoEstado) {
      try {
        await api.put(`/habitaciones/${id}/estado`, {
          estado: nuevoEstado
        });
        alert(`¡Habitación cambiada a estado: ${nuevoEstado}!`);
        await this.cargarHabitaciones();
      } catch (error) {
        const mensaje = error.response?.data?.error || error.response?.data?.message || 'No autorizado para cambiar el estado.';
        alert('Acceso denegado: ' + mensaje);
      }
    }
  },
  mounted() {
    // Validación de seguridad para impedir el acceso sin sesión activa
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para acceder al panel de administración.');
      this.$router.push('/login');
      return;
    }
    this.cargarHabitaciones();
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
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
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
}

/* --- ESTILOS DE MODALES FLOTANTES --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-card {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 2rem;
  border-radius: 24px;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
  text-align: left;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.modal-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.3rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.6rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #fff;
}

.modal-sub {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.item-row small {
  color: #818cf8;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.btn-sm:hover:not(:disabled) {
  opacity: 0.85;
}

.btn-sm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-green {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.4);
}

.btn-red {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.text-green { color: #4ade80; font-weight: bold; }
.text-red { color: #f87171; font-weight: bold; }

.edit-box {
  margin-top: 1rem;
  padding: 1.25rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-box p {
  margin: 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.edit-box label {
  font-size: 0.85rem;
  color: #cbd5e1;
  font-weight: 600;
}

.edit-box input {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 0.75rem;
  border-radius: 10px;
  outline: none;
}

.btn-save {
  margin-top: 0.5rem;
}
</style>
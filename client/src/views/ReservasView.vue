<template>
  <div class="form-wrapper">
    <div class="form-card">
      <div class="form-header">
        <h2>Nueva Reserva</h2>
        <span class="badge-yield">Yield Management</span>
      </div>
      <p class="subtitle">Calcula automáticamente la tarifa dinámica según anticipación y demanda.</p>

      <form @submit.prevent="registrarReserva" class="booking-form">
        <div class="form-group">
          <label>Nombre del Cliente:</label>
          <input 
            v-model="form.cliente_nombre" 
            type="text" 
            placeholder="Ej. Juan Pérez" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Correo Electrónico:</label>
          <input 
            v-model="form.cliente_email" 
            type="email" 
            placeholder="correo@ejemplo.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Seleccionar Habitación:</label>
          <select 
            v-model="form.habitacion_id" 
            @change="actualizarPrecioBase" 
            required
          >
            <option disabled value="">Seleccione una habitación disponible</option>
            <option v-for="hab in habitaciones" :value="hab.id" :key="hab.id">
              Habitación {{ hab.numero }} - {{ hab.tipo }} (Base: ${{ hab.precio_base }})
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Fecha Check-in:</label>
            <input 
              v-model="form.fecha_checkin" 
              type="date" 
              required 
            />
          </div>
          <div class="form-group">
            <label>Fecha Check-out:</label>
            <input 
              v-model="form.fecha_checkout" 
              type="date" 
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label>Días de Anticipación (para regla Yield):</label>
          <input 
            v-model.number="form.anticipacion_dias" 
            type="number" 
            min="0" 
            required 
          />
        </div>

        <button type="submit" class="btn-submit">
          Confirmar Reserva con Tarifa Dinámica
        </button>
      </form>

      <!-- Resultado del cálculo de Yield Management -->
      <div v-if="resultado" class="result-box">
        <h3>¡Reserva Exitosa!</h3>
        <p>Tarifa Base: ${{ form.precio_base }}</p>
        <p>Multiplicador Aplicado: <strong>x{{ resultado.multiplicador_yield }}</strong></p>
        <p class="final-price">Precio Final Dinámico: ${{ resultado.data.precio_aplicado }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// ¡Importamos tu instancia personalizada de api.js!
import api from '../services/api';

export default {
  name: 'ReservasView',
  data() {
    return {
      habitaciones: [],
      form: {
        cliente_nombre: '',
        cliente_email: '',
        habitacion_id: '',
        fecha_checkin: '',
        fecha_checkout: '',
        anticipacion_dias: 1,
        precio_base: 0
      },
      resultado: null
    };
  },
  methods: {
    async cargarHabitacionesDisponibles() {
      try {
        const res = await api.get('/habitaciones');
        this.habitaciones = res.data.data.filter(h => h.estado === 'Disponible');
      } catch (error) {
        console.error('Error al cargar habitaciones:', error);
      }
    },
    actualizarPrecioBase() {
      const hab = this.habitaciones.find(h => h.id === this.form.habitacion_id);
      if (hab) {
        this.form.precio_base = hab.precio_base;
      }
    },
    async registrarReserva() {
      try {
        // Usamos 'api.post' que incluye la configuración y credenciales
        const res = await api.post('/reservas', this.form);
        this.resultado = res.data;
        alert('¡Reserva creada correctamente!');
        this.cargarHabitacionesDisponibles();
      } catch (error) {
        alert(error.response?.data?.message || 'Error al procesar la reserva');
      }
    }
  },
  mounted() {
    this.cargarHabitacionesDisponibles();
  }
};
</script>

<style scoped>
.form-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.form-card {
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.form-header h2 {
  margin: 0;
  font-size: 1.6rem;
  color: #ffffff;
  font-weight: 700;
}

.badge-yield {
  font-size: 0.75rem;
  background: rgba(99, 102, 241, 0.25);
  border: 1px solid #6366f1;
  color: #a5b4fc;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0 0 1.75rem 0;
  text-align: left;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
}

input, select {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
}

input:focus, select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  background: rgba(15, 23, 42, 0.95);
}

select option {
  background: #0f172a;
  color: #f8fafc;
}

.btn-submit {
  margin-top: 0.75rem;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  border: none;
  padding: 0.9rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.5);
}

.result-box {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 12px;
  color: #4ade80;
  text-align: left;
  backdrop-filter: blur(10px);
}

.result-box h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #4ade80;
}

.result-box p {
  margin: 0.2rem 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.final-price {
  font-size: 1.2rem;
  font-weight: 800;
  margin-top: 0.5rem !important;
  color: #4ade80 !important;
}
</style>
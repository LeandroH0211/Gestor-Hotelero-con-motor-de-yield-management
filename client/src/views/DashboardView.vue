<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-container">
      
      <!-- Título Principal -->
      <h2 class="dashboard-title">
        Panel de Cuartelería y Ocupación
      </h2>

      <!-- Tarjeta de Resumen de Ocupación -->
      <div class="stats-card">
        <p class="stats-subtitle">Ocupación Actual</p>
        <p class="stats-value">
          {{ porcentajeOcupacion }}
        </p>
        <p class="stats-footer">Mostrando el estado de todas las habitaciones.</p>
      </div>

      <!-- Cuadrícula de Habitaciones Detalladas -->
      <div class="rooms-grid">
        <div 
          v-for="hab in habitaciones" 
          :key="hab.id" 
          class="hab-card"
          :class="{
            'card-available': hab.estado === 'Disponible',
            'card-busy': hab.estado === 'Ocupada'
          }"
        >
          <!-- Encabezado de la tarjeta con estilo elegante -->
          <div class="hab-header">
            <div class="hab-badge-number">
              <span>Habitación</span>
              <strong>{{ hab.numero }}</strong>
            </div>
            <span class="status-pill"
                  :class="{
                    'pill-available': hab.estado === 'Disponible',
                    'pill-busy': hab.estado === 'Ocupada'
                  }">
              <span class="dot"></span> {{ hab.estado }}
            </span>
          </div>

          <!-- Cuerpo de la tarjeta -->
          <div class="hab-body">
            <h3 class="hab-type">{{ hab.tipo }}</h3>
            
            <div class="hab-details-box">
              <div class="detail-item">
                <span class="icon">👥</span>
                <div>
                  <small>Capacidad</small>
                  <p>{{ hab.capacidad }} personas</p>
                </div>
              </div>
              <div class="detail-item">
                <span class="icon">🛏️</span>
                <div>
                  <small>Camas</small>
                  <p>{{ hab.camas || 1 }} unidad(es)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pie de tarjeta con precio destacado -->
          <div class="hab-footer">
            <div class="price-container">
              <span class="currency">$</span>
              <span class="price-amount">{{ hab.precio_base }}</span>
              <span class="price-period">/ noche</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      habitaciones: [],
      porcentajeOcupacion: '0%'
    };
  },
  methods: {
    async cargarHabitaciones() {
      try {
        const res = await axios.get('http://localhost:3000/api/habitaciones');
        this.habitaciones = res.data.data;
        this.porcentajeOcupacion = res.data.ocupacion_actual || this.calcularOcupacion();
      } catch (error) {
        console.error('Error al cargar habitaciones:', error);
      }
    },
    calcularOcupacion() {
      if (this.habitaciones.length === 0) return '0%';
      const ocupadas = this.habitaciones.filter(h => h.estado === 'Ocupada').length;
      return `${Math.round((ocupadas / this.habitaciones.length) * 100)}%`;
    }
  },
  mounted() {
    this.cargarHabitaciones();
  }
};
</script>

<style scoped>
/* Contenedor principal */
.dashboard-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2.5rem 1rem;
}

.dashboard-container {
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Título */
.dashboard-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 2rem;
  letter-spacing: -0.5px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Tarjeta de resumen de ocupación */
.stats-card {
  width: 100%;
  max-width: 360px;
  margin-bottom: 3rem;
  background: rgba(30, 41, 59, 0.75);
  backdrop-filter: blur(16px);
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
}

.stats-subtitle {
  font-size: 0.8rem;
  font-weight: 700;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0;
}

.stats-value {
  font-size: 3.8rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0.4rem 0;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.stats-footer {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}

/* Rejilla de tarjetas */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
}

/* Tarjeta individual detallada */
.hab-card {
  background: rgba(30, 41, 59, 0.75);
  backdrop-filter: blur(16px);
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.hab-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 45px -12px rgba(99, 102, 241, 0.35);
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(30, 41, 59, 0.88);
}

/* Encabezado de la tarjeta */
.hab-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hab-badge-number span {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.hab-badge-number strong {
  font-size: 1.4rem;
  color: #ffffff;
  font-weight: 800;
}

/* Estado (Pill) */
.status-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.pill-available {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}
.pill-available .dot { background: #4ade80; box-shadow: 0 0 8px #4ade80; }

.pill-busy {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.pill-busy .dot { background: #f87171; box-shadow: 0 0 8px #f87171; }

/* Cuerpo de la tarjeta */
.hab-body {
  padding: 1.5rem;
}

.hab-type {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 1.25rem 0;
}

/* Caja de detalles con iconos */
.hab-details-box {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: rgba(15, 23, 42, 0.4);
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.detail-item .icon {
  font-size: 1.2rem;
  background: rgba(99, 102, 241, 0.15);
  padding: 0.4rem;
  border-radius: 10px;
}

.detail-item small {
  display: block;
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
}

.detail-item p {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #e2e8f0;
}

/* Pie de tarjeta (Precio) */
.hab-footer {
  padding: 1.25rem 1.5rem;
  background: rgba(15, 23, 42, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
}

.currency {
  font-size: 1rem;
  font-weight: 600;
  color: #818cf8;
}

.price-amount {
  font-size: 1.7rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.price-period {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
  margin-left: 0.2rem;
}
</style>
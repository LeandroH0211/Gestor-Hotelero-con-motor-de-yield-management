<template>
  <div class="bg-slate-50 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto flex flex-col items-center">
      
      <!-- Título Principal centrado -->
      <h2 class="text-4xl font-extrabold text-slate-950 mb-10 tracking-tight">
        Panel de Cuartelería y Ocupación
      </h2>

      <!-- Tarjeta de Resumen de Ocupación centrada -->
      <div class="w-full max-w-sm mb-12 bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center">
        <p class="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Ocupación Actual</p>
        <p class="text-6xl font-extrabold text-indigo-950 mt-1">
          {{ porcentajeOcupacion }}
        </p>
        <p class="text-slate-600 mt-2 text-sm">Mostrando el estado de todas las habitaciones.</p>
      </div>

      <!-- Cuadrícula de Habitaciones como Botones Profesionales -->
      <!-- 'text-center' centra el texto dentro de cada tarjeta -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full text-center">
        <div 
          v-for="hab in habitaciones" 
          :key="hab.id" 
          class="hab-card"
          :class="{
            'border-emerald-500 bg-emerald-50': hab.estado === 'Disponible',
            'border-rose-500 bg-rose-50': hab.estado === 'Ocupada'
          }"
        >
          <!-- Encabezado de la tarjeta con color de estado -->
          <div 
            class="hab-header"
            :class="{
              'bg-emerald-600': hab.estado === 'Disponible',
              'bg-rose-600': hab.estado === 'Ocupada'
            }"
          >
            <span class="text-2xl font-bold text-white">
              Habitación {{ hab.numero }}
            </span>
          </div>

          <!-- Información Detallada Centrada -->
          <div class="p-6 space-y-4">
            <p class="status-badge"
               :class="{
                 'bg-emerald-100 text-emerald-800': hab.estado === 'Disponible',
                 'bg-rose-100 text-rose-800': hab.estado === 'Ocupada'
               }">
              {{ hab.estado }}
            </p>
            
            <p class="text-slate-800 font-semibold text-lg">{{ hab.tipo }}</p>
            
            <div class="text-sm text-slate-600 space-y-1">
              <p>Capacidad: <span class="font-bold text-slate-900">{{ hab.capacidad }} personas</span></p>
              <p>Camas: <span class="font-bold text-slate-900">{{ hab.camas || 1 }}</span></p>
            </div>

            <p class="text-slate-950 font-extrabold text-3xl mt-2">
              <span class="text-slate-600 text-lg font-normal">$</span>
              {{ hab.precio_base }}
              <span class="text-slate-600 text-base font-normal"> / noche</span>
            </p>
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
        // Supongamos que tu backend ya devuelve el % calculado
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
/* Estilos profesionales para la tarjeta de habitación */
.hab-card {
  @apply bg-white rounded-3xl shadow-xl overflow-hidden border-2 transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer;
}

.hab-header {
  @apply py-5 px-6 flex justify-center;
}

.status-badge {
  @apply inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm;
}
</style>
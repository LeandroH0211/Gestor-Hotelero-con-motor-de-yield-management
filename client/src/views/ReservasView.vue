<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Nueva Reserva (Yield Management)</h2>

    <form @submit.prevent="registrarReserva" class="space-y-4">
      <div>
        <label class="block text-gray-700 font-medium mb-1">Nombre del Cliente:</label>
        <input v-model="form.cliente_nombre" type="text" class="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300" required />
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-1">Correo Electrónico:</label>
        <input v-model="form.cliente_email" type="email" class="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300" required />
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-1">Seleccionar Habitación:</label>
        <select v-model="form.habitacion_id" @change="actualizarPrecioBase" class="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300" required>
          <option disabled value="">Seleccione una habitación disponible</option>
          <option v-for="hab in habitaciones" :value="hab.id" :key="hab.id">
            Habitación {{ hab.numero }} - {{ hab.tipo }} (Base: ${{ hab.precio_base }})
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Fecha Check-in:</label>
          <input v-model="form.fecha_checkin" type="date" class="w-full border rounded-lg p-2" required />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">Fecha Check-out:</label>
          <input v-model="form.fecha_checkout" type="date" class="w-full border rounded-lg p-2" required />
        </div>
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-1">Días de Anticipación (para regla Yield):</label>
        <input v-model.number="form.anticipacion_dias" type="number" min="0" class="w-full border rounded-lg p-2" required />
      </div>

      <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition">
        Confirmar Reserva con Tarifa Dinámica
      </button>
    </form>

    <!-- Resultado del cálculo de Yield Management -->
    <div v-if="resultado" class="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg text-green-800">
      <h3 class="font-bold text-lg mb-1">¡Reserva Exitosa!</h3>
      <p>Tarifa Base: ${{ form.precio_base }}</p>
      <p>Multiplicador Aplicado: <strong>x{{ resultado.multiplicador_yield }}</strong></p>
      <p class="text-xl font-extrabold mt-2 text-green-900">Precio Final Dinámico: ${{ resultado.data.precio_aplicado }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
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
        const res = await axios.get('http://localhost:3000/api/habitaciones');
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
        const res = await axios.post('http://localhost:3000/api/reservas', this.form);
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
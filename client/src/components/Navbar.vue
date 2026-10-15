<template>
  <nav class="bg-slate-900 shadow-xl border-b border-slate-700">
    <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-0">
      <!-- Título centrado en móvil, a la izquierda en escritorio -->
      <h1 class="text-3xl font-extrabold text-white tracking-tight">
        Gestor Hotelero
      </h1>

      <!-- Enlaces como botones centrados -->
      <div class="flex items-center gap-3">
        <router-link to="/" class="nav-btn bg-slate-700 text-slate-100 hover:bg-slate-600">
          Cuartelería
        </router-link>
        <router-link to="/reservas" class="nav-btn bg-indigo-600 text-indigo-50 hover:bg-indigo-700">
          Hacer Reserva
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default { name: 'Navbar' };
</script>

<style scoped>
/* Estilo base para los botones de navegación */
.nav-btn {
  @apply px-5 py-2.5 rounded-full text-sm font-semibold transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75;
}
</style>
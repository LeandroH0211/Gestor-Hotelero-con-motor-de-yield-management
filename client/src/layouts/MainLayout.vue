<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Usamos el componente Navbar aquí -->
    <Navbar />

    <!-- Contenido Dinámico de las Vistas -->
    <main class="max-w-7xl mx-auto p-6">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';

export default {
  name: 'MainLayout',
  components: {
    Navbar
  }
};
</script>
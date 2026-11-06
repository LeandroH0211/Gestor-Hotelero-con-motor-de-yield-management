<template>
  <nav class="navbar-custom">
    <div class="navbar-container">
      <!-- Título de la marca -->
      <h1 class="navbar-brand">
        🏨 Gestor Hotelero
      </h1>

      <!-- Enlaces de navegación centrados y estilizados -->
      <div class="navbar-links">
        <router-link to="/" class="nav-btn">
          Cuartelería
        </router-link>
        <router-link to="/reservas" class="nav-btn">
          Hacer Reserva
        </router-link>
        
        <!-- El botón de Admin solo aparece si hay sesión iniciada -->
        <router-link v-if="isLoggedIn" to="/admin" class="nav-btn">
          Admin
        </router-link>

        <!-- Botón de Iniciar Sesión (se oculta si ya está logueado) -->
        <router-link v-if="!isLoggedIn" to="/login" class="nav-btn">
          Iniciar Sesión
        </router-link>

        <!-- Botón de Cerrar Sesión (aparece solo cuando está logueado) -->
        <button v-if="isLoggedIn" @click="cerrarSesion" class="nav-btn btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isLoggedIn: false
    };
  },
  methods: {
    verificarSesion() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },
    cerrarSesion() {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  },
  watch: {
    // Detecta cambios de ruta para refrescar el estado de los botones automáticamente
    '$route'() {
      this.verificarSesion();
    }
  },
  mounted() {
    this.verificarSesion();
  }
};
</script>

<style scoped>
.navbar-custom {
  width: 100%;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 640px) {
  .navbar-container {
    flex-direction: row;
    justify-content: space-between;
  }
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Estilo elegante para los botones de la barra de navegación */
.nav-btn {
  padding: 0.6rem 1.4rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  background: rgba(30, 41, 59, 0.8);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover {
  background: rgba(51, 65, 85, 0.9);
  color: #ffffff;
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.4);
}

/* Botón especial para cerrar sesión */
.btn-logout {
  background: rgba(239, 68, 68, 0.15) !important;
  border-color: rgba(239, 68, 68, 0.3) !important;
  color: #f87171 !important;
  cursor: pointer;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.3) !important;
  color: #ffffff !important;
  border-color: rgba(239, 68, 68, 0.6) !important;
}

/* Botón activo o principal destacado */
.btn-primary, .router-link-active {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
  color: #ffffff !important;
  border-color: rgba(99, 102, 241, 0.8) !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.6) !important;
}
</style>
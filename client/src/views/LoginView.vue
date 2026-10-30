<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Iniciar Sesión</h2>
        <span class="badge-secure">Seguro</span>
      </div>
      <p class="subtitle">Gestor Hotelero - Acceso al Sistema</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            v-model="email" 
            required 
            placeholder="ejemplo@hotel.com" 
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input 
            type="password" 
            v-model="password" 
            required 
            placeholder="********" 
          />
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Autenticando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';

      try {
        const response = await api.post('/auth/login', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('userRole', response.data.usuario.rol);
        
        this.$router.push({ name: 'Dashboard' });

      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 75vh;
  padding: 1.5rem;
}

.login-card {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.92) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.75rem;
  border-radius: 24px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
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

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.login-header h2 {
  margin: 0;
  color: #ffffff;
  font-size: 1.75rem;
  font-weight: 800;
}

.badge-secure {
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
  font-size: 0.9rem;
  text-align: left;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
}

.form-group input {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.8);
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25);
  background: rgba(15, 23, 42, 0.95);
}

.error-msg {
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
  text-align: center;
}

.btn-login {
  width: 100%;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  padding: 0.95rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.55);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>
<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>
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
        // Petición al backend que valida las credenciales y configura la cookie HttpOnly
        const response = await api.post('/auth/login', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('userRole', response.data.usuario.rol);
        
        // Redirigir al usuario al Dashboard principal tras un login exitoso
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
  min-height: 80vh;
  padding: 1rem;
}

.login-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  color: #fff;
}

.login-card h2 {
  margin-bottom: 0.5rem;
  color: #f6ad55;
  text-align: center;
}

.subtitle {
  color: #a0aec0;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #cbd5e0;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #667eea;
}

.error-msg {
  color: #fc8181;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: center;
}

.btn-login {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.btn-login:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
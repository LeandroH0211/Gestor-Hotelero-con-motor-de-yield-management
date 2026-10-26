import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import DashboardView from '../views/DashboardView.vue';
import ReservasView from '../views/ReservasView.vue';
import AdminView from '../views/AdminView.vue';
import LoginView from '../views/LoginView.vue'; // <-- Ya descomentado e importado

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginView 
  }, // <-- Ruta directa para que funcione /login en el navegador
  {
    path: '/',
    component: MainLayout,
    children: [
      { 
        path: '', 
        name: 'Dashboard', 
        component: DashboardView 
      },
      { 
        path: 'reservas', 
        name: 'Reservas', 
        component: ReservasView 
      },
      { 
        path: 'admin', 
        name: 'Admin', 
        component: AdminView,
        meta: { requiresAuth: true, role: 'admin' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardián de navegación global
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth) {
    const userRole = localStorage.getItem('userRole') || 'cliente';
    
    if (to.meta.role && userRole !== to.meta.role) {
      alert('Acceso restringido: Se requieren privilegios de Administrador.');
      next({ name: 'Dashboard' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
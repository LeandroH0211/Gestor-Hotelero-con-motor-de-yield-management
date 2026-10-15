import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import DashboardView from '../views/DashboardView.vue';
import ReservasView from '../views/ReservasView.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Dashboard', component: DashboardView },
      { path: 'reservas', name: 'Reservas', component: ReservasView }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
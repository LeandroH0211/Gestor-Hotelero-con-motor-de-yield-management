import { createApp } from 'vue';
import { createPinia } from 'pinia'; //Importa createPinia
import App from './App.vue';
import router from './router';
import './style.css'; 

const app = createApp(App);
const pinia = createPinia(); //Crea la instancia de Pinia

app.use(pinia); // Regístra en la aplicación Vue
app.use(router);
app.mount('#app');
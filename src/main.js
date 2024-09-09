import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import i18n from '@/plugins/i18n';
// Tailwind styles
import './assets/tailwind.css';
import './assets/index.css'
// Fonts
import './assets/fonts/fonts.css'
import router from './router';

const app = createApp(App);

// Create a Pinia instance and add it to the app
const pinia = createPinia()
app.use(router);
app.use(i18n);
app.use(pinia);
app.mount('#app')

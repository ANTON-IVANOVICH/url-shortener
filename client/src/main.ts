import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import { useAuthStore } from "./stores/authStore";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);

const auth = useAuthStore();
await auth.init();

app.mount("#app");

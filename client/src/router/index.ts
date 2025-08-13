import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import HomeView from "../views/HomeView.vue";
import InfoView from "../views/InfoView.vue";
import AnalyticsView from "../views/AnalyticsView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/info/:shortUrl",
    name: "info",
    component: InfoView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/analytics/:shortUrl",
    name: "analytics",
    component: AnalyticsView,
    props: true,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "login", component: LoginView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const auth = useAuthStore();
  if (!auth.state.authenticated) {
    await auth.init();
  }
  if (to.meta.requiresAuth && !auth.state.authenticated) {
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }
  next();
});

// const InfoView = () => import('@/views/InfoView.vue');
// const AnalyticsView = () => import('@/views/AnalyticsView.vue');

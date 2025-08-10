import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import UrlInfoView from "@/views/UrlInfoView.vue";
import RedirectView from "@/views/RedirectView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/info/:shortUrl",
      name: "url-info",
      component: UrlInfoView,
      props: true,
    },
    {
      path: "/:shortUrl",
      name: "redirect",
      component: RedirectView,
      props: true,
    },
  ],
});

export default router;

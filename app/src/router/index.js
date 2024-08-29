import { createWebHistory, createRouter } from "vue-router";

import Home from "@/views/home.vue";
import auth from "@/views/auth";
import dashboard from "@/views/dashboard";

const routes = [
  { path: "", name: "Home", component: Home },
  ...auth,
  ...dashboard,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

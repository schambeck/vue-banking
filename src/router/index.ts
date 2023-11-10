import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
    },
    {
      path: "/list-saldo",
      name: "list-saldo",
      component: () => import("../views/ListSaldoView.vue"),
    },
    {
      path: "/saldo-detail/:id?",
      name: "saldo-detail",
      component: () => import("../views/SaldoDetailView.vue"),
    },
    {
      path: "/list-conta",
      name: "list-conta",
      component: () => import("../views/ListContaView.vue"),
    },
    {
      path: "/list-extrato",
      name: "list-extrato",
      component: () => import("../views/ListExtratoView.vue"),
    },
    {
      path: "/list-movimentacao/:id",
      name: "list-movimentacao",
      component: () => import("../views/ListMovimentacaoView.vue"),
    },
    {
      path: "/movimentacao-detail/:id?",
      name: "movimentacao-detail",
      component: () => import("../views/MovimentacaoDetailView.vue"),
    },
  ],
});

export default router;

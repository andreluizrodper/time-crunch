const routes = [
  {
    path: "/auth",
    component: () => import("@/layouts/auth.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/views/auth/login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/views/auth/register.vue"),
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: () => import("@/views/auth/forgot-password.vue"),
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: () => import("@/views/auth/reset-password.vue"),
      },
      {
        path: "invite/:account_id",
        name: "invite",
        component: () => import("@/views/auth/invite.vue"),
      },
    ],
  },
];

export default routes;

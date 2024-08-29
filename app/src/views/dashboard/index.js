const routes = [
  {
    path: "/dashboard",
    component: () => import("@/layouts/dashboard.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/dashboard/dashboard.vue"),
      },
      {
        path: "task-dialog/:task_id",
        name: "task-dialog",
        component: () => import("@/views/dashboard/dashboard.vue"),
      },
      {
        path: "project/:id",
        name: "project",
        component: () => import("@/views/dashboard/project/project.vue"),
        children: [
          {
            path: "",
            name: "overview",
            component: () => import("@/views/dashboard/project/overview.vue"),
            children: [
              {
                path: "list",
                name: "list",
                component: () =>
                  import("@/views/dashboard/project/overview/list.vue"),
              },
              {
                path: "kanban",
                name: "kanban",
                component: () =>
                  import("@/views/dashboard/project/overview/kanban.vue"),
              },
              {
                path: "completed",
                name: "completed",
                component: () =>
                  import("@/views/dashboard/project/overview/completed.vue"),
              },
              {
                path: "backlog",
                name: "backlog",
                component: () =>
                  import("@/views/dashboard/project/overview/backlog.vue"),
              },
              {
                path: "sprints",
                name: "sprints",
                component: () =>
                  import("@/views/dashboard/project/overview/sprints.vue"),
              },
            ],
          },
          {
            path: "task/:task_id",
            name: "task",
            component: () => import("@/views/dashboard/project/overview.vue"),
          },
          {
            path: "sprint/:sprint_id",
            name: "sprint",
            component: () => import("@/views/dashboard/project/overview.vue"),
          },
        ],
      },
    ],
  },
];

export default routes;

// router
import { createRouter, createWebHistory } from "vue-router";

import Auth from "@/layout/auth.vue";
import Default from "@/layout/default/index.vue";

import Home from "@/views/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/auth",
      name: "auth-layout",
      component: Auth,
      children: [
        {
          path: "",
          name: "auth-login",
          component: () => import("@/views/Auth/index.vue"),
        },
        {
          path: "one-id",
          name: "auth-login-oneid",
          component: () => import("@/views/Auth/OneId.vue"),
        },
        // {
        //   path: "login",
        //   name: "Login",
        //   component: Login,
        // },
      ],
    },
    {
      path: "/",
      name: "default layout",
      meta: { requiresAuth: true },
      component: Default,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
        },
        {
          path: "info",
          name: "info",
          component: () => import("@/views/Info/index.vue"),
          children: [
            {
              path: "",
              name: "info-ministry",
              redirect: { path: "/info/district" },
              // component: () => import("@/views/Info/ministry/index.vue"),
            },
            {
              path: "region",
              name: "info-region",
              meta: { rank_id: 2 },
              children: [
                {
                  path: "",
                  name: "info-regions",
                  component: () => import("@/views/Info/region/index.vue"),
                },
              ],
            },
            {
              path: "district",
              name: "info-district",
              meta: { rank_id: 3 },
              children: [
                {
                  path: "",
                  name: "info-region-districts",
                  meta: { rank_id: 1 },
                  component: () => import("@/views/Info/district/index.vue"),
                },
                {
                  path: ":region",
                  name: "info-region-district-employess",
                  meta: { rank_id: 2 },
                  component: () => import("@/views/Info/district/[region].vue"),
                },
                {
                  path: ":region/:id",
                  name: "info-district-employess",
                  meta: { rank_id: 3 },
                  component: () => import("@/views/Info/district/[id].vue"),
                },
              ],
            },
            // {
            //   path: "region/:id/:district",
            //   name: "info-district-employess",
            //   component: () => import("@/views/Info/district/[id].vue"),
            // },
          ],
        },
        {
          path: "execution",
          name: "execution",
          component: () => import("@/views/Execution/index.vue"),
          children: [
            {
              path: "",
              name: "execution-ministry",
              redirect: { path: "/execution/district" },
              // component: () => import("@/views/Execution/ministry/index.vue"),
            },
            {
              path: "region",
              name: "execution-region",
              meta: { rank_id: 2 },
              children: [
                {
                  path: "",
                  name: "execution-regions",
                  component: () => import("@/views/Execution/region/index.vue"),
                },
              ],
            },
            {
              path: "district",
              name: "execution-district",
              meta: { rank_id: 3 },
              children: [
                {
                  path: "",
                  name: "execution-region-districts",
                  meta: { rank_id: 1 },
                  component: () =>
                    import("@/views/Execution/district/index.vue"),
                },
                {
                  path: ":region",
                  name: "execution-region-district-employess",
                  meta: { rank_id: 2 },
                  component: () =>
                    import("@/views/Execution/district/[region].vue"),
                },
                {
                  path: ":region/:id",
                  name: "execution-district-employess",
                  meta: { rank_id: 3 },
                  component: () =>
                    import("@/views/Execution/district/[id].vue"),
                },
              ],
            },
          ],
        },
        {
          path: "execution/:id",
          name: "execution-update",
          component: () => import("@/views/Execution/[id].vue"),
        },
        {
          path: "manage",
          name: "manage",
          children: [
            {
              path: "users",
              name: "manage-users",
              component: () => import("@/views/Manage/Users/index.vue"),
            },
            {
              path: "criteria",
              name: "manage-criteria",
              component: () => import("@/views/Manage/Criteria/index.vue"),
            },
            {
              path: "stages",
              name: "manage-stages",
              component: () => import("@/views/Manage/Stages/index.vue"),
            },
            {
              path: "plan",
              name: "manage-plan",
              component: () => import("@/views/Manage/Plan/layout.vue"),
              children: [
                {
                  path: "",
                  name: "manage-plan-regions",
                  component: () => import("@/views/Manage/Plan/index.vue"),
                },
                {
                  path: ":region",
                  name: "manage-plan-districts",
                  component: () => import("@/views/Manage/Plan/[region].vue"),
                },
                {
                  path: ":region/:id",
                  name: "manage-plan-district-employees",
                  component: () => import("@/views/Manage/Plan/[id].vue"),
                },
              ],
            },
          ],
        },
        {
          path: "efficiency",
          name: "efficiency",
          component: () => import("@/views/Efficiency/index.vue"),
          children: [
            {
              path: "",
              name: "efficiency-ministry",
              redirect: { path: "/efficiency/district" },
              // component: () => import("@/views/Efficiency/ministry/index.vue"),
            },
            {
              path: "region",
              name: "efficiency-region",
              meta: { rank_id: 2 },
              children: [
                {
                  path: "",
                  name: "efficiency-region-regions",
                  component: () =>
                    import("@/views/Efficiency/region/index.vue"),
                },
                {
                  path: ":region",
                  name: "efficiency-region-region-employess",
                  component: () =>
                    import("@/views/Efficiency/region/[region].vue"),
                },
                {
                  path: ":region/:id",
                  name: "efficiency-region-employess",
                  component: () => import("@/views/Efficiency/region/[id].vue"),
                },
              ],
            },
            {
              path: "district",
              name: "efficiency-district",
              meta: { rank_id: 3 },
              children: [
                {
                  path: "",
                  name: "efficiency-region-districts",
                  meta: { rank_id: 1 },
                  component: () =>
                    import("@/views/Efficiency/district/index.vue"),
                },
                {
                  path: ":region",
                  name: "efficiency-region-district-employess",
                  meta: { rank_id: 2 },
                  component: () =>
                    import("@/views/Efficiency/district/[region].vue"),
                },
                {
                  path: ":region/:id",
                  name: "efficiency-district-employess",
                  meta: { rank_id: 3 },
                  component: () =>
                    import("@/views/Efficiency/district/[id].vue"),
                },
              ],
            },
          ],
        },
        {
          path: "analytics",
          name: "analytics",
          component: () => import("@/views/Analytics/index.vue"),
          children: [
            {
              path: "",
              name: "analytics-ministry",
              redirect: { path: "/analytics/district" },
              // component: () => import("@/views/Analytics/ministry/index.vue"),
            },
            {
              path: "district",
              name: "analytics-district",
              children: [
                {
                  path: "",
                  name: "analytics-region-districts",
                  component: () =>
                    import("@/views/Analytics/district/index.vue"),
                },
              ],
            },
          ],
        },
        {
          path: "feedback",
          name: "feedback",
          component: () => import("@/views/Feedback/index.vue"),
        },
        {
          path: "ministry",
          name: "ministry",
          component: () => import("@/views/Ministry/Ministry.vue"),
        },
        {
          path: "/ministry/analize",
          name: "ministry_analize",
          component: () => import("@/views/Ministry/MinistryExecution.vue"),
        },
        {
          path: "/ministry/info",
          name: "ministry_info",
          component: () => import("@/views/Ministry/MinistryInfo.vue"),
        },
        {
          path: "/ministry/efficiency",
          name: "ministry_efficiency",
          component: () => import("@/views/Ministry/MinistryEfficiency.vue"),
        },
        {
          path: "/ministry/analytics",
          name: "ministry_analytics",
          component: () => import("@/views/Ministry/MinistryStat.vue"),
        },
      ],
    },
  ],
});

// router.beforeEach(async (to, from, next) => {
//   const { getCookie } = useCookie();
//   const store = useStore();

//   const token = getCookie("token");

//   if (!to.meta.requiresAuth) {
//     return next();
//   }

//   if (!token) {
//     return next({ name: "auth-login" });
//   }

//   try {
//     const user = await store.getUser();

//     if (user) {
//       if (user.role === "HR_MANAGER") {
//         // HR_MANAGER should only access manage-users page
//         if (to.name !== "manage-users") {
//           return next({ name: "manage-users" });
//         }
//         return next();
//       }
      
     
//       return next();
//     } else {
//       next({ name: "auth-login" });
//     }
//   } catch (error) {
//     console.error("User fetch failed:", error);
//     next({ name: "auth-login" });
//   }
// });

export default router;

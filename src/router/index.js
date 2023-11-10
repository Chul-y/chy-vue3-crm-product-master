import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history:createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import("pages/login/index.vue")
    },
    //配置404页面
    {
      path: '/:pathMatch(.*)*',
      component: () => import("pages/page404/index.vue")
    }
  ]
})

export default router

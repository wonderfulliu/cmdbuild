import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import home from '@/pages/home'
import config from '@/pages/configMsg/config'
import chart from '@/pages/chart/chart'
import view from '@/pages/view/view'
import workflow from '@/pages/workFlow/workFlow'
import search from '@/pages/search/search'

Vue.use(Router)


let router = new Router({
  //mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'home',
      component: home,
      children: [
        {
          path: '/config',
          name: 'config',
          meta:{
            requiresAuth: true
          },
          component: config
        },
        {
          path: '/chart',
          name: 'chart',
          meta:{
          requiresAuth: true
        },
          component: chart
        },
        {
          path: '/view',
          name: 'view',
          meta:{
            requiresAuth: true
          },
          component: view
        },
        {
          path: '/workflow',
          name: 'workFlow',
          meta:{
            requiresAuth: true
          },
          component: workflow
        },
        {
          path: '/search',
          name: 'search',
          meta:{
            requiresAuth: true
          },
          component: search
        }
      ]
    },
    {
      path: '/config',
      name: 'config',
      component: config
    }
  ]
});
export default router; //将路由器导出

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)){  // 判断该路由是否需要登录权限
    let userInfo = sessionStorage.getItem('groupInfo');
    if (userInfo) {  // 判断当前的session是否存在groupInfo
      next();
    }
    else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
});



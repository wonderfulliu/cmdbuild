import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import home from '@/pages/home'
import config from '@/pages/configMsg/config'
import chart from '@/pages/chart/chart'
import view from '@/pages/view/view'
import workflow from '@/pages/workFlow/workFlow'

Vue.use(Router) 
  
export default new Router({
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
          component: config
        },
        {
          path: '/chart',
          name: 'chart',
          component: chart
        },
        {
          path: '/view',
          name: 'view',
          component: view
        },
        {
          path: '/workflow',
          name: 'workFlow',
          component: workflow
        },
      ]
    },
    {
      path: '/config',
      name: 'config',
      component: config
    }
  ] 
})

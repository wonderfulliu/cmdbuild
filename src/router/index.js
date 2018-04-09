
import Vue from 'vue'
import Router from 'vue-router'
// 主组件
import login from '@/pages/login'
// 主页
import home from '@/pages/home'
// 配置信息
import config from '@/pages/configMsg/config'
// chart
import chart from '@/pages/chart/chart'
// 视图
import view from '@/pages/view/view'
// 工作流
import workflow from '@/pages/workFlow/workFlow'
// search
import search from '@/pages/search/search'
import result from '@/pages/search/result'
import edit from '@/pages/search/edit'
// 测试 没用
import test from '@/pages/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
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
        {
          path: '/search',
          name: 'search',
          component: search
        },
        {
          path: '/test',
          name: 'test',
          component: test
        },
        {
          path: '/result',
          name: 'result',
          component: result,
        },
        {
          path: '/edit',
          name: 'edit',
          component: edit
        }
      ]
    },
    {
      path: '/config',
      name: 'config',
      component: config
    }
  ]
})



import Vue from 'vue'
import Router from 'vue-router'
// 主组件
import login from '@/pages/login'
// 主页
import home from '@/pages/home'

// 配置信息
import config from '@/pages/configMsg/config'
import tableList from '@/pages/configMsg/tableList'
import cDashboard from '@/pages/configMsg/dashboard'
import historyRecord from '@/pages/configMsg/history/history'
  // 添加, 编辑
import cadd from '@/pages/configMsg/add'
import cedit from '@/pages/configMsg/edit'
import configEdit from '@/pages/configMsg/configEdit'
  //应用组件
import password from '@/pages/configMsg/apply/password'
import importXLS from '@/pages/configMsg/apply/importXLS'
import exportXLS from '@/pages/configMsg/apply/exportXLS'
import importRelate from '@/pages/configMsg/apply/importRelate'
import exportRelate from '@/pages/configMsg/apply/exportRelate'
  // relation组件
import relation from '@/pages/configMsg/relation/relation'
import relationTable from '@/pages/configMsg/relation/relationTable'

// chart
import chart from '@/pages/chart/chart'
import dashboard from '@/pages/chart/dashboard'
// 视图
import view from '@/pages/view/view'
// 工作流
import workflow from '@/pages/workFlow/workFlow'
import operate from '@/pages/workFlow/operate'
import byself from '@/pages/workFlow/ways/byself'
import byexcel from '@/pages/workFlow/ways/byexcel'
// search
import search from '@/pages/search/search'
import result from '@/pages/search/result'
import edit from '@/pages/search/edit'
import add from '@/pages/search/add'
import editTable from '@/pages/search/editTable'
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
          component: config,
          children: [
            {
              path: 'tableList',
              name: 'tableList',
              component: tableList
            },
            {
              path: 'cDashboard',
              name: 'cDashboard',
              component: cDashboard
            },
            {
              path: 'historyRecord',  //历史记录
              name: 'historyRecord',
              component: historyRecord
            },
            {
              path: 'password',
              name: 'password',
              component: password
            },
            {
              path: 'importXLS',
              name: 'importXLS',
              component: importXLS
            },
            {
              path: 'exportXLS',
              name: 'exportXLS',
              component: exportXLS
            },
            {
              path: 'importRelate',
              name: 'importRelate',
              component: importRelate
            },
            {
              path: 'exportRelate',
              name: 'exportRelate',
              component: exportRelate
            },
            {
              path: 'relation',
              name: 'relation',
              component: relation
            },
            {
              path: 'relationTable',
              name: 'relationTable',
              component: relationTable
            },
            {
              path: 'cadd',
              name: 'add',
              component: cadd
            },
            {
              path: 'cedit',
              name: 'cedit',
              component: cedit
            },
            {
              path: 'configEdit',
              name: 'configEdit',
              component: configEdit
            }
          ]
        },
        {
          path: '/chart',
          name: 'chart',
          component: chart,
          children:[
            {
              path: 'dashboard',
              name: 'dashboard',
              component: dashboard
            }
          ]
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
          path: '/workflow/operate',
          name: 'operate',
          component: operate,
          children: [
            {
              path: 'byself',
              name: 'byself',
              component: byself
            },
            {
              path: 'byexcel',
              name: 'byexcel',
              component: byexcel
            },
          ]
        },
        {
          path: '/search',
          name: 'search',
          component: search,
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
        },
        {
          path: '/editTable',
          name: 'editTable',
          component: editTable
        },
        {
          path: '/add',
          name: 'add',
          component: add
        }
      ]
    },
    // {
    //   path: '/config',
    //   name: 'config',
    //   component: config
    // }
  ],
  // mode: 'history',//可以吧 # 给掉
})


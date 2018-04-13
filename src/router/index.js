
import Vue from 'vue'
import Router from 'vue-router'
// 主组件
import login from '@/pages/login'
// 主页
import home from '@/pages/home'

// 配置信息
import config from '@/pages/configMsg/config'
import tableList from '@/pages/configMsg/tableList'
import addRecord from '@/pages/configMsg/addRecord'
import historyRecord from '@/pages/configMsg/history/history'
//应用组件
import importXLS from '@/pages/configMsg/apply/importXLS'
import exportXLS from '@/pages/configMsg/apply/exportXLS'
import importRelate from '@/pages/configMsg/apply/importRelate'
import exportRelate from '@/pages/configMsg/apply/exportRelate'


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
              path: 'addRecord',  //新增记录
              name: 'addRecord',
              component: addRecord
            },
            {
              path: 'historyRecord',  //历史记录
              name: 'historyRecord',
              component: historyRecord
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
            }
          ]
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


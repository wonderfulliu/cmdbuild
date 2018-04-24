// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'//导入vue
import App from './App'//导入app.vue组件
import router from './router'//导入路由
import iView from 'iview'//导入框架
import 'iview/dist/styles/iview.css'
import axios from 'axios'//导入axios
import querystring from 'querystring'//导入字符串
import Vuex from 'vuex'//导入vuex

Vue.config.productionTip = false
Vue.use(iView)//使用iview
Vue.use(Vuex)//使用vuex
Vue.prototype.$http = axios//使用axios
Vue.prototype.$qs = querystring;//使用字符串

//公共仓库存储数据
const store = new Vuex.Store({
  state: {//里面放数据
    tableMsg: '', //中英文对应表
    searchMsg: '', //这个是数据
  },
  mutations: {//里面放方法
    getsearchMsg(state, val){//后面可以传参数val, 是为了适应下面传的参数, 不是必须的
      state.searchMsg = val
    },
    gettableMsg(state, val){
      state.tableMsg = val
    }
  }
})
//某一个组建的方法中使用下面方法改变数据, 里面可以传别的参数val,但是getsearchMsg这个方法必须要接收这个参数才行, vuex会自动把添加的参数
// this.$store.commit('getsearchMsg', val);
//另一个组件通过以下方法就可以获取, searchMsg就是要获取的数据
// this.$store.state.searchMsg

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

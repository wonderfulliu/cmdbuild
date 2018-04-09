// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import querystring from 'querystring'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(Vuex)
Vue.prototype.$http = axios
Vue.prototype.$qs = querystring;

//公共仓库存储数据
const store = new Vuex.Store({
  state: {//里面放数据
    tableMsg: '', //中英文对应表
    searchMsg: '', //这个是搜索时输入的数据
    editMsg: '', //点击编辑的时候传入的数据
  },
  mutations: {//里面放方法
    getsearchMsg(state, val){//后面可以传参数val, 是为了适应下面传的参数, 不是必须的
      state.searchMsg = val
    },
    gettableMsg(state, val){
      state.tableMsg = val
    },
    geteditMsg(state, val){
      state.editMsg = val;
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

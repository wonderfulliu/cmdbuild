// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'//导入vue
import App from './App'//导入app.vue组件
import router from './router'//导入路由
import iView from 'iview'//导入框架
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import querystring from 'querystring'
import Vuex from 'vuex'
import '../static/scss/base.css'   //公共样式

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(Vuex)
Vue.prototype.$http = axios

Vue.prototype.$qs = querystring;

//公共仓库存储数据
const store = new Vuex.Store({
  state: {//里面放数据
    Mode: '',//权限
    tableMsg: '', //中英文对应表
    searchMsg: '', //这个是搜索时输入的数据
    editMsg: '', //点击编辑的时候传入的数据
    lookupMsg: '', //存储lookup数据类型
    editTable: '',
    chooseMsg: '',//reference选择好的信息
    refrelationTable: '',//存储关系表名
    addMsg: '',//新增数据时, 传递的待渲染的数据
    refMsg: '',
    // 以下是relation组件传递的信息
    relationMsg: '',
    domainlistMsg: '',
  },
  mutations: {//里面放方法
    getMode(state, val){
      state.Mode = val
    },
    getsearchMsg(state, val){//后面可以传参数val, 是为了适应下面传的参数, 不是必须的
      state.searchMsg = val
    },
    gettableMsg(state, val){
      state.tableMsg = val
    },
    geteditMsg(state, val){
      state.editMsg = val;
    },
    getlookupMsg(state, val){
      state.lookupMsg = val;
    },
    getedittableMsg(state, val){
      state.editTable = val;
    },
    getchooseMsg(state, val){
      state.chooseMsg = val;
    },
    getrefrelationTable(state, val){
      state.refrelationTable = val;
    },
    getaddMsg(state, val){
      state.addMsg = val;
    },
    getrefMsg(state, val){
      state.refMsg = val;
    },
    // 以下是relation组件的信息
    getrelationMsg(state, val){
      state.relationMsg = val;
    },
    getdomainlistMsg(state, val){
      state.domainlistMsg = val;
    },
  }
})
//某一个组建的方法中使用下面方法改变数据, 里面可以传别的参数val,但是getsearchMsg这个方法必须要接收这个参数才行, vuex会自动把添加的参数
// this.$store.commit('getlookupMsg', val);
//另一个组件通过以下方法就可以获取, searchMsg就是要获取的数据
// this.$store.state.lookupMsg


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

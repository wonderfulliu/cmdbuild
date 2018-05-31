// 自定义指令写在此处
import Vue from 'vue'//导入vue

Vue.directive('focus', {
  inserted(el, binding){
    el.focus();
  },
})
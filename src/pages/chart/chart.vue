<template>
  <div id="chartContainer">
    <Layout>
      <Sider hide-trigger collapsible width="240" :collapsed-width="0" v-model="isCollapsed">
        <Menu theme="dark"
              width="auto"
              :class="menuitemClasses"
              :style="{maxHeight:menuHeight,overflowY:'auto'}">
          <MenuItem :key="index"
                    :name="'1-' + index + 1"
                    v-for="(item, index) in sideMenu.dataList"
                    @click.native="getSelectMenuData(item)"
                    :class="{'ivu-menu-item-active':sideMenu.active&&index==0}">
            <span>{{ item.description }}</span>
          </MenuItem>
        </Menu>
      </Sider>
      <transition name="fade" mode="out-in">
        <router-view :currentMsg="sideMenu.currentItem"></router-view>
      </transition>
    </Layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //侧栏数据
      sideMenu:{
        dataList:[], //侧栏菜单数据集合
        active: true, //侧栏默认选中
        currentItem: {},//当前dashboard数据
      },
      menuHeight: '', //侧栏内容最大高度
      isCollapsed: false
    };
  },
  created(){
    this.getsideMenu();
  },
  mounted(){
    let _this = this;
    window.onresize = () => {
      _this.heightAdaptive();
    }
  },
  methods:{
    //获取侧栏数据
    getsideMenu(){
      let _this = this;
      this.$http.get("/dashboardController/getFunctionMenu")
        .then(function(info){
          if(info){
            let newArr = [];
            info.data.forEach(function(v, i){
              let oItem = JSON.parse(v);
              if(i ==0){
                _this.sideMenu.currentItem = oItem; //初始加载
                _this.$router.push({ path: "/chart/dashboard" });
              }
              newArr.push(oItem);
            });
            _this.sideMenu.dataList = newArr;
          }
        })
    },
    //点击侧栏获取数据
    getSelectMenuData(item){
      this.sideMenu.active = false;
      this.sideMenu.currentItem = item;
      // console.log(item)
      this.$router.push({ path: "/chart/dashboard" });
    },
    // 高度自适应
    heightAdaptive() {
      let clientH = document.documentElement.clientHeight;
      this.menuHeight = clientH - 104 + 'px';
    },

  },
  computed: {
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
  },
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
}
#chartContainer {
  height: 100%;
  background-color: #eee;
}
</style>

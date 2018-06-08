<template>
  <div id="homeContainer">
    <div class="layout">
      <Layout>
        <Header>
          <Menu mode="horizontal" theme="dark" active-name="1">
            <div class="layout-logo">
              <a id="logo" href="#/search"><img src="../../static/logo.png" alt="LOGO"></a>
            </div>
            <div class="layout-nav">
              <router-link to="/search">
                <MenuItem name="1" >
                  <Icon type="search"></Icon>
                  全局搜索
                </MenuItem>
              </router-link>
              <router-link to="/config/tableList">
                <MenuItem name="2">
                  <Icon type="home"></Icon>
                  配置信息
                </MenuItem>
              </router-link>
              <router-link to="/view">
                <MenuItem name="3">
                  <Icon type="map"></Icon>
                  视图
                </MenuItem>
              </router-link>
              <!-- <router-link to="/workflow" exact>
                <MenuItem name="4">
                  <Icon type="pin"></Icon>
                  工作流
                </MenuItem>
              </router-link> -->
              <router-link to="/chart/dashboard">
                <MenuItem name="5">
                  <Icon type="stats-bars"></Icon>
                  Charts
                </MenuItem>
              </router-link>
            </div>
            <div class="layout-user">
              <MenuItem name="5" @click.native="usermanualDownload" v-if="screenWidth>1140">
                <Button type="primary">
                  用户手册
                  <Icon type="archive"></Icon>
                </Button>
              </MenuItem>
              <MenuItem class="userInfo" name="5" v-if="screenWidth>1010">
                <div class="buddha">
                  <Icon type="person"></Icon>
                </div>
                <div class="explain">
                  <p>{{ userName }}</p>
                  <p>{{ group }}</p>
                </div>
              </MenuItem>
              <MenuItem name="5" @click.native="logout">
                <Icon class="logoutIcon" type="android-exit"></Icon>
              </MenuItem>
            </div>
          </Menu>
        </Header>
        <transition name="fade" mode="out-in">
          <router-view :clientH="screenHeight"
                       :clientW="screenWidth">
          </router-view>
        </transition>
      </Layout>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isCollapsed: false,
        userName: JSON.parse(sessionStorage.getItem('groupInfo')).user,
        group: JSON.parse(sessionStorage.getItem('groupInfo')).Description,
        path: '',
        navActive:0,
        //屏宽屏高
        screenHeight: document.body.clientHeight,//屏高
        screenWidth: document.body.clientWidth,//屏宽
      };
    },
    created(){
      this.getDashboardList();
    },
    mounted () {
      let _this = this;
      _this.clientSizeChange();
      window.onresize = () => {
        _this.clientSizeChange();
      }
    },
    computed: {
      rotateIcon() {
        return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
      },
      menuitemClasses() {
        return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
      }
    },
    methods: {
      collapsedSider() {
        this.$refs.side1.toggleCollapse();
      },
      logout: function(){
        //清除session信息
        sessionStorage.clear();
        //跳转页面
        this.$router.push({ path: '/' });
      },
      usermanualDownload(){
        let data = 'CMDBuild新系统用户使用手册v1.1.docx';
        window.open(
          "/fileController/downLoadFile?fileName=" + data,
          "_self"
        )
      },
      getDashboardList(){
        this.$http.get('/dashboardController/getFunctionMenu')
          .then(info => {
          let newArr = [];
          info.data.forEach(function(v, i){
            newArr.push(JSON.parse(v));
          });
          sessionStorage.setItem("DashboardMenuList",JSON.stringify(newArr));
        })
      },
      clientSizeChange(){
        this.screenHeight = document.body.clientHeight;
        this.screenWidth = document.body.clientWidth;
      }
  }
  }
</script>

<style lang="scss">

</style>

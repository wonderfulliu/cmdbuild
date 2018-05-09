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
              <router-link to="/search" active-class>
                <MenuItem name="1" >
                  <Icon type="search"></Icon>
                  全局搜索
                </MenuItem>
              </router-link>
              <router-link to="/config/tableList" active-class>
                <MenuItem name="2">
                  <Icon type="home"></Icon>
                  配置信息
                </MenuItem>
              </router-link>
              <router-link to="/view" active-class>
                <MenuItem name="3">
                  <Icon type="map"></Icon>
                  视图
                </MenuItem>
              </router-link>
              <!-- <router-link to="/workFlow" active-class>
                <MenuItem name="4">
                  <Icon type="pin"></Icon>
                  工作流
                </MenuItem>
              </router-link> -->
              <router-link to="/chart" active-class>
                <MenuItem name="5">
                  <Icon type="stats-bars"></Icon>
                  Charts
                </MenuItem>
              </router-link>
            </div>
            <div class="layout-user">
              <MenuItem class="userInfo" name="5">
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
          <router-view></router-view>
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
        navActive:0
      };
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
      }
  }
  }
</script>

<style lang="scss">

</style>

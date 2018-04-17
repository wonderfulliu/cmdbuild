<template>
  <div id="homeContainer">
    <div class="layout">
      <Layout>
        <Header>
          <Menu mode="horizontal" theme="dark" active-name="1">
            <div class="layout-logo">
              <img src="../../static/logo.png" alt="LOGO">
            </div>
            <div class="layout-nav">
              <MenuItem name="1">
                <router-link to="/search">
                  <Icon type="search"></Icon>
                  全局搜索
                </router-link>
              </MenuItem>
              <MenuItem name="2">
                <router-link to="/config">
                  <Icon type="home"></Icon>
                  配置信息
                </router-link>
              </MenuItem>
              <MenuItem name="3">
                <router-link to="/view">
                  <Icon type="map"></Icon>
                  视图
                </router-link>
              </MenuItem>
              <MenuItem name="4">
                <router-link to="/workFlow">
                  <Icon type="pin"></Icon>
                  工作流
                </router-link>
              </MenuItem>
              <MenuItem name="5">
                <router-link to="/chart">
                  <Icon type="stats-bars"></Icon>
                  Charts
                </router-link>
              </MenuItem>
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
              <MenuItem name="5">
                <router-link to="/">
                  <Icon class="logoutIcon" type="android-exit"></Icon>
                </router-link>
              </MenuItem>

              <!--<Dropdown trigger="click" >
                  <Avatar icon="person" size="small" />
                  <a href="javascript:void(0)">
                       {{ userName }}
                      <Icon type="chevron-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                      <DropdownItem>{{ group }}</DropdownItem>
                      <DropdownItem>
                          <a @click="logout">退出</a>
                      </DropdownItem>
                  </DropdownMenu>
              </Dropdown>-->
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
        group: JSON.parse(sessionStorage.getItem('groupInfo')).Description
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
      logout: function () {
        //清除session信息
        sessionStorage.clear();
        //跳转页面
        this.$router.push({path: '/login'});
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
  #homeContainer {
    height: 100%;
    margin-left: -1px;

  .layout {
    height: 100%;

  .ivu-layout {
    height: 100%;

  .ivu-layout-header {

  .layout-nav {
    float: left;
    margin-left: 60px;
    width: 560px;
    overflow: hidden;
  .ivu-menu-item {

  a {
    color: #e3e3e3;

  .ivu-icon {
    margin-right: 5px;
  }

  }
  a:hover {
    color: #fff;
  }

  }

  }
  }
  .layout-header-bar {

  .ivu-icon {
    float: left;
    cursor: pointer;
  }

  }
  .ivu-layout-content {
    /*background-color: skyblue !important;*/
  }

  }
  }
  }

  .ivu-layout-header,
  .ivu-layout-sider,
  .ivu-layout-sider,
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background: #2a3f54;

  .ivu-menu-submenu-title {
    background: #2a3f54;
  }

  }
  .ivu-menu-dark {
    background: #2a3f54;
  }

  .ivu-menu-submenu:hover {
    background: #243546;
  }

  .ivu-tree-arrow i {
    color: #38536d;
  }

  .layout-user {
    .userInfo {
      margin-right: 10px;
      .buddha,
      .explain {
        position: relative;
        display: block;
      }

      .buddha {
        line-height: 26px;
        width: 26px;
        height: 26px;
        background: #bfc5cc;
        border-radius: 50%;
        top: 17px;
        font-size: 22px;
        color: #2c4055;
      }
      .explain{
        margin-left: 10px;
        left: 26px;
        top: -15px;
        text-align: left;
        /*clear: both;*/
      }
      .explain p {
        line-height: 20px;
        font-size: 12px;
        color: #cccccc;
      }
    }
    .logoutIcon{
      font-size: 26px;
      line-height: 60px;
      color: #bfc5cc;
    }
    .logoutIcon:hover{
      color: #e5ecf4;
    }
  }

  /* 以下是原生样式*/
  .ivu-layout-header {
    padding: 0;
  }

  .layout-user {
    float: right;
    padding-right: 20px;
  }

  .layout-user .ivu-dropdown .ivu-dropdown-rel a {
    color: #c6c8cd;
  }

  .layout-user .ivu-dropdown .ivu-dropdown-rel a:hover {
    color: #fff;
  }

  .layout-user .ivu-select-dropdown .ivu-dropdown-item a {
    color: #495060;
  }

  .layout-user .ivu-avatar-icon {
    margin-right: 2px;
  }

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-logo {
    width: 200px;
    height: 36px;
    background: #23384e;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-logo img {
    width: 100%;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }

  .layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }

  .menu-icon {
    transition: all 0.3s;
  }

  .rotate-icon {
    transform: rotate(-90deg);
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    /*width: 69px;*/
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size 0.2s ease, transform 0.2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width 0.2s ease;
  }

  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>

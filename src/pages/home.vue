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
                            <Icon type="search"></Icon>
                            <router-link to="/search">全局搜索</router-link>
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="home"></Icon>
                            <router-link to="/config">配置信息</router-link>
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon type="map"></Icon>
                            <router-link to="/view">视图</router-link>
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon type="pin"></Icon>
                            <router-link to="/workFlow">工作流</router-link>
                        </MenuItem>
                        <MenuItem name="5">
                            <Icon type="stats-bars"></Icon>
                            <router-link to="/chart">Charts</router-link>
                        </MenuItem>
                    </div>
                    <div class="layout-user">
                        <Dropdown trigger="click" >
                            <Avatar icon="person" size="small" />
                            <a href="javascript:void(0)">
                                用户名
                                <Icon type="chevron-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem>用户组名</DropdownItem>
                                <DropdownItem>
                                    <a>退出</a>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
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
      isCollapsed: false
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
    }
  }
};
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
          margin: 0px auto;
          margin-left: 250px;
          width: 550px;
        }
      }
      .layout-header-bar {
        .ivu-icon {
          float: left;
          cursor: pointer;
        }
      }
      .ivu-layout-content{
        /*background-color: skyblue !important;*/
      }
    }
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
  background: #5b6270;
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
  width: 69px;
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
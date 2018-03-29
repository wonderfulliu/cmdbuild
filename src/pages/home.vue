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
                            <Icon type="home"></Icon>
                            配置信息
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="map"></Icon>
                            视图
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon type="pin"></Icon>
                            工作流
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon type="stats-bars"></Icon>
                            Charts
                        </MenuItem>
                        <MenuItem name="5">
                            <Icon type="search"></Icon>
                            全局搜索
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
            <!-- <Layout>
                <Sider ref="side1" collapsible :collapsed-width="0" v-model="isCollapsed">
                    <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses" accordion>
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-analytics"></Icon>
                                Navigation One
                            </template>
                            <MenuGroup title="Item 1">
                                <MenuItem name="1-1">Option 1</MenuItem>
                                <MenuItem name="1-2">Option 2</MenuItem>
                            </MenuGroup>
                            <MenuGroup title="Item 2">
                                <MenuItem name="1-3">Option 3</MenuItem>
                                <MenuItem name="1-4">Option 4</MenuItem>
                            </MenuGroup>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="ios-filing"></Icon>
                                Navigation Two
                            </template>
                            <MenuItem name="2-1">Option 5</MenuItem>
                            <MenuItem name="2-2">Option 6</MenuItem>
                            <Submenu name="3">
                                <template slot="title">Submenu</template>
                                <MenuItem name="3-1">Option 7</MenuItem>
                                <MenuItem name="3-2">Option 8</MenuItem>
                            </Submenu>
                        </Submenu>
                        <Submenu name="4">
                            <template slot="title">
                                <Icon type="ios-gear"></Icon>
                                Navigation Three
                            </template>
                            <MenuItem name="4-1">Option 9</MenuItem>
                            <MenuItem name="4-2">Option 10</MenuItem>
                            <MenuItem name="4-3">Option 11</MenuItem>
                            <MenuItem name="4-4">Option 12</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Header :style="{padding: 0}" class="layout-header-bar">
                    </Header>
                    <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                        Content
                    </Content>
                </Layout>
            </Layout> -->
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
  .layout{
    height: 100%;
    .ivu-layout{
      height: 100%;
      .ivu-layout-header{
        .layout-nav{
          margin: 0px auto;
          margin-left: 250px;
          width: 550px;
        }
      }
      .layout-header-bar{
        .ivu-icon{
          float: left;
          cursor: pointer;
        }
      }
      .ivu-layout-content{
        // background-color: skyblue !important;
      }
    }
  }
}


/* 以下是原生样式*/
.ivu-layout-header{
    padding: 0;
}

.layout-user{
    float: right;
    padding-right: 20px;
}

.layout-user .ivu-dropdown .ivu-dropdown-rel a{
    color: #c6c8cd;
}

.layout-user .ivu-dropdown .ivu-dropdown-rel a:hover{
    color: #fff;
}

.layout-user .ivu-select-dropdown .ivu-dropdown-item a{
    color: #495060;
}

.layout-user .ivu-avatar-icon{
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
.layout-logo img{
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
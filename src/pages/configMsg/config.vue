<template>
  <div id="configContainer">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed">
        <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" :class="menuitemClasses" accordion>
          <Submenu name="1">
            <template slot="title">
              配置信息列表
            </template>
            <div class="treeContent">
              <!--树状菜单-->
              <Tree :data="ConfigTreeData" @on-select-change="getTreeNodes"></Tree>
            </div>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              应用组件
            </template>
            <router-link to="/config/importXLS">
              <MenuItem name="2-1">导入XLS文件</MenuItem>
            </router-link>
            <router-link to="/config/exportXLS">
              <MenuItem name="2-2">导出XLS文件</MenuItem>
            </router-link>
            <router-link to="/config/importRelate">
              <MenuItem name="2-3">导入关系文件</MenuItem>
            </router-link>
            <router-link to="/config/exportRelate">
              <MenuItem name="2-4">导出关系文件</MenuItem>
            </router-link>
          </Submenu>
        </Menu>
      </Sider>

      <transition name="fade" mode="out-in">
        <router-view :tableName='tableName'
                     :collapsedSider='collapsedSider'
                     :rotateIcon='rotateIcon'
                     @transferRecord='getRecordId'
                     :recordId='recordId'
                     :Mode='Mode'>
        </router-view>
      </transition>

    </Layout>

  </div>

</template>
<script>
export default {
  data() {
    return {
      isCollapsed: false,
      ConfigTreeData: "", //树状目录
      //页面配置：
      groupName: JSON.parse(sessionStorage.getItem("groupInfo")).Code, //组名
      tableName: "", //表名
      recordId: "",
      Authority: "", //存储权限
      Mode: ""
    };
  },
  created: function() {
    this.getAuthority(); //获取权限
    this.getTreeData(); //侧栏树形菜单
  },
  computed: {
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    getTreeData() {
      let _this = this;
      //侧栏树形菜单数据获取
      _this.$http
        .post("/authorityController/getMenu?groupName=" + _this.groupName)
        .then(function(info) {
          let oData = info.data.children;
          let treeMenu = sessionStorage.getItem(_this.groupName + "_menu");
          if (treeMenu) {
          } else {
            sessionStorage.setItem(
              _this.groupName + "_menu",
              JSON.stringify(oData)
            );
          }
          let objTree = objFunc(oData);
          _this.ConfigTreeData = newTreeFunc(objTree); //打开侧栏第一个选项

          function newTreeFunc(obj) {
            if (obj.length > 0) {
              obj[0].expand = true;
              if (obj[0].children) {
                newTreeFunc(obj[0].children);
              } else {
                let eName = obj[0].idElementClass.split('"').join("");
                _this.tableName = eName; //获取表名
                _this.Mode = obj[0].Mode;
                _this.$router.push({ path: "/config/tableList" });
              }
            }
            return obj;
          }
          function objFunc(d) {
            //此方法是将拿到的接口数据转换成新的格式，便于渲染树形菜单
            let oTree = [];
            d.forEach(function(v, i) {
              let oBranch = {};
              oBranch.title = v.description;
              oBranch.expand = false; //菜单是否展开 true展开
              if (v.children.length != 0) {
                oBranch.children = objFunc(v.children);
              } else {
                oBranch.idElementClass = v.idElementClass; //表名英文
                oBranch.Mode = _this.WorR(_this.Authority, v.idElementClass); //权限
              }
              oTree.push(oBranch); //对象追加到数组末尾
            });
            return oTree; //返回新生成的数组对象
          }
        });
    },
    getTreeNodes(select) {
      let _this = this;
      if (!select.children) {
        let eName = select[0].idElementClass.split('"').join(""); //获取英文名
        _this.tableName = eName; //获取表名
        _this.$router.push({ path: "/config/tableList" });
        this.Mode = select[0].Mode;
        console.log(this.Mode);//点击的表
      }
    },
    getRecordId(msg) {
      this.recordId = msg;
    },
    // 获取与处理权限
    getAuthority() {
      this.Authority = this.$store.state.Mode;
    },
    WorR(authority, eName) {
      let Mode;
      authority.forEach(function(v, i) {
        if (v.table_name == eName.replace(/\"/g, "")) {
          Mode = v.Mode;
        }
      });
      return Mode;
    }
  }
};
</script>

<style lang="scss">
#configContainer {
  height: 100%;
}

</style>

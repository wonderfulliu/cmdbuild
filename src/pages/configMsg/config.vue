<template>
  <div id="configContainer">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible width="240" :collapsed-width="0" v-model="isCollapsed">
        <AutoComplete v-model="searchMsg" :data="targetTable" clearable placeholder="请输入表名" size="small" style="width: 200px" @on-search="asideSearch" @on-select="selected" :transfer="tOrf"></AutoComplete>
        <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" accordion>
          <Submenu name="1">
            <template slot="title">
              配置信息列表
            </template>
            <div class="treeContent">
              <!--树状菜单-->
              <Tree :data="ConfigTreeData"
                    @on-select-change="getTreeNodes"></Tree>
            </div>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              应用组件
            </template>
            <router-link to="/config/exportXLS">
              <MenuItem name="2-2">导出XLS文件</MenuItem>
            </router-link>
            <router-link to="/config/importXLS">
              <MenuItem name="2-1">导入XLS文件</MenuItem>
            </router-link>
            <router-link to="/config/exportRelate">
              <MenuItem name="2-4">导出关系文件</MenuItem>
            </router-link>
            <router-link to="/config/importRelate">
              <MenuItem name="2-3">导入关系文件</MenuItem>
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
                     :Mode='Mode'
                     :tableType='tableType'
                     :funcionName="funcionName"
                     :tableCname='tableCname'
                     @sTof="getMfs"
                     :pageNums="pageNums"
                     :Id="Id">
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
      ConfigTreeData: [], //树状目录
      //页面配置：
      groupName: JSON.parse(sessionStorage.getItem("groupInfo")).Code, //组名
      tableName: "", //表名
      tableCname: "", //表的中文名
      funcionName: "",
      tableType: "", //表类别
      recordId: "",
      Authority: "", //存储权限
      Mode: "",
      searchMsg: "", //侧边栏表格搜索
      searchedMsg: '',//选中的侧边栏信息
      targetTable: [], //符合搜索结果的信息
      flag: true,//判断函数的执行状态
      flags: false,
      tOrf: true,//使侧边栏搜索到的内容在上面显示, 而不是被覆盖在下面
      relationMsg: '',
      pageNums: 1,
      Id: null,
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
  watch:{
    searchedMsg: function(){
      this.gettableEname(this.ConfigTreeData, this.searchedMsg);
    },
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    //侧栏树形菜单数据获取
    getTreeData() {
      this.$http
        .post("/authorityController/getMenu?groupName=" + this.groupName)
        .then((info) => {
          let oData = info.data.children;//侧边栏原始数据
          let treeMenu = sessionStorage.getItem(this.groupName + "_menu");
          if (treeMenu) {
          } else {
            sessionStorage.setItem(
              this.groupName + "_menu",
              JSON.stringify(oData)
            );
          }
          let objTree = this.objFunc(oData); //将得到的数据转换成需要的格式
          this.ConfigTreeData = this.getEnter(objTree);
          this.ConfigTreeData = this.newTreeFunc(objTree); //打开侧栏第一个选项
        });
    },
    //此方法是将拿到的侧边栏数据转换成新的格式，便于渲染树形菜单, 也是在这里将权限放到了每个侧边栏中
    objFunc(d) {
      let oTree = [];
      d.forEach((v, i) => {
        let oBranch = {};
        oBranch.title = v.description;
        oBranch.type = v.type;

        if (v.type == "view" || v.type == "dashboard") {
          oBranch.funcionName = v.functionName;
        } else if (v.type == "folder") {
          oBranch.expand = false; //菜单是否展开 true展开
          if (v.children.length != 0) {
            oBranch.children = this.objFunc(v.children);
          } else {
            oBranch.children = [{ title: "暂无数据" }];
          }
        } else {
          oBranch.idElementClass = v.idElementClass; //表名英文
          if (v.type == "view" || v.type == "dashboard") {
            oBranch.Mode = "r";
          } else {
            oBranch.Mode = this.WorR(this.Authority, v.idElementClass); //权限
          }
        }
        oTree.push(oBranch); //对象追加到数组末尾
      });
      return oTree; //返回新生成的数组对象
    },
    //打开侧栏第一个选项
    newTreeFunc(obj) {
      if (obj.length > 0) {
        if (obj[0].children) {
          obj[0].expand = true;
          this.newTreeFunc(obj[0].children);
        } else {
          obj[0].selected = true;
          let eName = obj[0].idElementClass.split('"').join("");
          this.tableName = eName; //获取表英文名
          this.tableCname = obj[0].title; //获取表中文名
          this.Mode = obj[0].Mode;
          this.$router.push({ path: "/config/tableList" }); //刚进入config页面, 处理完侧边栏数据, 展开第一个选项后, 在这里跳到tableList页面
        }
      }
      return obj;
    },
    // 点击侧边栏的时候表格变化
    getTreeNodes(select) {
      // console.log(select);
      // console.log(this.ConfigTreeData);
      if (select.length != 0) {
        //不是空数组
        if (!select[0].children) {
          //最终表
          this.pageNums = 1;
          if (select[0].type == "class") {
            let eName = select[0].idElementClass.split('"').join(""); //获取英文名
            this.tableName = eName; //获取表英文名
            this.$router.push({path: '/config/tableList'});
          }

          this.tableType = select[0].type; //获取表类别
          if (select[0].type == "view" || select[0].type == "dashboard") {
            this.funcionName = select[0].funcionName; //viewfuncionName
            this.$router.push({path: '/config/tableList'});
          }
          this.tableCname = select[0].title; //获取表的中文名
          this.Mode = select[0].Mode;
        } else {
          //不是最终表
          select[0].selected = false;
          select[0].expand = !select[0].expand;
          this.keepSelected(select[0].children);
        }
      } else {
        //空数组
        //暂时还不知道怎么处理
      }
    },
    // 侧边栏合起来的时候, 保持之前的选中状态
    keepSelected(arr) {
      arr.forEach((v, i) => {
        if (v.children && v.children.length != 0) {
          this.keepSelected(v.children);
        } else {
          if (v.title == this.tableCname) {
            v.selected = true;
          }
        }
      });
    },
    getRecordId(msg) {
      this.recordId = msg;
    },
    // 获取与处理权限
    getAuthority() {
      if (this.$store.state.Mode) {
        this.Authority = this.$store.state.Mode;
      } else {
        this.Authority = JSON.parse(sessionStorage.getItem("Mode"));
      }
    },
    WorR(authority, eName) {
      let Mode;
      // console.log(authority);
      // console.log(eName);
      authority.forEach(function(v, i) {
        if (v.table_name == eName.replace(/\"/g, "")) {
          Mode = v.Mode;
        }
      });
      return Mode;
    },
    // 侧边栏表格搜索
    asideSearch() {
      // 每次触发这个函数, 就先将原来搜索的内容清空
      this.targetTable = [];
      this.getSearchtable(this.ConfigTreeData, this.searchMsg);
      // 搜索内容为空时, 能够搜索到所有的内容, 我们不需要, 所以置空数组
      if (this.searchMsg == "") {
        this.targetTable = [];
      }
    },
    // 找出选中的表名
    getSearchtable(tableMenu, searchMsg) {
      if (tableMenu.length > 0) {
        tableMenu.forEach((v, i) => {
          if (v.children && v.children.length != 0) {
            this.getSearchtable(v.children, searchMsg);
          } else {
            // 此时已经遍历到数组最底层, 如果表的 title 中包含搜索的信息, 则给该表添加某类, 并且展开父元素
            if (v.title.indexOf(searchMsg) != -1) {
              // 找到符合的表
              this.targetTable.push(v.title);
            }
          }
        })
      }
    },
    //选中搜索出来的表名
    selected(value){
      this.flag = true;
      this.searchedMsg = value;
      // this.gettableEname(this.ConfigTreeData, value);
    },
    // 获取对应表的英文名
    gettableEname(tableMenu, tableCname){
      let len = tableMenu.length;//万一是最后一个表, 那么用来回调
      let thisone;
      let flag3 = true;
      tableMenu.forEach((v, i) => {
        if (v.type == "folder") {
          v.expand = false;
        } else if (v.type == "class" || v.type == "view" || v.type == "dashboard") {
          v.selected = false;
        }
        
        if (!flag3) {
          return false;
        }
        if (!this.flag) {
          this.tableOpen(thisone);
          // 最后一张表, 才有权限属性
          if (thisone.Mode) {
            this.Mode = thisone.Mode;
          }
          flag3 = false;
          return false;//从内层开始往数组里面 push
        }
        thisone = v;
        if (v.children && v.children.length > 0) {
          // 如果有子元素, 那么就一直往下遍历
          this.gettableEname(v.children, tableCname);
          // 此文件夹内有需要的表格, 且是最后一个文件夹
          if (i == len - 1 && !this.flag) {
            this.tableOpen(v);
          }
        } else {
          // 直到找到最内层
          if (v.title == tableCname) {
            // 找到了
            if (v.type == "view" || v.type == "dashboard") {
              this.funcionName = v.funcionName;
            } else {
              this.tableName = v.idElementClass.split('"').join(""); //获取英文名
            }
            // 找到最内层的最后一个表且是需要找的表
            if (i == len - 1) {
              this.tableOpen(v);
            }
            this.flag = false;
            return false;//结束当前循环
          }
        }
      })
    },
    // 设置为打开 / 选中状态
    tableOpen(v){
      if (v.type == "folder") {
        v.expand = true;
      } else if (v.type == "class" || v.type == "view" || v.type == "dashboard") {
        v.selected = true;
        this.tableCname = v.title;
      }
    },
    // 找最内层
    getEnter(obj){
      obj.forEach((v, i) => {
        if (v.children && v.children.length > 0) {
          v.expand = false;
          this.getEnter(v.children);
        } else {
          v.selected = false;
        }
      })
      return obj;
    },
    // 从relation获取传来的跳转信息
    getMfs(data){
      // console.log(data);
      this.relationMsg = data;
      this.pageNums = data.pageNum;
      this.Id = data.jiluId;
      this.searchedMsg = data.relationCtable;
    },
  }
};
</script>

<style lang="scss">
#configContainer {
  height: 100%;
}
</style>

<template>
  <div id="configContainer">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed">
        <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" :class="menuitemClasses" accordion>
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-analytics"></Icon>
              配置信息列表
            </template>
            <div class="treeContent">
              <!--树状菜单-->
              <Tree :data="ConfigTreeData" @on-select-change="getTreeNodes"></Tree>
            </div>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="ios-keypad"></Icon>
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
        ></router-view>
      </transition>

    </Layout>

  </div>

</template>
<script>
  export default {
    data () {
      return {
        isCollapsed: false,
        ConfigTreeData: '', //树状目录
        //页面配置：
        groupName: JSON.parse(sessionStorage.getItem('groupInfo')).Code,  //组名
        tableName: '',  //表名
        recordId: ''
      }
    },
    created: function(){
      this.getTreeData();  //侧栏树形菜单
    },
    computed:{
      menuitemClasses(){
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },
      rotateIcon(){
        return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
      }
    },
    methods: {
      collapsedSider() {
        this.$refs.side1.toggleCollapse();
      },
      getTreeData(){
        let _this = this;
        //侧栏树形菜单数据获取
        _this.$http.post('/authorityController/getMenu?groupName='+_this.groupName)
                .then(function(info){
                  let oData = info.data.children;
                  let treeMenu = sessionStorage.getItem(_this.groupName+"_menu");
                  if(treeMenu){

                  }else {
                    sessionStorage.setItem(_this.groupName+"_menu",JSON.stringify(oData));
                  }
                  let objTree = objFunc(oData);
                  _this.ConfigTreeData = newTreeFunc(objTree);  //打开侧栏第一个选项

                  function newTreeFunc(obj){
                    if(obj.length > 0){
                      obj[0].expand = true;
                      if(obj[0].children){
                        newTreeFunc(obj[0].children);
                      }else {
                        let eName = obj[0].idElementClass.split("\"").join("");
                        _this.tableName = eName; //获取表名
                        _this.$router.push({path: '/config/tableList'});
                      }
                    }
                    return obj;
                  }
                  function objFunc(d){
                    //此方法是将拿到的接口数据转换成新的格式，便于渲染树形菜单
                    let oTree = [];
                    d.forEach(function(v,i){
                      let oBranch = {};
                      oBranch.title = v.description;
                      oBranch.expand = false;         //菜单是否展开 true展开
                      if (v.children.length != 0){
                        oBranch.children = objFunc(v.children);
                      }else {
                        oBranch.idElementClass = v.idElementClass;  //表名英文
                      }
                      oTree.push(oBranch);    //对象追加到数组末尾
                    });
                    return oTree;       //返回新生成的数组对象
                  }

                });
      },
      getTreeNodes(select){
        let _this = this;
        if(!select.children){
          let eName = select[0].idElementClass.split("\"").join("");
          _this.tableName = eName; //获取表名
          _this.$router.push({path: '/config/tableList'});
          console.log(eName);//点击的表
        }
      },
      getRecordId(msg){
        this.recordId = msg;
      }
    },
  }
</script>

<style lang="scss">
  .btnItem{
    width: 25%;
    float: left;
    padding-top: 17px;
    button{
      float: left;
      .ivu-icon{
        margin-top: 2px;
        margin-right: -2px;
        font-size: 14px;
      }
    }
  }

  .btnItemLeft{
    button{
      margin-left: 15px;
      float: left;
    }
  }

  .btnItemRight{
    button{
      margin-right: 15px;
      float: right;
    }
  }
  .searchBar{
    width: 50%;
    float: left;
    padding-top: 15px;
    .ivu-input-wrapper{
      width: 80%;
      float: left;
    }
    button{
      float: right;
      width: 18%;
      .ivu-icon{
        margin-top: 3px;
      }
    }
  }

  .ivu-row{
    .ivu-col{
      .ivu-date-picker{
        width: 100%;
      }
    }
  }

  .ivu-tree-title{
    color: #c7c7c7;
  }

  .ivu-tree-title:hover{
    color: #373f50;
  }


html, body {
  width: 100%;
  height: 100%;
}
ul,li{
  list-style: none;
}

#configContainer {
  height: 100%;
}

.floatRight{
  float: right;
  margin-right: 15px;
}

.floatLeft{
  float: left;
  margin-left: 15px;
}

.clearfix:after {
  content: ".";
  display: block;
  clear: both;
  visibility: hidden;
line-height: 0;
  height: 0;
  font-size:0;
}

.treeContent{
  overflow-y: scroll;
  height: 400px;
  text-align: left
}

.pageContainer{
  padding: 10px 0;
}

</style>

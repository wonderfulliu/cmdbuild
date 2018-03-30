<template>
  <div id="configContainer">
    <Layout>
      <Sider ref="side1" collapsible :collapsed-width="0" v-model="isCollapsed">
        <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses" accordion>
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-analytics"></Icon>
              Navigation One
            </template>
            <div class="treeContent">
              <!--树状菜单-->
              <Tree :data="ConfigTreeData"></Tree>
            </div>
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

          <div class="contentBody">
            <Table :border="showBorder" :data="ConfigTableData" :columns="ConfigTableColumns"></Table>
          </div>

        </Content>
      </Layout>
    </Layout>


  </div>
</template>
<script>
  export default {
    props: ['isCollapsed','menuitemClasses'],
    data () {
      return {
        ConfigTreeData: '',
        tableName:'',
        ConfigTableData: '',
        ConfigTableColumns: '',
        showBorder: false,
        tableSize: 'default'
      }
    },
    created: function(){
      let _this = this;
      _this.$http.post('/authorityController/getMenu?groupName=NET')
              .then(function(info){
                let oData = info.data.children;
                _this.ConfigTreeData = objFunc(oData);  //将转换好的对象传给ConfigTreeData
                function objFunc(d){
                  //此方法是将拿到的接口数据转换成新的格式，便于渲染树形菜单
                  let oTree = [];
                  d.forEach(function(v,i){
                    let oBranch = {};
                    oBranch.title = v.description;
                    oBranch.expand = false;         //菜单是否展开 true展开
                    if (v.children.length != 0){
                      oBranch.children = objFunc(v.children);
                    }
                    oTree.push(oBranch);    //对象追加到数组末尾
                  });
                  return oTree;       //返回新生成的数组对象
                }
              });
      _this.$http.get('/cardController/getCardList?table=Server&pageNum=1&pageSize=20')
              .then(function(info){
                console.log(info.data.list);
                let a = Object.keys(info.data.list[0]);
                let b = [];
                a.forEach(function(v,i){
                  let o = {};
                  o.title = v;
                  b.push(o);
                });
                console.log(b);
                _this.ConfigTableData = info.data.list;
                _this.ConfigTableColumns = b;
              })
    },
    computed:{

    },
    methods: {

    },
    mounted () {
    }
  }
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
}
#configContainer {
  height: 100%;
}
  .treeContent{
    overflow-y: scroll;
    height: 500px;
    text-align: left
  }
</style>

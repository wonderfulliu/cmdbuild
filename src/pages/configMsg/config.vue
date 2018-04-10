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
            <MenuItem name="2-1">导入XLS文件</MenuItem>
            <MenuItem name="2-2">导出XLS文件</MenuItem>
            <MenuItem name="2-3">导入关系文件</MenuItem>
            <MenuItem name="2-4">导出关系文件</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <div class="btnItem btnItemLeft">
            <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '4px 20px'}" type="navicon-round" size="24"></Icon>
            <Button type="ghost">searchFilter</Button>
          </div>
          <div class="searchBar">
            <Input v-model="configCondition"></Input>
            <!--<Input v-model="configCondition" clearable="true"></Input>-->
            <Button type="primary" icon="ios-search" @click="fuzzy">搜索</Button>
          </div>
          <div class="btnItem btnItemRight">
            <Button type="ghost" icon="plus-round" @click="configAdd"></Button>
            <Button type="ghost" icon="arrow-down-a"></Button>
          </div>

        </Header>
        <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
          <div class="contentBody">
            <Table border size="small" :loading="loading" height="440" :columns="ConfigThead" :data="ConfigTdata"></Table>
            <div class="pageContainer clearfix">
              <Page :total="totalBar" @on-change="pageChange" show-elevator show-total class="floatRight"></Page>
            </div>
          </div>

        </Content>
      </Layout>
    </Layout>

    <!--模态框-->
    <Modal v-model="configDeleModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>您即将删除此条记录。</p>
        <p>是否确认删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="deleLoading" @click="configDele">删除</Button>
      </div>
    </Modal>
    <Modal v-model="configViewModal">
      <p slot="header">
        <span>查看记录</span>
      </p>
      <div>
        <ul class="modalListUl">
          <li v-for="(val, key ,index) in configViewData">{{ key }} : {{ val }}</li>
        </ul>
      </div>
      <div slot="footer">
      </div>
    </Modal>
    <Modal v-model="configAddModal" title="新增信息" @on-ok="configAddOk">
      <Form :label-width="100">
        <FormItem :label="attr.cname" v-for="attr in attributes" :key="attr.attribute">
          <Input placeholder="Enter something..." v-if="attr.type=='varchar'" :name="attr.attribute"></Input>
          <Input placeholder="Enter something..." v-if="attr.type=='int4'" :name="attr.attribute"></Input>
          <Select v-if="attr.type=='lookup'" :name="attr.attribute" @click.native="getLookUp(attr.lr)">
            <Option v-for="a in lookupInfo[attr.attribute]" :value="a.Id" :key="a.Id">{{ a.Description }}</Option>
          </Select>
          <Row v-if="attr.type=='date'">
            <Col span="24">
              <DatePicker type="date" placeholder="Select date" :name="attr.attribute"></DatePicker>
            </Col>
          </Row>
          <Input v-if="attr.type=='reference'" :name="attr.attribute">
            <Button slot="append" icon="ios-search"></Button>
          </Input>
        </FormItem>
      </Form>
    </Modal>
  </div>

</template>
<script>
  export default {
    data () {
      return {
        isCollapsed: false,
        ConfigTreeData: '', //树状目录
        ConfigThead: [],  //表头
        ConfigTdata: [],  //表格数据
        //页面配置：
        loading: true,
        groupName: JSON.parse(sessionStorage.getItem('groupInfo')).Code,  //组名
        tableName: '',  //表名
        recordId: '',     //记录id
        pageNum: 1,       //当前页
        pageSize: 20,     //每页条数
        totalBar: '',     //总条数
        configCondition: '',  //查询条件
        //模态框
        configDeleModal: false, //删除modal
        configViewModal: false, //查看modal
        configAddModal: false,
        deleLoading: false,
        configViewData: '',     //查看数据
        attributes: '',  //记录的字段 中英文
        lookupInfo: ''
      }
    },
    created: function(){
      let _this = this;
      _this.getTreeData();  //侧栏树形菜单
    },
    computed:{
      rotateIcon(){
        return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
      },
      menuitemClasses(){
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
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
                  sessionStorage.setItem(_this.groupName+"_menu",JSON.stringify(oData));
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
                        _this.getTableAttribute();
                        _this.getTableHead();
                        _this.getTableData();  //渲染表格表格
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
          console.log(eName);//点击的表
          _this.getTableAttribute();
          _this.getTableHead();
          _this.getTableData();  //重新加载表格
        }
      },
      getTableAttribute(){
        let _this = this;
        let thead = sessionStorage.getItem('config_' + _this.tableName + '_attribute');
        if(!thead){
          _this.$http.post('/cardController/getAttributeList',{"table": _this.tableName})
            .then(function(info){
              sessionStorage.setItem('config_' + _this.tableName + '_attribute',JSON.stringify(info.data));
            });
        }
      },
      getTableHead(){
        let thead = sessionStorage.getItem('config_' + this.tableName + '_head');
        if(!thead){
          let _this = this;
          _this.$http.get('/cardController/getCardList?table=' +
                          _this.tableName + '&pageNum=' +
                          _this.pageNum +'&pageSize=' +
                          _this.pageSize)
                  .then(function(info2){
                    //获取表头数据：
                    let arrA = Object.keys(info2.data.list[0]);//获取对象内所有属性
                    let arrObj = [];
                    arrA.forEach(function(v, i){
                      let oTemp = {};
                      let markName = _this.attributeCName(v);
                      let cname;
                      if(markName != null){
                        cname = markName;
                        oTemp.title = cname;
                        oTemp.key = v;
                        oTemp.width = 170;
                        arrObj.push(oTemp);
                      }
                    });
                    sessionStorage.setItem('config_' + _this.tableName + '_head',JSON.stringify(arrObj));
                    let newArr = arrObj;
                    _this.ConfigThead = _this.pushBtn(newArr);
                  });

        }else {
          this.ConfigThead = this.pushBtn(JSON.parse(thead));
        }
      },
      getTableData(){
        //表格数据获取
        let _this = this;
        _this.loading = true;//加载中
        let result = _this.$http.get('/cardController/getCardList?table=' +
                                      _this.tableName + '&pageNum=' +
                                      _this.pageNum +'&pageSize=' +
                                      _this.pageSize)
                        .then(function(info){
                          _this.totalBar = info.data.totalRecord;
                          let ConfigTdata = info.data.list;
                          ConfigTdata.forEach(function (v, i) {
                            for(let a in v){
                              if(v[a] != null && (typeof v[a]) == 'object'){
                                v[a] = v[a].Description;
                              }
                            }
                          });
                          _this.ConfigTdata = ConfigTdata;
                          _this.loading = false;//加载完成时
                        });
      },
      attributeCName(eName){
        let _this = this;
        let cNameObj = JSON.parse(sessionStorage.getItem('config_' + _this.tableName + '_attribute'));
        let c = cNameObj.filter(function (v, i) {
          return eName == v.attribute;
        });
        if(c.length != 0){
          return c[0].cname;
        }
      },
      pageChange(page){
        this.pageNum = page;
        this.getTableData(this.tableName);
      },
      fuzzy(){
        //模糊查询
        let _this = this;
        _this.loading = true;//加载中
        let result = _this.$http.post('cardController/fuzzyQuery?tableName=' +
            _this.tableName + '&condition=' +
            _this.configCondition + '&pageNum=' +
            _this.pageNum + '&pageSize=' +
            _this.pageSize)
          .then(function(info){
            _this.totalBar = info.data.totalRecord;
            let ConfigTdata = info.data.list;
            ConfigTdata.forEach(function (v, i) {
              for(let i in v){
                if(v[i] != null && (typeof v[i]) == 'object'){
                  v[i] = v[i].value;
                }
              }
            });
            _this.ConfigTdata = ConfigTdata;
            _this.loading = false;//加载完成时
          });
      },
      pushBtn(arr){
        let _this = this;
        arr.push({
          title: '操作',
          key: 'action',
          width: 230,
          fixed: 'right',
          render: function(h, params){
            return h('div', [
              //编辑
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'compose'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: function() {
                    _this.recordId = params.row.Id;// 获取当前行所有信息
                    //点击事件
                  }
                }
              }),
              //查看
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'eye'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: function() {
                  //查看  点击事件
                    _this.recordId = params.row.Id;// 获取当前行所有信息

                    _this.$http.get('/cardController/card?table='+_this.tableName+'&Id='+_this.recordId)
                    .then(function(info){
                      let newObj = {};
                      Object.keys(info.data).forEach(function(v, i){
                        if(_this.attributeCName(v)){
                          let attr = _this.attributeCName(v);
                          if(typeof info.data[v] == 'object' && info.data[v] != null){
                            newObj[attr] = info.data[v].Description;
                          }else {
                            newObj[attr] = info.data[v];
                          }

                        }
                      });
                      _this.configViewData = newObj;
                    }).catch(function(error){
//                      console.log(error);
                    });
                    _this.configViewModal = true;
                  }
                }
              }),
              //历史
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'clipboard'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: function() {
                    //点击事件
                    _this.recordId = params.row.Id;// 获取当前行所有信息

                  }
                }
              }),
              //关系
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'link'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: function() {
                    //点击事件
                    _this.recordId = params.row.Id;// 获取当前行所有信息
                  }
                }
              }),
              //删除
              h('Button', {
                props: {

                  type: 'text',
                  size: 'small',
                  icon: 'trash-a'
                },
                on: {
                  click: function() {
                    //点击事件
                    _this.recordId = params.row.Id;// 获取当前行所有信息
                    _this.configDeleModal = true;
                  }
                }
              })
            ]);
          }
        });
        return arr;
      },
      configDele(){
        let _this = this;
        _this.deleLoading = true;
        _this.$http.delete('/cardController/card?table=' + _this.tableName + '&&Id=' + _this.recordId)
                .then(function(){
                  _this.deleLoading = false;
                  _this.configDeleModal = false;
                  _this.getTableData();
                  _this.$Message.success('删除成功');
                })
                .catch(function(error){
                  _this.deleLoading = false;
                  _this.configDeleModal = false;
                  _this.getTableData();
                  _this.$Message.error('删除失败');
                });

      },
      configAdd() {
        let _this = this;
        let lookup = sessionStorage.getItem('config_' + _this.tableName + '_lookup');
        if(!lookup){
          _this.$http.post('/relationController/getLookuplistByTable?table='+ _this.tableName)
            .then(function(info){
              sessionStorage.setItem('config_' + _this.tableName + '_lookup',JSON.stringify(info.data));
            });
        }
        _this.lookupInfo = JSON.parse(sessionStorage.getItem('config_' + _this.tableName + '_lookup'));
        console.log(_this.lookupInfo);
        _this.configAddModal = true;
        _this.attributes = JSON.parse(sessionStorage.getItem('config_' + _this.tableName + '_attribute'));
      },

      configAddOk(){

      },

    },
    mounted () {
    }
  }
</script>

<style lang="scss">
  .btnItem{
    width: 25%;
    float: left;
    padding-top: 15px;
    button{
      float: left;
      .ivu-icon{
        margin-top: 2px;
        margin-right: -6px;
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

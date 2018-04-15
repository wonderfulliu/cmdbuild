<template>
  <Layout>
    <Header :style="{padding: 0}" class="layout-header-bar">
      <div class="btnItem btnItemLeft">
        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '4px 20px'}" type="navicon-round" size="24"></Icon>
        <Button type="ghost">searchFilter</Button>
      </div>
      <div class="searchBar">
        <Input v-model="configCondition"></Input>
        <Button type="primary" icon="ios-search" @click="fuzzy">搜索</Button>
      </div>
      <div class="btnItem btnItemRight">
        <Button type="ghost" icon="plus-round" @click="configAdd">
        </Button>
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
          <li v-for="(val, key ,index) in configViewData" :key="index">{{ key }} : {{ val }}</li>
        </ul>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </Layout>


</template>

<script>
  export default {
    props: {
      'tableName': {
        type: String,
        required: true
      },
      'collapsedSider': {
        type: Function,
        default: null
      },
      'rotateIcon': {
        type: Function,
        default: null
      }
    },
    data () {
        return {
          //参数
          isCollapsed: false,
          recordId: '',     //记录id
          pageNum: 1,       //当前页
          pageSize: 20,     //每页条数
          totalBar: '',     //总条数
          configCondition: '',  //查询条件
          //数据
          ConfigThead: [],  //表头
          ConfigTdata: [],  //表格数据
//          attributes: '',   //记录的字段 中英文
//          lookupInfo: '',   //当前表中lookup信息
          //页面配置：
          loading: true,
          //模态框
          configDeleModal: false, //删除modal
          configViewModal: false, //查看modal
          configAddModal: false,
          deleLoading: false,
          configViewData: ''     //查看数据
        }
    },
    created: function(){
      this.getTableAttribute();
      this.getTableHead();
      this.getTableData();
      this.$watch('tableName', function (newValue, oldValue) {
        this.getTableAttribute();
        this.getTableHead();
        this.getTableData();
      })
      },
    methods:{
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
                    _this.$emit('transferRecord', params.row.Id);
                    //跳转到添加页
                    _this.$router.push({path: '/config/historyRecord'});
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
        //跳转到添加页
        this.$router.push({path: '/config/addRecord'});
      }
    },
    computed:{

    }
  }
</script>

<style>

</style>

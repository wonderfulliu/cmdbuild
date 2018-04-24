<template>
  <Layout>
    <Header :offset-top="64" :style="{padding: 0}" class="layout-header-bar">
      <Row>
        <Col span="4">
          <Icon @click.native="collapsedSider" :class="rotateIcon" class="menuCtrl" :style="{margin: '4px 20px'}" type="navicon-round" size="24"></Icon>
          <Button type="ghost" @click="backBtn">返回</Button>
        </Col>
        <Col span="5" offset="15">
        <ButtonGroup>
          <Button type="info" @click="gethistoryInfo" :class="{'active': ctrlBtnA}">信息</Button>
          <Button type="info" @click="gethistoryRelate" :class="{'active': ctrlBtnB}">关系</Button>
        </ButtonGroup>
        </Col>
      </Row>
    </Header>

    <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
      <div class="contentBody">
        <Table border size="small" :loading="loading" height="440" :columns="columnData" :data="tableData"></Table>
      </div>
    </Content>

    <Modal v-model="HistoryViewModal">
      <p slot="header">
        <span>查看历史记录</span>
      </p>
      <div class="modalListUl">
        <ul>
          <li v-for="(val, key ,index) in HistoryViewData" :key="index">{{ key }} : {{ val }}</li>
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
      //表名
      'tableName':{
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
      },
      //记录id
      'recordId': {
        type: Number,
        required: true
      }

    },
    data () {
      return {
        columnData: [], //表头
        tableData: [],  //表数据
        HistoryViewData: {},
        historyId: '',
        //设置
        ctrlBtnA: true,
        ctrlBtnB: false,
        isCollapsed: false,
        loading: true,
        //modal
        HistoryViewModal: false,
        hisLoading: true
      }
    },
    created: function(){
      this.gethistoryInfo();
    },
    methods:{
      //历史信息记录
      gethistoryInfo(){
        let _this = this;
        _this.loading = true;
        _this.ctrlBtnA = true;
        _this.ctrlBtnB = false;
        let data = {
          table: _this.tableName,
          Id: _this.recordId
        };
        let odata = [];
        _this.$http.post('/cardController/cardHistory',data)
          .then(function(info){
            let opt = info.data[0];
            odata = info.data;
            odata.forEach(function(v ,i){
              v.BeginDate = _this.formatDateTime(v.BeginDate);
              v.EndDate = _this.formatDateTime(v.EndDate);
            });
            let arra = [];
            for(let k in opt){
              arra.push({
                title: k,
                key: k
              });
            }
            _this.columnData = _this.operationBtn(arra);    //表头
            _this.tableData = info.data;  //数据
            _this.loading = false;
          });
      },
      //历史关系记录
      gethistoryRelate(){
        let _this = this;
        _this.loading = true;
        _this.ctrlBtnA = false;
        _this.ctrlBtnB = true;
        let data = {
          table: _this.tableName,
          Id: _this.recordId
        };
        _this.$http.post('/relationController/relationHistory',data)
          .then(function(info){
            let odata = info.data;
            let opt = info.data[0];
            let arra = [];
            for(let k in opt){
              arra.push({
                title: k,
                key: k
              });
            }
            console.log(odata);
            odata.forEach(function(v , i){
              if(typeof v.IdDomain == 'object'){
                v.IdDomain = v.IdDomain.value;
              }
            });
            _this.columnData = arra;    //表头
            _this.tableData = info.data;  //数据
            _this.loading = false;
          });
      },
      formatDateTime(inputTime) {
        //时间戳工具
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
      },
      attributeCName(eName) {
        let _this = this;
        let cNameObj = JSON.parse(
          sessionStorage.getItem("config_" + _this.tableName + "_attribute")
        );
        let c = cNameObj.filter(function(v, i) {
          return eName == v.attribute;
        });
        if (c.length != 0) {
          return c[0].cname;
        }
      },
      operationBtn(arr){
        let _this = this;
        arr.push({
          title: '操作',
          key: 'action',
          width: 60,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: function(){
                    _this.historyId = params.row.Id;
                    _this.historyView();
                    _this.HistoryViewModal = true;
                  }
                }
              }, '查看')
            ])
          }
        })
        return arr;
      },
      historyView(){
        let _this = this;
        _this.hisLoading = true;
        _this.$http.get('/cardController/historyCard?table=' +
                        _this.tableName + '&Sid=' +
                        _this.recordId + '&Id=' +
                        _this.historyId)
          .then(function(info){
            let arrb = info.data;
            for(let k in arrb){
              if(typeof arrb[k] == 'object' && arrb[k] != null){
                arrb[k] = _this.objectDataChange(arrb[k]);
              }
            }
            _this.HistoryViewData = arrb;
          });
      },
      objectDataChange(obj){
          if('Description' in obj){
            obj = obj.Description;
          }else if('value' in obj){
            if(typeof obj.value == 'object' && obj.value != null){
              obj = this.objectDataChange(obj.value);
            }else {
              obj = obj.value;
            }
          }
          return obj;
      },
      backBtn(){
        this.$router.go(-1);
      }
    }
    }
</script>

<style lang="scss">
  .menuCtrl{
    margin: 4px 20px;
    line-height: 2;
  }
</style>

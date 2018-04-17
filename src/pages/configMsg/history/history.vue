<template>
  <Layout>
    <Header :offset-top="64" :style="{padding: 0}" class="layout-header-bar">
      <div class="btnItem btnItemLeft">
        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '4px 20px'}" type="navicon-round" size="24"></Icon>
        <Button type="ghost" @click="backBtn">返回</Button>
      </div>
      <div class="btnItemRight floatRight">

        <ButtonGroup>
          <Button type="info" @click="gethistoryInfo">信息</Button>
          <Button type="info" @click="gethistoryRelate">关系</Button>
        </ButtonGroup>
      </div>
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
      <div>
        <ul class="modalListUl">
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
        isCollapsed: false,
        columnData: [], //表头
        tableData: [],  //表数据
        loading: true,
        //modal
        HistoryViewModal: false,
        HistoryViewData: {},
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
        let data = {
          table: _this.tableName,
          Id: _this.recordId
        };
        _this.$http.post('/relationController/getRelationList',data)
          .then(function(info){
            if(JSON.stringify(info.data) == '{}'){
              console.log(null)
            }else {
              let arrb = info.data.Map_Vender_Cotains_Contact[0];
              for(let k in arrb){
                if(typeof arrb[k] == 'object' && arrb[k] != ''){
                  for(let kr in arrb[k]){
                    if(kr == 'value'){
                      arrb[k] = arrb[k].value;
                    }else if(kr == 'Description'){
                      arrb[k] = arrb[k].Description;
                    }
                  }
                }
              }
              _this.HistoryViewData = arrb;
            }

          });
      },
      backBtn(){
        this.$router.go(-1);
      }
    }
    }
</script>

<style lang="scss">
  .btnItemRight{
    .ivu-btn-group{
      button{
        margin-right: 0;
      }
    }
  }
</style>

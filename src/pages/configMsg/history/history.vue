<template>
  <Layout :style="{height:contH}">
    <Header :offset-top="64" style="padding: 0" class="layout-header-bar">
      <Row>
        <Col span="9" offset="1" style="text-align: left">
        <Breadcrumb>
          <BreadcrumbItem to="/config/tableList">配置信息</BreadcrumbItem>
          <BreadcrumbItem to="/config/tableList">{{tableCname}}</BreadcrumbItem>
          <BreadcrumbItem>历史{{ titleName }}</BreadcrumbItem>
        </Breadcrumb>
        </Col>
        <!--<Col span="1">
          <Icon @click.native="collapsedSider" :class="rotateIcon" class="menuCtrl" :style="{margin: '4px 20px'}" type="navicon-round" size="24"></Icon>
        </Col>-->
        <Col span="14" style="text-align: right">
        <ButtonGroup>
          <Button type="info" @click="gethistoryInfo" :class="{'active': ctrlBtnA}">信息</Button>
          <Button type="info" @click="gethistoryRelate" :class="{'active': ctrlBtnB}">关系</Button>
        </ButtonGroup>
        <Button type="ghost" @click="backBtn" style="margin-right: 20px;margin-left: 10px">返回</Button>
        </Col>
      </Row>
    </Header>
    <Content>
      <div class="contentBody" :style="{height:contContentH}">
        <Table border
               size="small"
               :height="tableH"
               :loading="loading"
               :columns="columnData"
               :data="tableData"></Table>
        <div style="line-height: 64px;height:auto;" v-show="ctrlBtnA">
          <Row>
            <Col :xs="{span:24}" :sm="{span:24}" :md="{span:9,offset:15}" :lg="{span:8,offset:15}" style="text-align: right">
            <Row>
              <Col span="6">
              共 {{ totalBar }} 条
              </Col>
              <Col span="2">
              <Button type="text" icon="chevron-left" @click="pageFirst" :disabled="firstCl" title="首页"></Button>
              </Col>
              <Col span="14" style="width: 190px;text-align: center">
              <Page simple
                    show-total
                    :page-size=20
                    :total="totalBar"
                    :current="pageNum"
                    @on-change="pageChange"></Page>
              </Col>
              <Col span="2">
              <Button type="text" icon="chevron-right" @click="pageLast" :disabled="lastCl" title="尾页"></Button>
              </Col>
            </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Content>

    <Modal v-model="HistoryViewModal">
      <p slot="header">
        <span>查看历史记录</span>
      </p>
      <div class="modalListUl">
        <ul>
          <li v-for="(val, key ,index) in HistoryViewData" :class="{'active': val.flag}" :key="index">
            {{ key }} : {{ val.value }}
          </li>
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
      tableCname: {
        type: String,
        required: true
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
        tableCname: '',//表中文名
        HistoryViewData: {},
        historyId: '',
        //配置
        totalBar: 0,
        pageNum: 1,
        totalPage: 1,

        //设置
        ctrlBtnA: true,
        ctrlBtnB: false,
        titleName: '信息',
        isCollapsed: false,
        loading: true,
        //modal
        HistoryViewModal: false,
        hisLoading: true,
        firstCl: true,//首页是否禁用
        lastCl: true,//尾页是否禁用
        contH: '',//内容区高
        contContentH: '',//内容区内容高
        tableH: '',//表格高度
      }
    },
    created: function(){
      this.gethistoryInfo();
      this.getHeight();
    },
    mounted () {
      let _this = this;
      window.onresize = () => {
        _this.getHeight();
      }
    },
    computed: {
      menuitemClasses() {
        return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
      },
      rotateIcon() {
        return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
      }
    },
    methods:{
      //历史信息记录
      gethistoryInfo(){
        let _this = this;
        _this.loading = true;
        _this.ctrlBtnA = true;
        _this.ctrlBtnB = false;
        _this.titleName = '信息';
        let odata = [];
        _this.$http
          .post('/cardController/cardHistory?table=' +
            _this.tableName +
            '&id=' +
            _this.recordId +
            '&pageNum=' +
            _this.pageNum +
            '&pageSize=20')
          .then(function(info){
            _this.totalBar = info.data.totalRecord;
            _this.totalPage = info.data.totalPage;
            let opt = info.data.list[0];
            odata = info.data.list;
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
            _this.tableData = info.data.list;  //数据
            _this.loading = false;
          });
      },
      //历史关系记录
      gethistoryRelate(){
        let _this = this;
        _this.loading = true;
        _this.ctrlBtnA = false;
        _this.ctrlBtnB = true;
        _this.titleName = '关系';
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
//            console.log(odata);
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
      //将英文字段转换中文并排序(过滤没有中文名的字段)PS:传入对象
      attributeCName(obj) {
        let _this = this;
        let cNameObj = JSON.parse(
          sessionStorage.getItem("config_" + _this.tableName + "_attribute")
        );
        let arra = {};
        for(let i = 0; i<cNameObj.length-1; i++){
          for(let eName in obj){
            if(eName == cNameObj[i].attribute){
              let cName = cNameObj[i].cname;
              arra[cName] = obj[eName];
            }
          }
        }
        return arra;
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
              let val = arrb[k];
              if(typeof val.value == 'object' && val.value != null){
                val.value = _this.objectDataChange(val.value);
              }
            }
            let arra = _this.attributeCName(arrb);
            _this.HistoryViewData = arra;
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
      },
      pageChange(page) {
        this.pageNum = page;
        this.pageDisabled();
        this.gethistoryInfo();
      },
      pageDisabled(){
        if(this.pageNum == 1 && this.pageNum == this.totalPage){
          this.firstCl = true;
          this.lastCl = true;
        }else{
          if(this.pageNum == 1 && this.pageNum != this.totalPage){
            this.firstCl = true;
            this.lastCl = false;
          }else{
            if(this.pageNum != 1 && this.pageNum == this.totalPage){
              this.firstCl = false;
              this.lastCl = true;
            }else {
              this.firstCl = false;
              this.lastCl = false;
            }
          }
        }
      },
      pageFirst() {
        this.pageNum = 1;
        this.pageDisabled();
        this.gethistoryInfo();
      },
      pageLast() {
        this.pageNum = this.totalPage;
        this.pageDisabled();
        this.gethistoryInfo();
      },
      // 获取高度
      getHeight(){
        let clientH = document.documentElement.clientHeight;
        this.contH = (clientH - 64) + 'px';
        this.contContentH = (clientH - 138) + 'px';
        this.tableH = clientH - 222;
      },
    }
    }
</script>

<style lang="scss">
  .menuCtrl{
    margin: 4px 20px;
    line-height: 2;
  }
</style>

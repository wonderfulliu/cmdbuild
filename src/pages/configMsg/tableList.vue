<template>
  <Layout class="miniWindow" :style="{height:contentH}" style="overflow: hidden">
    <Header ref="conBhead" :style="{padding: 0}" class="layout-header-bar">
      <Row>
        <Col span="1">
          <Icon @click.native="collapsedSider" :class="rotateIcon" class="menuCtrl" type="navicon-round" size="24"></Icon>
        </Col>
        <Col span="3">
          <Dropdown class="fieldSearch" trigger="click" placement="bottom-start">
              <Button type="primary">
                字段筛选
                <Icon type="arrow-down-b"></Icon>
              </Button>
              <DropdownMenu slot="list">
                  <div id="field">
                    <Dropdown trigger="click" placement="right" v-for="(item, index) in fieldData" :key="index" >
                        <DropdownItem>
                          <Checkbox v-model="item.flag" @on-change="fieldSearch"></Checkbox>{{item.cName}}
                          <Icon type="ios-arrow-right"></Icon>
                        </DropdownItem>
                        <DropdownMenu slot="list" style="padding-left: 10px;padding-right: 10px;">
                          <Input size="small"
                                 v-model.trim="item.value"
                                 @on-enter="fsInput(item.flag)"></Input>
                        </DropdownMenu>
                    </Dropdown>
                  </div>
              </DropdownMenu>
          </Dropdown>
        </Col>
        <Col span="12" offset="3">
          <Input v-model="configCondition" placeholder="Enter something..." @on-enter="fuzzy">
            <Button slot="append" type="info" icon="ios-search" @click="fuzzy">搜索</Button>
          </Input>
        </Col>
      </Row>
    </Header>
    <Content :style="{height:contentbodyH}">
      <div class="contentBody">
        <Table border
               stripe
               ref="tableCont"
               size="small"
               :height="tableHeight"
               @on-row-click="getRecordInfo"
               @on-sort-change="sorting"
               :highlight-row="highlight"
               :loading="loading"
               :columns="ConfigThead"
               :data="ConfigTdata">
        </Table>
        <div style="line-height: 64px; height: 64px;" id="pagerCont">
          <Row>
            <Col :xs="{span:4,offset:1}" :sm="{span:10,offset:1}" :md="{span:13,offset:1}" :lg="{span:15,offset:1}" style="text-align: left">
              <ButtonGroup v-if="clientW>=1102">
                <!--<Button type="ghost" title="" icon="ios-eye" @click="ctrlView">查看</Button>-->
                <Button type="ghost" title="" icon="ios-compose-outline" @click="ctrlEdit" :disabled='isdisable'>编辑</Button>
                <Button type="ghost" title="" icon="ios-plus-empty" @click="configAdd" :disabled='isdisable'>新增</Button>
                <Button type="ghost" title="" icon="ios-trash-outline" @click="ctrlDele" :disabled='isdisable'>删除</Button>
                <Button type="ghost" title="" icon="ios-paper-outline" @click="ctrlHistory">历史</Button>
                <Button type="ghost" title="" icon="ios-infinite" @click="ctrlRelete">关系</Button>
                <Button type="ghost" title="" icon="ios-download-outline" @click="configDownload">下载</Button>
              </ButtonGroup>
              <Dropdown style="margin-left: 20px" v-if="clientW<1102" placement="top" trigger="click">
                <Button type="ghost">
                  操作
                  <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem :disabled='isdisable'>
                    <div style="text-align: center" @click="ctrlEdit">
                      <icon type="ios-compose-outline"></icon> 编辑
                    </div>
                  </DropdownItem>
                  <DropdownItem :disabled='isdisable'>
                    <div style="text-align: center" @click="configAdd">
                      <icon type="ios-plus-empty"></icon> 新增
                    </div>
                  </DropdownItem>
                  <DropdownItem :disabled='isdisable'>
                    <div style="text-align: center" @click="ctrlDele">
                      <icon type="ios-trash-outline"></icon> 删除
                    </div>
                  </DropdownItem>
                  <DropdownItem>
                    <div style="text-align: center" @click="ctrlHistory">
                      <icon type="ios-paper-outline"></icon> 历史
                    </div>
                  </DropdownItem>
                  <DropdownItem>
                    <div style="text-align: center" @click="ctrlRelete">
                      <icon type="ios-infinite"></icon> 关系
                    </div>
                  </DropdownItem>
                  <DropdownItem>
                    <div style="text-align: center" @click="configDownload">
                      <icon type="ios-download-outline"></icon> 下载
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col :xs="{span:18}" :sm="{span:13}" :md="{span:10}" :lg="{span:8}" style="text-align: right">
              <Row>
                <!--<Col span="6">
                  <i class="zIcon firstPage"></i>
                  <i class="zIcon lastPage"></i>
                </Col>-->
                <Col span="6">
                共 {{ totalBar }} 条
                </Col>
                <Col span="2">
                  <button title="首页"
                          type="button"
                          class="pageBtn"
                          :class="{'disableBtn':firstCl}"
                          :disabled="firstCl"
                          @click="pageFirst">
                    <i class="zIcon firstPage"></i>
                  </button>
                  <!--<Button type="text" icon="chevron-left" @click="pageFirst" :disabled="firstCl" title="首页"></Button>-->
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
                <!--<Button type="text" icon="chevron-right" @click="pageLast" :disabled="lastCl" title="尾页"></Button>-->
                <button title="尾页"
                        type="button"
                        class="pageBtn"
                        :class="{'disableBtn':lastCl}"
                        :disabled="lastCl"
                        @click="pageLast">
                  <i class="zIcon lastPage"></i>
                </button>
                </Col>
              </Row>
            </Col>
          </Row>
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
    <!-- 显示详情, 暂时用不到 -->
    <Modal v-model="configViewModal">
      <p slot="header">
        <span>查看记录</span>
      </p>
      <div class="modalListUl">
        <ul>
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
    tableName: {
      type: String,
      required: true
    },
    tableCname: {
      type: String,
      required: true
    },
    tableType: {
      type: String,
      required: true
    },
    Mode: {
      type: String,
      // required: true
    },
    funcionName: {
      type: String,
      required: true
    },
    collapsedSider: {
      type: Function,
      default: null
    },
    rotateIcon: {
      type: Array,
      default: null
    },
    pageNums: {
      type: Number
    },
    Id: {
      type: Number
    }
  },
  data() {
    return {
      //参数
      isCollapsed: false,
      sort: '', //排序顺序
      sortAttribute: '', //排序字段
      recordId: "", //记录id
      pageNum: 1, //当前页
      pageSize: 20, //每页条数
      totalBar: 0, //总条数
      totalPage: null, //总页数
      configCondition: "", //查询条件
      //数据
      ConfigThead: [], //表头
      ConfigTdata: [], //表格数据
      lookupInfo: "", //当前表中lookup信息
      relationInfo: "", //关系表信息
      //页面配置：
      loading: true,
      highlight: true,
      clickRow: false,
      clientW: "",
      //配置高度
      contentH: "",
      contentbodyH: "", //内容区域高度
      tableHeight: "", //表格高度
      //模态框
      configDeleModal: false, //删除modal
      configViewModal: false, //查看modal, 暂时用不到
      configAddModal: false,
      deleLoading: false,
      configViewData: "", //查看数据
      isdisable: "", //禁用与否, ''就是false
      firstCl: true,//首页是否禁用
      lastCl: false,//尾页是否禁用
      changetableName: false,//判断是否切换表格
      // 字段搜索相关
      fieldData: [],//待渲染字段数据
      fielddataObj: {},//存储字段搜索的条件, 判断是否为空
    };
  },
  created() {
    this.heightAdaptive();
    this.isgetTablename();
  },
  mounted () {
    let _this = this;
    _this.heightAdaptive();
    window.onresize = () => {
      _this.heightAdaptive();
    }
  },
  watch:{
    'tableName': function(newValue, oldValue){
      this.clearSort();
      this.getTableAttribute();
      this.getTableData();
      this.getlookup();
      this.ischangetableName();
    },
    'funcionName': function(newValue, oldValue){
      this.clearSort();
      this.getTableData();
      this.getlookup();
      this.ischangetableName();
    },
    'pageNums': function(newValue, oldValue){
      this.pageNum = this.pageNums;
    }
  },
  methods: {
    // 切换表的时候清空排序的字段名和排序的规则
    clearSort(){
      this.sortAttribute = '';
      this.sort = '';
    },
    // 如果表名已经获取到, 可以调用以下函数
    isgetTablename() {
      if (this.tableName) {
        this.pageNum = this.pageNums;
        this.isDisabled();
        this.getTableAttribute();
        this.getTableData();
        this.getlookup();
      }
    },
    getTableAttribute() {
      let _this = this;
      let thead = sessionStorage.getItem(
        "config_" + _this.tableName + "_attribute"
      );
      if (!thead) {
        _this.$http
          .post("/cardController/getAttributeList", { table: _this.tableName })
          .then(function(info) {
            sessionStorage.setItem(
              "config_" + _this.tableName + "_attribute",
              JSON.stringify(info.data)
            );
          });
      }
      this.isDisabled();
    },
    getTableHead(info) {
      let thead = sessionStorage.getItem("config_" + this.tableName + "_head");
      let fieldArr = sessionStorage.getItem("config_" + this.tableName + "_field");
      let end = {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 80,
        align: 'center',
        render: (h, params) => {
          return h("div", [
              h("Button",{
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {},
                on: {
                  click: () => {
                    this.ctrlView(params.row.Id);
                  }
                }
              },"详情")
            ]);
        }
      };
      if (!thead) {
        let _this = this;
        //获取表头数据：
        let arrA = Object.keys(info.data.list[0]); //获取对象内所有属性
        let arrObj = [];
        let fieldArr = [];//表头字段搜索
        arrA.forEach(function(v, i) {
          let oTemp = {};
          let field = {};
          let markName = _this.attributeCName(v);
          let cname;
          if (markName != null) {
            cname = markName.cname;
            field.eName = v;//字段英文名
            field.cName = cname;//字段中文名
            field.value = '';//双向绑定到搜索框的值
            field.flag = false;//选中状态
            oTemp.title = cname;
            oTemp.key = v;
            oTemp.position = markName.position;
            oTemp.ellipsis = true;
            oTemp.sortable = true;
            arrObj.push(oTemp);
            fieldArr.push(field);
          }
        });
        let len = arrObj.length; //记录表头数量
        let width = this.fieldWidth(".contentBody .ivu-table-header", len);
        // console.log(width);
        arrObj.forEach((v, i) => {
          v.width = width;
        });

        // 表头字段排序
        arrObj.sort(function(a, b) {
          return Number(a.position) - Number(b.position);
        });

        sessionStorage.setItem(
          "config_" + _this.tableName + "_head",
          JSON.stringify(arrObj)
        );
        sessionStorage.setItem(
          "config_" + _this.tableName + "_field",
          JSON.stringify(fieldArr)
        );

        let newArr = arrObj;
        newArr.push(end);
        _this.ConfigThead = newArr;
        _this.initTableColumn(_this.ConfigThead);
        _this.fieldData = fieldArr;
      } else {
        let arrObj2 = JSON.parse(thead);
        arrObj2.push(end);
        this.ConfigThead = arrObj2;
        this.initTableColumn(this.ConfigThead);
        if (this.changetableName) {
          this.changetableName = false;
          this.clickRow = false;
          this.fieldData = JSON.parse(fieldArr);
        }
      } 
    },
    // 判断是否切换表名, 切换, 则调用getTableHead的时候执行最下面函数, 否则不执行
    ischangetableName(){
      this.changetableName = true;
    },
    tableDataProce(info) {//================================================
      let _this = this;
      _this.totalPage = info.data.totalPage;
      _this.totalBar = info.data.totalRecord;
      let ConfigTdata = info.data.list;
      ConfigTdata.forEach((v, i) => {
        if (v.Id == this.Id) {//关系跳转设置默认选中状态
          v._highlight = true;
          // this.getRecordInfo();
        }
        for (let a in v) {
          if (v[a] != null && typeof v[a] == "object") {
            v[a] = v[a].Description;
          }
        }
      });
      _this.ConfigTdata = ConfigTdata;
      _this.loading = false; //加载完成时
    },
    //view类型表头数据
    getViewTableHead(info){
      let _this = this;
      let ConfigTdata = info.data.list[0];
      let arra = [];
      for(let k in ConfigTdata){
        let obja = {};
        obja.title = k;
        obja.key = k;
        obja.ellipsis = true;
        arra.push(obja);
      }
      let len = arra.length; //记录表头数量
      let width = this.fieldWidth(".contentBody .ivu-table-header", len);
      arra.forEach((v, i) => {
        v.width = width;
      });
      _this.ConfigThead = arra;
      _this.initTableColumn(_this.ConfigThead);
    },
    //view类型表数据处理
    viewDataProce(info){//=====================================================
      let _this = this;
      _this.totalPage = info.data.totalPage;
      _this.totalBar = info.data.totalRecord;
      let ConfigTdata = info.data.list;
      ConfigTdata.forEach((v, i) => {
        if (v.Id == this.Id) {//关系跳转设置默认选中状态
          v._highlight = true;
          // this.getRecordInfo();
        }
        for (let a in v) {
          if (v[a] != null && typeof v[a] == "object") {
            v[a] = v[a].Description;
          }
        }
      });
      _this.ConfigTdata = ConfigTdata;
      _this.loading = false; //加载完成时
    },
    getTableData() {//表格数据获取
      // this.pageNum = this.pageNums;
      let _this = this;
      _this.loading = true; //加载中
      if (_this.tableType == "view") {
        _this.$http
          .post(
            "/viewController/getViewCardList?funcionName=" +
              _this.funcionName +
              "&pageNum=" +
              _this.pageNum +
              "&pageSize=" +
              _this.pageSize +
              "&sortAttribute=" +
              _this.sortAttribute +
              "&sort=" +
              _this.sort
          )
          .then((info) => {
            _this.getViewTableHead(info);
            _this.viewDataProce(info);
            this.pageDisabled();//解决搜索->不搜索时尾页禁用问题
          });
      } else {
        _this.$http
          .get(
            "/cardController/getCardList?table=" +
              _this.tableName +
              "&pageNum=" +
              _this.pageNum +
              "&pageSize=" +
              _this.pageSize +
              "&sortAttribute=" +
              _this.sortAttribute +
              "&sort=" +
              _this.sort
          )
          .then((info) => {
            _this.getTableHead(info);
            _this.tableDataProce(info);
            this.pageDisabled();//解决搜索->不搜索时尾页禁用问题
          });
      }
    },
    // 字段排序
    sorting(s){
      this.sortAttribute = s.key;
      this.sort = s.order;
      this.getTableData();
    },
    // 点击表格的行
    getRecordInfo(res) {
      this.clickRow = true; //点击状态参数
      this.recordId = res.Id; //获取记录id
      let lookupdt = this.lookupInfo;
      // console.log(lookupdt);//lookup数据
      let relatedt = this.relationInfo;
      let addData = {};
      let attr = JSON.parse(
        //表头信息
        sessionStorage.getItem("config_" + this.tableName + "_attribute")
      );
      // console.log(res);
      // console.log(attr);//本行具体信息
      // return false;
      // 找到字段对应的中文名
      attr.forEach(function(v, i) {
        for (let k in res) {
          if (v.attribute == k) {
            v.content = res[k];
          }
        }
      });
      // return false;
      attr.forEach((v, i) => {
        if (v.type == "lookup") {
          v.lookupMsg = lookupdt[v.attribute];
          // console.log(v);
          let conStr = v.content;
          // console.log(conStr);
          let conArry;
          if (conStr != null) {
            conArry = conStr.split('-');
          } else {
            conArry = [null];
          }
          v.content = findId(v.lookupMsg, conArry, 0, []);
          function findId(obj, conArry, q, newArry){
            for(let val in obj){
              if(obj[val].label && obj[val].label == conArry[q]){
                newArry.push(obj[val].value);
                q++;
                if(q<conArry.length){
                  findId(obj[val].children, conArry, q, newArry);
                }
              } else if (!obj[val].label) {
                newArry.push(obj[val].value);
              }
            }
            return newArry;
          }
        } else if (v.type == "reference") {
          for (let ri = 0; ri < relatedt.length; ri++) {
            if (v.lr == relatedt[ri].domainname) {
              if (relatedt[ri].domainclass1 == this.tableName) {
                v.relationTable = relatedt[ri].domainclass2;
              } else {
                v.relationTable = relatedt[ri].domainclass1;
              }
            }
          }
        }
      });
      addData.tableName = this.tableName;
      addData.tableCname = this.tableCname;
      addData.titleMsg = attr;
      addData.Id = this.recordId;
      // console.log(addData);
      this.$store.commit("getaddMsg", addData);
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
        return {
          cname: c[0].cname,
          position: c[0].position
        }
      }
    },
    // 分页
    pageChange(page) {
      this.pageNum = page;
      this.pageDisabled();
      if (JSON.stringify(this.fielddataObj) != "{}") {
        // 说明有字段搜索
        this.fieldSearch();
      } else {
        this.getTableData(this.tableName);
      }
    },
    // 首页尾页禁用于否
    pageDisabled(){
      if(this.pageNum == 1){
        this.firstCl = true;
        this.lastCl = false;
      }else if(this.pageNum == this.totalPage){
        this.firstCl = false;
        this.lastCl = true;
      }else {
        this.firstCl = false;
        this.lastCl = false;
      }
    },
    pageFirst() {
      this.pageNum = 1;
      this.pageDisabled();
      if (JSON.stringify(this.fielddataObj) != "{}") {
        // 说明有字段搜索
        this.fieldSearch();
      } else {
        this.getTableData(this.tableName);
      }
    },
    pageLast() {
      this.pageNum = this.totalPage;
      this.pageDisabled();
      if (JSON.stringify(this.fielddataObj) != "{}") {
        // 说明有字段搜索
        this.fieldSearch();
      } else {
        this.getTableData(this.tableName);
      }
    },
    getlookup() {
      //获取相关数据
      //lookup
      let _this = this;
      _this.$http
        .post(
          "/relationController/getLookuplistByTable?table=" + _this.tableName
        )
        .then(function(info) {
          let newlookup = {};
          for(let i in info.data){
            newlookup[i] = transformObj(info.data[i]);
            function transformObj(arr){
              let arrb = [];
              arr.forEach(function(v, i){
                let obja = {};
                if(v.Description){
                  obja.label = v.Description;
                }
                obja.value = v.Id;
                if(v.child){
                  obja.children =[];
                  if(v.child.length != 0){
                    obja.children = transformObj(v.child);
                  }
                }
                arrb.push(obja);
              });
              return arrb;
            };
          }
          _this.lookupInfo = newlookup;
        });
      //relationTable
      _this.$http
        .get("/relationController/getDomainList?table=" + _this.tableName)
        .then(function(res) {
          _this.relationInfo = res.data;
        });
    },
    // 模糊查询
    fuzzy() {
      let _this = this;
      _this.loading = true; //加载中
      let result = _this.$http
        .post(
          "cardController/fuzzyQuery?tableName=" +
            _this.tableName +
            "&condition=" +
            _this.configCondition +
            "&pageNum=" +
            _this.pageNum +
            "&pageSize=" +
            _this.pageSize
        )
        .then(function(info) {
          _this.totalBar = info.data.totalRecord;
          let ConfigTdata = info.data.list;
          ConfigTdata.forEach(function(v, i) {
            for (let i in v) {
              if (v[i] != null && typeof v[i] == "object") {
                v[i] = v[i].Description;
              }
            }
          });
          console.log(ConfigTdata);
          _this.ConfigTdata = ConfigTdata;
          _this.loading = false; //加载完成时
        });
    },
    ctrlView(recordId) {
      let _this = this;
        _this.$http
          .get(
            "/cardController/card?table=" +
            _this.tableName +
            "&Id=" +
            recordId
          )
          .then(function(info) {
            let newArr = [];
            Object.keys(info.data).forEach(function(v, i) {
              let newObj = {};
              if (_this.attributeCName(v)) {
                let attr = _this.attributeCName(v).cname;
                let position = _this.attributeCName(v).position;
                if (typeof info.data[v] == "object" && info.data[v] != null) {
                  newObj[attr] = info.data[v].Description;
                  newObj.position = position;
                } else {
                  newObj[attr] = info.data[v];
                  newObj.position = position;
                }
                newArr.push(newObj);
              }
            });
            // 排序
            newArr.sort(function(a, b) {
              return Number(a.position) - Number(b.position);
            });
            // console.log(newArr);
            let content = '';
            newArr.forEach((v, i) => {
              for(let k in v){
              if (k != 'position') {
                content += k + ': ' + v[k] + '<br>';
              }
            }
          })
            content = content.split('null').join('');//详情为null的显示为空
            // console.log(content);
            _this.$Modal.info({
              title: "详细信息",
              content: content
            });
            // _this.configViewData = newObj;
          })
          .catch(function(error) {
            //  console.log(error);
          });
        // _this.configViewModal = true;
    },
    /*ctrlView() {
      let _this = this;
      if (_this.clickRow == true) {
        // console.log(_this.clickRow);
        //选中行
        _this.$http
          .get(
            "/cardController/card?table=" +
              _this.tableName +
              "&Id=" +
              _this.recordId
          )
          .then(function(info) {
            let newArr = [];
            Object.keys(info.data).forEach(function(v, i) {
              let newObj = {};
              if (_this.attributeCName(v)) {
                let attr = _this.attributeCName(v).cname;
                let position = _this.attributeCName(v).position;
                if (typeof info.data[v] == "object" && info.data[v] != null) {
                  newObj[attr] = info.data[v].Description;
                  newObj.position = position;
                } else {
                  newObj[attr] = info.data[v];
                  newObj.position = position;
                }
                newArr.push(newObj);
              }
            });
            // 排序
            newArr.sort(function(a, b) {
              return Number(a.position) - Number(b.position);
            });
            // console.log(newArr);
            let content = '';
            newArr.forEach((v, i) => {
              for(let k in v){
                if (k != 'position') {
                  content += k + ': ' + v[k] + '<br>';
                }
              }
            })
            content = content.split('null').join('');//详情为null的显示为空
            // console.log(content);
            _this.$Modal.info({
              title: "详细信息",
              content: content
            });
            // _this.configViewData = newObj;
          })
          .catch(function(error) {
            //  console.log(error);
          });
        // _this.configViewModal = true;
      } else {
        //未选中行
        _this.$Message.error("您未选中行！");
      }
    },*/
    ctrlDele() {
      if (this.clickRow == true) {
        this.configDeleModal = true;
      } else {
        this.$Message.error("您未选中行！");
      }
    },
    ctrlEdit() {
      if (this.clickRow == true) {
        //将已选中行进行编辑
        this.$router.push({ path: "/config/cedit" }); //跳转至新增页面
      } else {
        this.$Message.error("您未选中行！");
      }
    },
    ctrlHistory() {
      if (this.clickRow == true) {
        //将跳转到历史记录
        this.$emit("transferRecord", this.recordId);
        //跳转到添加页
        this.$router.push({ path: "/config/historyRecord" });
        //console.log("将跳转到历史记录");
      } else {
        this.$Message.error("您未选中行！");
      }
    },
    ctrlRelete() {
      if (this.clickRow == true) {
        //将跳转到关系页面  表名 记录id 已获取, 获取和选中记录有关系表的表和表中有关系的记录
        let data = { table: this.tableName, Id: this.recordId };
        this.$http
          .post("/relationController/getRelationList", data)
          .then(info => {
            // console.log(info);
            if (info.status == 200 && Object.keys(info.data).length != 0) {
              let data = {
                tableName: this.tableName, //表名
                Id: this.recordId, //记录Id
                relationMsg: info.data, //与该记录有关系的表与表中的记录
                disabled: this.isdisable,//登录人员对该关系的权限也要传递过去
              };
              this.$store.commit("getrelationMsg", data);
              this.$router.push({ path: "/config/relation" });
            } else if (info.status == 200 && Object.keys(info.data).length == 0 ) {
              this.$Message.error({
                content: "该记录尚未与其他记录关联, 查询关系不存在"
              });
            }
          });
      } else {
        this.$Message.error("您未选中行！");
      }
    }, 
    configDele() {
      let _this = this;
      _this.deleLoading = true;
      _this.$http
        .delete(
          "/cardController/card?table=" +
            _this.tableName +
            "&&Id=" +
            _this.recordId
        )
        .then(function(info) {
          if (info.data == 'ok') {
            _this.deleLoading = false;
            _this.configDeleModal = false;
            _this.getTableData();
            _this.$Message.success("删除成功");
          } else if (info.data == 'failed') {
            this.$Message.error('删除失败');
          }
        })
        .catch(function(error) {
          _this.deleLoading = false;
          _this.configDeleModal = false;
          _this.getTableData();
          _this.$Message.error("删除失败");
        });
    },
    configAdd() {
      let _this = this;
      let lookupdt = _this.lookupInfo;
      let relatedt = _this.relationInfo;
      let addData = {};
      let attr = JSON.parse(
        sessionStorage.getItem("config_" + _this.tableName + "_attribute")
      );
      attr.forEach(function(v, i) {
        let a = v.attribute;
        if (v.type == "lookup") {
          v.lookupMsg = lookupdt[v.attribute];
        } else if (v.type == "reference") {
          for (let ri = 0; ri < relatedt.length; ri++) {
            if (v.lr == relatedt[ri].domainname) {
              if (relatedt[ri].domainclass1 == _this.tableName) {
                v.relationTable = relatedt[ri].domainclass2;
              } else {
                v.relationTable = relatedt[ri].domainclass1;
              }
            }
          }
        }
      });
      addData.tableName = _this.tableName;
      addData.tableCname = this.tableCname;
      addData.titleMsg = attr;
      // console.log(addData);
      _this.$store.commit("getaddMsg", addData);
      //跳转到添加页
      this.$router.push({ path: "/config/cadd" });
    },
    configDownload() {
      //下载中文字段数据
      console.log(this.fielddataObj);
      if (this.configCondition == '' && JSON.stringify(this.fielddataObj) == "{}") {
        window.open(
          "/cardController/downLoadExcel?table=" + this.tableName,
          "_self"
        );
      } else if (this.configCondition != '') {
        window.open(
          "/cardController/downLoadExcel?table=" + this.tableName + '&condition=' + this.configCondition,
          "_self"
        );
      } else if (JSON.stringify(this.fielddataObj) != "{}") {
        window.open(
          "/cardController/downLoadExcel?table=" + this.tableName + '&condition=' + JSON.stringify(this.fielddataObj),
          "_self"
        );
      }
    },
    // 在跳转页面之前先获取到关系表的详细信息, 如果关系不为空, 再进行页面跳转
    getrelationMsg() {
      let data = { table: this.tableName, Id: this.recordId }; //获取详细信息
      this.$http
        .post("/relationController/getRelationList", data)
        .then(info => {
          if (info.status == 200 && Object.keys(info.data).length != 0) {
            //请求成功且有数据
            // console.log(info.data);
            //将数据存储到公共仓库, 页面跳转...
            let data = {
              tableName: this.tableName,//原表表名
              Id: this.recordId,//原纪录id
              relationMsg: info.data
            };
            this.$store.commit("getrelationMsg", data);
            this.$router.push({ path: "/config/relation" });
          } else if (info.status == 200 && Object.keys(info.data).length == 0) {
            this.$Message.error({
              content: "该记录尚未与其他记录关联, 查询关系不存在"
            });
          }
        });
    },
    //字段搜索，当输入框点击回车时
    fsInput(flag){
      if(flag){
        this.fieldSearch();
      }
    },
    // 字段搜索
    fieldSearch(flag){
      this.loading = true;
      let dataObj = {};
      // 选择出: 处于选中状态 && 搜索内容不为空 的内容发送给后台
      this.fieldData.forEach((v, i) => {
        if (v.flag && v.value !== "") {
          dataObj[v.eName] = v.value;
        }
      })
      // console.log(dataObj);
      this.fielddataObj = dataObj;
      if (JSON.stringify(dataObj) != "{}") {
        let data = 'tableName=' + this.tableName + '&condition=' + JSON.stringify(dataObj) + '&pageNum=' + this.pageNum + '&pageSize=' + this.pageSize;
        this.$http.post('/cardController/attribubtesFuzzyQuery', data).then(info => {
          if (info.data.totalPage < info.data.pageNum) {
            this.pageNum = 1;
            this.pageDisabled();
            data = 'tableName=' + this.tableName + '&condition=' + JSON.stringify(dataObj) + '&pageNum=' + this.pageNum + '&pageSize=' + this.pageSize;
            // 重新发送请求, 并且处理数据
            this.$http.post('/cardController/attribubtesFuzzyQuery', data).then(info => {
              // 正常处理数据
              if (info.data.list.length != 0) {
                //获取表头数据：
                let arrA = Object.keys(info.data.list[0]); //获取对象内所有属性
                let arrObj = [];
                arrA.forEach((v, i) => {
                  let oTemp = {};
                  let markName = this.attributeCName(v);
                  let cname;
                  if (markName != null) {
                    cname = markName.cname;
                    oTemp.title = cname;
                    oTemp.key = v;
                    oTemp.position = markName.position;
                    oTemp.ellipsis = true;
                    oTemp.sortable = true;
                    arrObj.push(oTemp);
                  }
                });
                let len = arrObj.length; //记录表头数量
                let width = this.fieldWidth(".contentBody .ivu-table-header", len);
                arrObj.forEach((v, i) => {
                  v.width = width;
                });

                // 表头字段排序
                arrObj.sort(function(a, b) {
                  return Number(a.position) - Number(b.position);
                });

                let newArr = arrObj;
                this.ConfigThead = newArr;
                this.initTableColumn(this.ConfigThead);
                this.tableDataProce(info);
              } else {
                // 这个表示没查到数据
                this.ConfigTdata = [];
                this.loading = false;
              }
            })
          } else {
            // 正常处理数据
            if (info.data.list.length != 0) {
              //获取表头数据：
              let arrA = Object.keys(info.data.list[0]); //获取对象内所有属性
              let arrObj = [];
              arrA.forEach((v, i) => {
                let oTemp = {};
                let markName = this.attributeCName(v);
                let cname;
                if (markName != null) {
                  cname = markName.cname;
                  oTemp.title = cname;
                  oTemp.key = v;
                  oTemp.position = markName.position;
                  oTemp.ellipsis = true;
                  oTemp.sortable = true;
                  arrObj.push(oTemp);
                }
              });
              let len = arrObj.length; //记录表头数量
              let width = this.fieldWidth(".contentBody .ivu-table-header", len);
              arrObj.forEach((v, i) => {
                v.width = width;
              });

              // 表头字段排序
              arrObj.sort(function(a, b) {
                return Number(a.position) - Number(b.position);
              });

              let newArr = arrObj;
              this.ConfigThead = newArr;
              this.initTableColumn(this.ConfigThead);
              this.tableDataProce(info);
            } else {
              // 这个表示没查到数据
              this.ConfigTdata = [];
              this.loading = false;
            }
          }

        })
      } else {
        this.getTableData();
      }
    },
    // 增删改查按钮禁用于否
    isDisabled() {
      this.isdisable = this.Mode == "w" ? false : true;
    },
    // 字段宽度设置
    fieldWidth(dom, len){
      let theadWidth = document.querySelector(dom).offsetWidth + 240 - 97;
      let width = theadWidth / len > 150 ? theadWidth / len : 150;
      return width;
    },
    // 获取当前行详细信息
    initTableColumn(columnName){
      for(let i = 0; i < columnName.length; i++){
        if(!columnName[i].render) {
          this.$set(columnName[i], 'ellipsis', true);
          this.$set(columnName[i], 'render', (h, params) => {
            return h('span', {attrs: {title: params.row[params.column.key]}}, params.row[params.column.key]);
          });
        }
      }
    },
    // 高度自适应
    heightAdaptive() {
      let clientH = document.documentElement.clientHeight;
      this.clientW = document.documentElement.clientWidth;
      this.contentH =  clientH - 65 +'px';
      this.contentbodyH = clientH - 138 + 'px';
      this.tableHeight = clientH - 222; //64:导航高；140：包括搜索, margin-top, 分页所在区域高
    },
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.menuCtrl {
  margin: 4px 20px;
  line-height: 2;
}
.miniWindow{
  .fieldSearch{
    line-height: 0;
    .ivu-dropdown-rel{
      .ivu-btn.ivu-btn-primary{
        // background-color: #55b5d1;
        // border-color: #55b5d1;
      }
    }
    .ivu-select-dropdown{
      .ivu-dropdown-menu{
        // max-height: 150px;
        // overflow: scroll;
        .ivu-dropdown{
          text-align: left;
          .ivu-dropdown-rel{
            label{
              float: left;
            }
            i{
              float: right;
            }
            .ivu-dropdown-item{
              width: 180px;
            }
          }
        }
      }
      // .ivu-dropdown-menu::-webkit-scrollbar {display:none}
    }
  }
}
</style>

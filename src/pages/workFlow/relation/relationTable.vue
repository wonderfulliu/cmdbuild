<template>
  <Layout class="miniWindow">
    <div id="relationTableContainer" :style="{height:contentbodyH}">
      <Header class="layout-header-bar" style="padding: 0">
        <Row>
          <Col :xs="{span: 8, offset: 1}" :sm="{span: 5, offset: 1}" :md="{span: 5, offset: 1}" :lg="{span: 5, offset: 1}">
            <h3 style="text-align: left; font-weight: 400">关系表: &nbsp;&nbsp;<span style="font-weight: 700">{{FrelationTableCname}}</span></h3>
          </Col>
          <Col :xs="12" :sm="12" :md="10" :lg="11">
            <Input v-model="searchMsg" @on-enter="wfsearch" placeholder="Enter something...">
              <Button slot="append" type="info" icon="ios-search" @click="wfsearch">搜索</Button>
            </Input>
          </Col>
          <Col :xs="14" :sm="12" :md="8" :lg="7">
            <div class="btnContainer">
              <Button type="primary" @click="cancel">取消</Button>
              <Button type="success" @click="confirm">确认</Button>
            </div>
          </Col>
        </Row> 
      </Header>
      <Content ref="conBbody" class="contentTable">
        <div class="contentBody">
          <Table border
                 highlight-row
                 stripe
                 :height="tableHeight"
                 size="small"
                 v-if="isOne"
                 :loading="loading"
                 :data="data"
                 :columns="columns"
                 @on-current-change="selectOne"></Table>
          <Table border
                 stripe
                 :height="tableHeight"
                 size="small"
                 v-if="isN"
                 :loading="loading"
                 :data="data"
                 :columns="columns"
                 @on-select="selectN"></Table>
          
          <div style="line-height: 64px; height: 64px; text-align: right" id="pagerCont"  >
          <Row>
            <Col :xs="{span:4,offset:1}" :sm="{span:9,offset:1}" :md="{span:12,offset:1}" :lg="{span:15,offset:1}" style="text-align: left">
            
            </Col>
            <Col :xs="{span:18}" :sm="{span:14}" :md="{span:11}" :lg="{span:8}" style="text-align: right; float: right">
              <Row>
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
                </Col>
                <Col span="14" style="width: 190px;text-align: center">
                <Page simple
                      show-total
                      :page-size=20
                      :total="totalBar"
                      :current="pageNum"
                      @on-change="pageChange">
                </Page>
                </Col>
                <Col span="2">
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
    </div>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      columns: [], //表格数据渲染{highlightRow: isOne}
      data: [],
      pageNum: 1,
      relationTable: "", //上一页传来的信息
      tableId: "",
      reftitleMsg: "",
      reftableMsg: "",
      domainlistMsg: "",
      loading: false, //表格loading
      searchMsg: "", // 搜索
      NorOne: "", //关系n或1
      isOne: true, //单选
      isN: "", //多选
      addData: '',//要添加的数据
      tableHeight: '',//表格的高度
      contentbodyH: '', //内容区域的高度
      // 回显添加后的关系数据时使用
      tableName: '',//原表名
      recordId: '', //原表的纪录
      isdisable: '', //是否禁用
      firstCl: true,//首页是否禁用
      lastCl: false,//尾页是否禁用
      totalBar: 0, //总条数
      totalPage: null, //总页数
      domainname: '',
      FrelationTableCname: '',//关系表中文名
    };
  },
  created() {
    this.heightAdaptive();
    this.getrefMsg();
  },
  methods: {
    // 获取中文表头和表格详细数据
    getrefMsg() {
      let refMsg = this.$store.state.refMsg;

      this.relationTable = refMsg.relationTable;
      this.reftitleMsg = refMsg.reftitleMsg;
      this.reftableMsg = refMsg.reftableMsg;
      this.NorOne = refMsg.NorOne;
      this.tableId = refMsg.tableId;
      this.domainname = this.$store.state.relationTableCE.domainname;
      this.FrelationTableCname = this.$store.state.relationTableCE.FrelationTableCname;

      this.domainlistMsg = this.$store.state.domainlistMsg;
      this.dataProcess(this.reftitleMsg, this.reftableMsg);
      this.tableName = this.$store.state.relationMsg.tableName;
      this.recordId = this.$store.state.relationMsg.Id;
      this.isdisable = this.$store.state.relationMsg.mode;
    },
    //刚进入该页面时表格数据的处理
    dataProcess(titleMsg, tableMsg) {
      this.totalBar = tableMsg.totalRecord;// 总条数
      this.totalPage = tableMsg.totalPage; //总页数
      this.pageDisabled();
      let dataArr = tableMsg.list; //要处理和渲染的表格数据
      if (this.NorOne == '1') {
        this.isOne = true;
        this.isN = false;
        // 设置开头单选
        var start = {
          type: "index",
          width: 50,
          align: "center"
        };
      } else if (this.NorOne == 'N') {
        this.isOne = false;
        this.isN = true;
        var start = {
          type: 'selection',
          width: 50,
          align: 'center'
        };
      }

      // 设置每个td的宽度(写在此处)
      let width = 150;
      //获取表头
      let newtitleArr = []; //存储最终要给columns的表头数据
      newtitleArr.push(start);

      let j = 0;
      titleMsg.forEach(function(v, i) {
        v.title = v.cname;
        v.key = ++j;
        v.width = width;
        v.ellipsis = true;
        newtitleArr.push(v);
      });
      let theadWidth = document.documentElement.clientWidth - 17 - 100 - 50;
      width = theadWidth / j > 150 ? theadWidth / j : 150;
      
      titleMsg.forEach(function(v, i) {
        v.width = width;
      });
      
      this.columns = newtitleArr;

      // 渲染表格数据
      let newtableArr = []; //存储最终要赋给表格的数据
      dataArr.forEach(function(v, i) {
        //v表示待过滤数据中的每个对象, 一共6个对象
        let newObj = {};
        for (var key in v) {
          //key表示每个待过滤对象的键
          if (key == "Id") {
            newObj.Id = v[key];
          } else {
            newtitleArr.forEach(function(val, index) {
              //val表示表头每个字段对象
              if (key == val.attribute) {
                if (v[key] != null && typeof v[key] == "object") {
                  //如果是对象, 那么值为123
                  newObj[val.key] = v[key].Description;
                } else if (v[key] == null) {
                  newObj[val.key] = v[key];
                } else {
                  newObj[val.key] = v[key];
                }
              }
            });
          }
        }
        newtableArr.push(newObj);
      });
      this.data = newtableArr;
      this.loading = false;
    },
    // --------------------------------------
    // 获取模态框中的reference数据
    getreferenceData() {
      this.loading = true;
      let data = "?table=" + this.relationTable + '&domain=' + this.domainname + "&pageNum=" + this.pageNum;
      this.$http.get("/cardController/getRelationCardList" + data).then(info => {
        if (info.status == 200) {
          this.contentdataProcess(info);
        }
      });
    },
    // 点击搜索按钮时触发的函数
    wfsearch(){
      this.pageNum = 1;
      this.pageDisabled();
      this.search();
    },
    // 搜索功能
    search() {
      this.loading = true;
      let data = {
        tableName: this.relationTable,
        pageNum: this.pageNum,
        condition: this.searchMsg
      };
      this.$http
        .post("/cardController/fuzzyQuery", this.$qs.stringify(data))
        .then(
          info => {
            if (info.status == 200) {
              this.contentdataProcess(info);
            }
          },
          info => {
            this.$Message.error({
              content: "查询失败"
            });
            this.loading = false;
          }
        );
    },
    //搜索与分页表格数据的处理
    contentdataProcess(info) {
      this.totalBar = info.data.totalRecord;
      this.totalPage = info.data.totalPage;
      let dataArr = info.data.list; //要处理和渲染的表格数据
      // 设置开头多选
      let start = {
        type: "selection",
        width: 50,
        align: "center"
      };

      let newtitleArr = this.columns;
      let newcontentArr = []; //存储最终要赋给表格的数据
      dataArr.forEach(function(v, i) {
        //v表示待过滤数据中的每个对象, 一共6个对象
        let newObj = {};
        for (var key in v) {
          //key表示每个待过滤对象的键
          if (key == "Id") {
            newObj.Id = v[key];
          } else {
            newtitleArr.forEach(function(val, index) {
              //val表示表头每个字段对象
              if (key == val.attribute) {
                if (v[key] != null && typeof v[key] == "object") {
                  //如果是对象, 那么值为123
                  newObj[val.key] = v[key].Description;
                } else if (v[key] == null) {
                  newObj[val.key] = v[key];
                } else {
                  newObj[val.key] = v[key];
                }
              }
            });
          }
        }
        newcontentArr.push(newObj);
      });
      this.data = newcontentArr;
      this.loading = false;
    },
    // --------------------------------------
    // 单选: 以下方法与多选获取参数的方法不一样
    selectOne(selection, index) {
      // 两个参数分别代表已选择的项和选择项的index
      // console.log(this.relationTable);
      // console.log(this.domainlistMsg);
      let data = {};
      let records = [];
      this.domainlistMsg.forEach((v, i) => {
        if (v.domainclass1 == this.relationTable) {
          let obj = {};
          data.domainname = v.domainname;
          obj.domainname = v.domainname;
          obj.domainclass1 = '"' + this.relationTable + '"';
          obj.idobj1 = selection.Id;
          obj.domainclass2 = '"' + v.domainclass2 + '"';
          obj.idobj2 = this.tableId;
          records.push(obj);
          data.records = records;
        } else if (v.domainclass2 == this.relationTable) {
          let obj = {};
          data.domainname = v.domainname;
          obj.domainname = v.domainname;
          obj.domainclass2 = '"' + this.relationTable + '"';
          obj.idobj2 = selection.Id;
          obj.domainclass1 = '"' + v.domainclass1 + '"';
          obj.idobj1 = this.tableId;
          records.push(obj);
          data.records = records;
        }
      })
      this.addData = data;
      // console.log(data);
    },
    // 多选
    selectN(selection, index){
      let data = {};
      let records = [];
      this.domainlistMsg.forEach((v, i) => {
        if (v.domainclass1 == this.relationTable) {
          data.domainname = v.domainname;
          selection.forEach((val, index) => {
            let obj = {};
            obj.domainname = v.domainname;
            obj.domainclass1 = '"' + this.relationTable + '"';
            obj.idobj1 = val.Id;
            obj.domainclass2 = '"' + v.domainclass2 + '"';
            obj.idobj2 = this.tableId;
            records.push(obj);
          })
          data.records = records;
        } else if (v.domainclass2 == this.relationTable) {
          data.domainname = v.domainname;
          selection.forEach((val, index) => {
            let obj = {};
            obj.domainname = v.domainname;
            obj.domainclass2 = '"' + this.relationTable + '"';
            obj.idobj2 = val.Id;
            obj.domainclass1 = '"' + v.domainclass1 + '"';
            obj.idobj1 = this.tableId;
            records.push(obj);
          })
          data.records = records;
        }
      })
      // console.log(data);
      this.addData = data;
    },
    // 如果要动态渲染数据, 就需要每次操作成功后, 再次发送请求新的数据, 但是每次请求返回的都是多个关系表, 并不是单个的
    getNewdata(){
      let data = { table: this.tableName, Id: this.recordId };
      this.$http.post("/relationController/getRelationList", data).then(info => {
        if (info.status == 200 && Object.keys(info.data).length != 0) {
          let data = {
            tableName: this.tableName, //表名
            Id: this.recordId, //记录Id
            relationMsg: info.data, //与该记录有关系的表与表中的记录
            disabled: this.isdisable,//登录人员对该关系的权限也要传递过去
          };
          this.$store.commit("getrelationMsg", data);
          this.$router.push({ path: "/workflow/wfrelation" });
        }
      });
    },
    // 确认按钮
    confirm() {
      this.$http.post('/relationController/relation', this.addData).then(info => {
        if (info.status == 200) {
          if (info.data == 'ok') {
            this.$Message.success({
              content: '关系添加成功'
            });
            this.getNewdata();
            // this.$router.go(-1);
          } else {
            this.$Message.error({
              content: '关系添加失败'
            })
          }
        }
      })
    },
    // -------------------------下面没啥问题
    // 取消按钮
    cancel() {
      this.$router.go(-1);
    },
    // 高度自适应
    heightAdaptive() {
      let clientH = document.documentElement.clientHeight;
      // console.log(clientH);
      this.contentbodyH = clientH - 64 + "px";
      this.tableHeight = clientH - 64 - 128; //133包括按钮区域, margin-top, 分页所在区域
    },
    // 点击分页切换分页
    pageChange(page) {
      this.pageNum = page;
      this.pageDisabled();
      if (this.searchMsg) {
        this.search();
      } else {
        this.getreferenceData();
      }
    },
    // 首页尾页禁用于否
    pageDisabled(){
      if (this.pageNum == 1) {
        this.firstCl = true;
        if (this.totalPage == 1) {
          this.lastCl = true;
        } else {
          this.lastCl = false;
        }
      } else {
        this.firstCl = false;
        if (this.totalPage == this.pageNum) {
          this.lastCl = true;
        } else {
          this.lastCl = false;
        }
      }
    },
    pageFirst() {
      this.pageNum = 1;
      this.pageDisabled();
      if (this.searchMsg) {
        this.search();
      } else {
        this.getreferenceData();
      }
    },
    pageLast() {
      this.pageNum = this.totalPage;
      this.pageDisabled();
      if (this.searchMsg) {
        this.search();
      } else {
        this.getreferenceData();
      }
    },
  }
};
</script>

<style lang="scss">
#relationTableContainer{
  .ivu-checkbox-wrapper{
    margin-right: 0;
  }
}
</style>

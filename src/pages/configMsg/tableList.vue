<template>
  <Layout class="miniWindow" ref="contentBody" :style="{height:contentbodyH}">
    <Header ref="conBhead" :style="{padding: 0}" class="layout-header-bar">
      <Row>
        <Col span="1">
        <div class="">
          <Icon @click.native="collapsedSider" :class="rotateIcon" class="menuCtrl" type="navicon-round" size="24"></Icon>
          <!-- <Button type="ghost">searchFilter</Button> -->
        </div>
        </Col>
        <Col :xs="{span: 20,offset: 1}" :sm="{span: 18,offset: 2}" :md="{span: 16,offset:3}" :lg="{span: 9,offset:1}">
          <Input v-model="configCondition" placeholder="Enter something...">
            <Button slot="append" type="info" icon="ios-search" @click="fuzzy">搜索</Button>
          </Input>
        </Col>
        <Col :xs="24" :sm="{span:20,offset:2}" :md="{span:20,offset:2}" :lg="{span: 12,offset:1}">
        <ButtonGroup>
          <Button type="info" title="下载" icon="ios-download-outline" @click="configDownload">下载</Button>
          <Button type="info" title="新增" icon="ios-plus-empty" @click="configAdd" :disabled='isdisable'>新增</Button>
          <Button type="info" title="编辑" icon="ios-compose-outline" @click="ctrlEdit" :disabled='isdisable'>编辑</Button>
          <Button type="info" title="查看" icon="ios-eye" @click="ctrlView">查看</Button>
          <Button type="info" title="历史" icon="ios-paper-outline" @click="ctrlHistory">历史</Button>
          <Button type="info" title="关系" icon="ios-infinite" @click="ctrlRelete">关系</Button>
          <Button type="info" title="删除" icon="ios-trash-outline" @click="ctrlDele" :disabled='isdisable'>删除</Button>
        </ButtonGroup>
        </Col>
      </Row>
    </Header>
    <Content ref="conBbody">
      <div class="contentBody">
        <Table border
               stripe
               ref="tableCont"
               size="small"
               :height="tableHeight"
               @on-row-click="getRecordInfo"
               :highlight-row="highlight"
               :loading="loading"
               :columns="ConfigThead"
               :data="ConfigTdata">
        </Table>
        <div ref="pageCont" class="pageContainer clearfix floatRight">
          <Button type="ghost" class="floatLeft" @click="pageFirst">首页</Button>
          <Page class="floatLeft"
                show-elevator
                show-total
                :page-size="20"
                :current="pageNum"
                :total="totalBar"
                @on-change="pageChange"></Page>
          <Button type="ghost" class="floatLeft" @click="pageLast">尾页</Button>
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
    tableType: {
      type: String,
      required: true
    },
    Mode: {
      type: String,
      required: true
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
    }
  },
  data() {
    return {
      //参数
      isCollapsed: false,
      recordId: "", //记录id
      pageNum: 1, //当前页
      pageSize: 20, //每页条数
      totalBar: null, //总条数
      totalPage: null, //总页数
      configCondition: "", //查询条件
      //数据
      ConfigThead: [], //表头
      ConfigTdata: [], //表格数据
      // attributes: '',   //记录的字段 中英文
      lookupInfo: "", //当前表中lookup信息
      relationInfo: "", //关系表信息
      //页面配置：
      loading: true,
      highlight: true,
      clickRow: false,
      contentBody: "",
      contentbodyH: "", //内容区域高度
      tableHeight: "", //表格高度
      //模态框
      configDeleModal: false, //删除modal
      configViewModal: false, //查看modal
      configAddModal: false,
      deleLoading: false,
      configViewData: "", //查看数据
      isdisable: "" //禁用与否, ''就是false
    };
  },
  created() {
    this.heightAdaptive();
    this.isgetTablename();
    this.$watch("tableName", function(newValue, oldValue) {
      this.getTableAttribute();
      this.getTableData();
      this.getlookup();
    });
  },
  methods: {
    // 如果表名已经获取到, 可以调用以下函数
    isgetTablename() {
      if (this.tableName) {
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
            // console.log(info);
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
      if (!thead) {
        let _this = this;

        //获取表头数据：
        let arrA = Object.keys(info.data.list[0]); //获取对象内所有属性
        let arrObj = [];
        arrA.forEach(function(v, i) {
          let oTemp = {};
          let markName = _this.attributeCName(v);
          let cname;
          if (markName != null) {
            cname = markName;
            oTemp.title = cname;
            oTemp.key = v;
            // oTemp.width = 170;在下面根据表头数量设置每格的宽度
            oTemp.ellipsis = true;
            arrObj.push(oTemp);
          }
        });
        let len = arrObj.length; //记录表头数量
        let theadWidth =
          document.querySelector(".contentBody .ivu-table-header").offsetWidth -
          17;
        let width = theadWidth / len > 200 ? theadWidth / len : 200;
        arrObj.forEach((v, i) => {
          v.width = width;
        });
        sessionStorage.setItem(
          "config_" + _this.tableName + "_head",
          JSON.stringify(arrObj)
        );
        let newArr = arrObj;
        _this.ConfigThead = newArr;
      } else {
        this.ConfigThead = JSON.parse(thead);
      }
    },
    tableDataProce(info) {
      let _this = this;
      _this.totalPage = info.data.totalPage;
      _this.totalBar = info.data.totalRecord;
      let ConfigTdata = info.data.list;
      ConfigTdata.forEach(function(v, i) {
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
      let theadWidth =
        document.querySelector(".contentBody .ivu-table-header").offsetWidth -
        17;
      let width = theadWidth / len > 200 ? theadWidth / len : 200;
      arra.forEach((v, i) => {
        v.width = width;
      });
      _this.ConfigThead = arra;
    },
    //view类型表数据处理
    viewDataProce(info){
      let _this = this;
      _this.totalPage = info.data.totalPage;
      _this.totalBar = info.data.totalRecord;
      let ConfigTdata = info.data.list;
      console.log(ConfigTdata);
      ConfigTdata.forEach(function(v, i) {
        for (let a in v) {
          if (v[a] != null && typeof v[a] == "object") {
            v[a] = v[a].Description;
          }
        }
      });
      _this.ConfigTdata = ConfigTdata;
      _this.loading = false; //加载完成时
    },
    getTableData() {
      //表格数据获取
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
              _this.pageSize
          )
          .then(function(info) {
            _this.getViewTableHead(info);
            _this.viewDataProce(info);
          });
      } else {
        _this.$http
          .get(
            "/cardController/getCardList?table=" +
              _this.tableName +
              "&pageNum=" +
              _this.pageNum +
              "&pageSize=" +
              _this.pageSize
          )
          .then(function(info) {
            _this.getTableHead(info);
            _this.tableDataProce(info);
          });
      }
    },
    getRecordInfo(res) {
      // console.log(res);//本行具体信息
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
      // console.log(attr);
      // return false;
      attr.forEach(function(v, i) {
        for (let k in res) {
          if (v.attribute == k) {
            v.content = res[k];
          }
        }
      });

      attr.forEach((v, i) => {
        let a = v.attribute;
        if (v.type == "lookup") {
          v.lookupMsg = lookupdt[v.attribute];
          v.lookupMsg.forEach((val, index) => {
            if (val.Description && val.Description == v.content) {
              v.content = val.Id;
            }
          });
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
        return c[0].cname;
      }
    },
    pageChange(page) {
      this.pageNum = page;
      this.getTableData(this.tableName);
    },
    pageFirst() {
      this.pageNum = 1;
      this.getTableData(this.tableName);
    },
    pageLast() {
      this.pageNum = this.totalPage;
      this.getTableData(this.tableName);
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
          _this.lookupInfo = info.data;
        });
      //relationTable
      _this.$http
        .get("/relationController/getDomainList?table=" + _this.tableName)
        .then(function(res) {
          _this.relationInfo = res.data;
        });
    },
    fuzzy() {
      // 模糊查询
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
                v[i] = v[i].value;
              }
            }
          });
        });
    },
    ctrlView() {
      let _this = this;
      if (_this.clickRow == true) {
        console.log(_this.clickRow);
        //选中行
        _this.$http
          .get(
            "/cardController/card?table=" +
              _this.tableName +
              "&Id=" +
              _this.recordId
          )
          .then(function(info) {
            let newObj = {};
            Object.keys(info.data).forEach(function(v, i) {
              if (_this.attributeCName(v)) {
                let attr = _this.attributeCName(v);
                if (typeof info.data[v] == "object" && info.data[v] != null) {
                  newObj[attr] = info.data[v].Description;
                } else {
                  newObj[attr] = info.data[v];
                }
              }
            });
            _this.configViewData = newObj;
          })
          .catch(function(error) {
            //  console.log(error);
          });
        _this.configViewModal = true;
      } else {
        //未选中行
        _this.$Message.error("您未选中行！");
      }
    },
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
        console.log("将已选中行进行编辑");
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
                disabled: this.isdisable,//权限也要传递过去
              };
              this.$store.commit("getrelationMsg", data);
              this.$router.push({ path: "/config/relation" });
            } else if (
              info.status == 200 &&
              Object.keys(info.data).length == 0
            ) {
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
        .then(function() {
          _this.deleLoading = false;
          _this.configDeleModal = false;
          _this.getTableData();
          _this.$Message.success("删除成功");
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
      addData.titleMsg = attr;
      // console.log(addData);
      _this.$store.commit("getaddMsg", addData);
      //跳转到添加页
      this.$router.push({ path: "/config/cadd" });
    },
    configDownload() {
      //下载中文字段数据
      window.open(
        "/cardController/downLoadExcel?table=" + this.tableName,
        "_self"
      );
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
              tableName: this.tableName,
              Id: this.recordId,
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
    // 禁用于否
    isDisabled() {
      this.isdisable = this.Mode == "w" ? false : true;
    },
    // 高度自适应
    heightAdaptive() {
      let clientH = document.documentElement.clientHeight;
      this.contentbodyH = clientH - 64 + "px";
      this.tableHeight = clientH - 64 - 133; //133包括按钮区域, margin-top, 分页所在区域
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.menuCtrl {
  margin: 4px 20px;
  line-height: 2;
}
</style>

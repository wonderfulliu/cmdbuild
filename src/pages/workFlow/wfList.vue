<template>
  <Layout class="miniWindow wfList">
    <Header ref="conBhead" :style="{padding: 0}" class="layout-header-bar">
      <Row>
        <Col span="2" offset="1">
          <Dropdown class="fieldSearch" trigger="click" placement="bottom-start">
            <Button type="primary">
              字段筛选
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <div id="field">
                <Dropdown trigger="click" placement="right" v-for="(item, index) in fieldData" :key="index" >
                  <DropdownItem>
                    <Checkbox v-model="item.flag" @on-change="wlfieldSearch"></Checkbox>{{item.cName}}
                    <Icon type="ios-arrow-right"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list" style="padding-left: 10px;padding-right: 10px;">
                    <Input size="small" v-model.trim="item.value" @on-enter="fsInput(item.flag)"></Input>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col span="12" offset="6">
          <Input v-model="searchCondition" placeholder="Enter something..." @on-enter="wlsearch">
            <Button slot="append" type="info" icon="ios-search" @click="wlsearch">搜索</Button>
          </Input>
        </Col>
      </Row>
    </Header>
    <Content :style="{height:contentBodyH}">
      <div class="contentBody" style="position: relative;">
        <Table border
               stripe
               size="small"
               :height="tableHeight"
               :highlight-row="highlight"
               :data="wfData"
               @on-row-click="getRecordId"
               :columns="wfColumns"
               no-data-text="">
        </Table>
        <Spin fix v-show="tLoading">
          <Icon type="load-a" size=18 class="spinLoading"></Icon>
          <div>Loading</div>
        </Spin>
        <div style="line-height: 64px; height: 64px;" id="pagerCont">
          <Row>
            <Col :xs="{span:4,offset:1}" :sm="{span:9,offset:1}" :md="{span:12,offset:1}" :lg="{span:15,offset:1}" style="text-align: left">
              <ButtonGroup v-if="clientW>=1102">
                <!--<Button type="ghost" title="" icon="ios-eye" @click="ctrlView">查看</Button>-->
                <Button type="ghost" icon="ios-paper-outline" @click="ctrlHistory">历史</Button>
                <Button type="ghost" icon="ios-infinite" @click="ctrlRelete">关系</Button>
                <Button type="ghost" icon="ios-download-outline" @click="ctrlDownload">下载</Button>
              </ButtonGroup>
              <Dropdown style="margin-left: 20px" v-if="clientW<1102" placement="top" trigger="click">
                <Button type="ghost">
                  操作
                  <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
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
                    <div style="text-align: center" @click="ctrlDownload">
                      <icon type="ios-download-outline"></icon> 下载
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col :xs="{span:19}" :sm="{span:14}" :md="{span:11}" :lg="{span:8}" style="text-align: right">
            <Row>
              <Col span="6">
              共 {{ totalRecord }} 条
              </Col>
              <Col span="2">
              <!-- <Button type="text" icon="chevron-left" @click="pageFirst" :disabled="firstCl" title="首页"></Button> -->
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
                    :total="totalRecord"
                    :current="pageNum"
                    @on-change="pageChange"></Page>
              </Col>
              <Col span="2">
              <!-- <Button type="text" icon="chevron-right" @click="pageLast" :disabled="lastCl" title="尾页"></Button> -->
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
    <Modal v-model="modalScene"
           title="请选择场景"
           @on-ok="chooseSceneOK"
           @on-cancel="chooseSceneCancel">
      <div class="modalBody">
        <RadioGroup v-model="sceneGroup" vertical>
          <Radio :label="sceneItem.Situation"
                 v-for="(sceneItem,index) in sceneType" :key="index">{{ sceneItem.Situation }}</Radio>
        </RadioGroup>
      </div>
    </Modal>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      //表格数据
      wfColumns: [], //变更表表头
      wfData: [], //变更表数据
      recordId: "", //记录id
      //表格配置
      pageNum: 1, //当前页
      pageSize: 20, //每页条数
      totalPage: 0, //总页数
      totalRecord: 0, //总条数
      tableHeight: "", //表格高度
      contentBodyH: "", // .contentBody高度
      highlight: true,
      tLoading: false,
      firstCl: true, //首页是否禁用
      lastCl: false, //尾页是否禁用
      //搜索  （若有搜索功能后）
      searchCondition: "", //搜索条件
      //模态框
      modalScene: false,
      sceneGroup: "", //单选按钮组v-model值
      //页面设置
      clientW: "",
      sceneType: [], //场景分类
      sceneDateAll: [], //场景数据
      currentScene: {}, //当前场景信息
      end: {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 80,
        align: "center",
        render: (h, params) => {
          return h("div", [
            h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {},
                on: {
                  click: () => {
                    this.recordId = params.row.Id;
                    this.modalScene = true;
                  }
                }
              },
              "场景"
            )
          ]);
        }
      },//最后的操作栏
      // 字段搜索相关
      fieldData: [], //渲染的字段
      fieldDataobj: {}, //存储表示搜索的字段
      mode: '', //本表格的权限
    };
  },
  created() {
    this.getAttributeList();
    this.getDataList();
    this.sceneList();
    this.Authority();
  },
  mounted() {
    let _this = this;
    _this.heightAdaptive();
    window.onresize = () => {
      _this.heightAdaptive();
    };
  },
  methods: {
    //获取表头字段详细信息
    getAttributeList() {
      let _this = this;
      let thead = sessionStorage.getItem("config_Modify_attribute");
      if (!thead) {
        _this.$http
          .post("/cardController/getAttributeList", { table: "Modify" })
          .then(info => {
            // console.log(info);
            sessionStorage.setItem(
              "config_Modify_attribute",
              JSON.stringify(info.data)
            );
          });
      }
    },
    //获取变更表数据
    getDataList() {
      this.tLoading = true;
      if (this.searchCondition == "") {
        this.$http
          .get(
            "/cardController/getCardList?table=Modify&pageNum=" +
              this.pageNum +
              "&pageSize=" +
              this.pageSize
          )
          .then(info => {
            this.totalPage = info.data.totalPage;
            this.totalRecord = info.data.totalRecord;
            let thead = JSON.parse(sessionStorage.getItem("Modify_thead"));
            let fieldArr = JSON.parse(sessionStorage.getItem("Modify_fieldArr"));
            this.fieldData = fieldArr;
            if (!thead) {
              this.getTHeadData(info.data);
            } else {
              thead.push(this.end);
              this.wfColumns = thead;
              this.initTableColumn(this.wfColumns);
            }
            this.getTableData(info.data);
            this.pageDisabled();// 在这和下面各写一个解决了只有一页时尾页跳转不禁用的问题
          });
      } else {
        this.$http
          .post(
            "/cardController/fuzzyQuery?tableName=Modify&condition=" +
              this.searchCondition +
              "&pageNum=" +
              this.pageNum +
              "&pageSize=" +
              this.pageSize
          )
          .then(info => {
            this.totalPage = info.data.totalPage;
            this.totalRecord = info.data.totalRecord;
            //当搜索功能为空的时候, 显示为空, 而不是一直加载中, 这里不考虑从别的菜单跳过来的情况, 跳过来走的一定是上面的请求
            if (info.data.list.length == 0) {
              this.wfData = info.data.list;
              this.tLoading = false;
            } else {
              this.getTableData(info.data);
              this.pageDisabled();
            }
          });
      }
    },
    wlfieldSearch(){
      this.pageNum = 1;
      this.fieldSearch();
    },
    // 字段搜索相关
    fieldSearch(flag){
      this.tLoading = true;
      // 选择出: 处于选中状态 && 搜索内容不为空 的内容发送给后台
      let dataObj = {};
      this.fieldData.forEach((v, i) => {
        if (v.flag && v.value !== "") {
          dataObj[v.eName] = v.value;
        }
      })
      this.fieldDataobj = dataObj;
      // console.log(this.fieldData);
      // 每次搜索前将双向绑定的字段数据存入 sessionStorage, 以便从别的 mune 中跳回来的时候从 sessionStorage 中取依旧带着条件
      // sessionStorage.setItem("Modify_fieldArr", JSON.stringify(this.fieldData));
      // console.log(dataObj);
      // 如果分 dataObj 是否为空进行搜索, 为空时, 偶速锁条件全部消失, 如果不分, 那么为空时显示返回的内容不一样, 现在是按照不分写的
      let data = 'tableName=Modify' + '&condition=' + JSON.stringify(dataObj) + '&pageNum=' + this.pageNum + '&pageSize=' + this.pageSize;
      this.$http.post('/cardController/attribubtesFuzzyQuery', data).then(info => {
        // console.log(info);
        this.totalPage = info.data.totalPage;
        this.totalRecord = info.data.totalRecord;
        // 要分返回数据为空或者不为空的时候
        if (info.data.list.length != 0) {
          this.getTableData(info.data);
          this.pageDisabled();
        } else {
          // 返回的数据为空的时候, 要清除 loading 状态
          this.wfData = info.data.list;
          this.pageDisabled();
          this.tLoading = false;
        }
      })
    },
    //字段搜索，当输入框点击回车时
    fsInput(flag){
      if(flag){
        this.wlfieldSearch();
      }
    },
    // 搜索
    wlsearch(){
      this.pageNum = 1;
      this.getDataList();
    },
    //英文名转换中文名
    attributeCName(eName) {
      let _this = this;
      let cNameObj = JSON.parse(
        sessionStorage.getItem("config_Modify_attribute")
      );
      let c = cNameObj.filter(function(v, i) {
        return eName == v.attribute;
      });

      if (c.length != 0) {
        return {
          cname: c[0].cname,
          position: c[0].position
        };
      }
    },
    // 字段宽度设置
    fieldWidth(dom, len) {
      let theadWidth = document.querySelector(dom).offsetWidth + 240 - 97;
      let width = theadWidth / len > 150 ? theadWidth / len : 150;
      return width;
    },
    //将获取到的"表头"数据处理为可以渲染的数据
    getTHeadData(info) {
      if (info.list.length != 0) {
        let arrA = Object.keys(info.list[0]);
        let arrObj = [];
        let fieldArr = [];//表头字段搜索
        arrA.forEach((v, i) => {
          let oTemp = {};
          let field = {};
          let markName = this.attributeCName(v);
          let cname;
          if (markName != null) {
            cname = markName.cname;
            field.eName = v;//字段英文名
            field.cName = cname;//字段中文名
            field.value = '';//双向绑定到搜索框的值
            field.flag = false;//选中状态
            oTemp.title = cname;
            oTemp.key = v;
            oTemp.ellipsis = true;
            oTemp.position = markName.position;
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
        let newArr = arrObj;
        sessionStorage.setItem("Modify_thead", JSON.stringify(arrObj));
        sessionStorage.setItem("Modify_fieldArr", JSON.stringify(fieldArr));
        newArr.push(this.end);
        this.wfColumns = newArr;
        this.initTableColumn(this.wfColumns);
        this.fieldData = fieldArr;
        // console.log(this.fieldData);
      }
    },
    //将获取到的"表格"数据处理为可以渲染的数据
    getTableData(info) {
      if (info.list.length != 0) {
        let tData = info.list;
        tData.forEach((v, i) => {
          for (let a in v) {
            if (v[a] != null && typeof v[a] == "object") {
              v[a] = v[a].Description;
            }
          }
        });
        this.wfData = tData;
        this.tLoading = false; //加载完成时
      }
    },
    // 悬停时显示当前单元格详细信息
    initTableColumn(columnName) {
      for (let i = 0; i < columnName.length; i++) {
        if (!columnName[i].render) {
          this.$set(columnName[i], "ellipsis", true);
          this.$set(columnName[i], "render", (h, params) => {
            return h(
              "span",
              { attrs: { title: params.row[params.column.key] } },
              params.row[params.column.key]
            );
          });
        }
      }
    },
    //模态框-选择场景确认
    chooseSceneOK() {
      if (this.sceneGroup) {
        //单选框组的值   this.sceneGroup
        let sceneArr = [];
        this.sceneDateAll.forEach((value, index) => {
          if (this.sceneGroup == value.Situation) {
            sceneArr.push(value);
          }
        });
        this.$store.commit("getcurrentScene", sceneArr); //将获取的信息存入vuex 传入operate.vue
        console.log(this.$store.state.currentScene);
        //当前行的标识
        //传值并跳转页面
        this.$router.push({ path: "/workflow/operate/byself" });
      } else {
        this.$Message.error("请选择场景");
      }
    },
    chooseSceneCancel() {
      //清空单选框组的值
      this.sceneGroup = "";
      //清空当前行的标识信息
      this.recordId = "";
    },
    // 点击表格一行的时候触发
    getRecordId(res) {
      this.recordId = res.Id;
    },
    //场景列表
    sceneList() {
      let group = "net"; //获取组名，后续要从session中获取
      let sceneType = JSON.parse(sessionStorage.getItem("sceneType_" + group));
      let sceneDateAll = JSON.parse(
        sessionStorage.getItem("sceneDateAll_" + group)
      );
      if (sceneType) {
        //console.log(sceneType);
        this.sceneType = sceneType;
        this.sceneDateAll = sceneDateAll;
      } else {
        this.getSceneData();
      }
    },
    //获取场景数据
    getSceneData() {
      let group = "net";
      let condition = '{"Group":"网络组"}';
      this.$http
        .post(
          "/cardController/attribubtesFuzzyQuery?tableName=WorkflowSituation&condition=" +
            condition
        )
        .then(info => {
          sessionStorage.setItem(
            "sceneDateAll_" + group,
            JSON.stringify(info.data.list)
          );
          this.sceneDateAll = JSON.parse(
            sessionStorage.getItem("sceneDateAll_" + group)
          );
          // console.log(this.sceneDateAll);
          let newData = this.removeRepetitive(info.data.list); //数据去重
          sessionStorage.setItem("sceneType_" + group, JSON.stringify(newData));
          this.sceneType = JSON.parse(
            sessionStorage.getItem("sceneType_" + group)
          );
          // console.log(this.sceneType);
        });
    },
    //数据去重
    removeRepetitive(data) {
      for (var i = 0; i < data.length - 1; i++) {
        for (var j = i + 1; j < data.length; j++) {
          if (data[i].Situation == data[j].Situation) {
            data.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return data;
    },
    // 历史
    ctrlHistory() {
      if (this.recordId == "") {
        // this.util.unselectedLine();
        this.$Message.error("请选择一条记录！");
      } else {
        this.$store.commit('gethistoryId', this.recordId);
        this.$router.push({path: '/workflow/wfhistory'});
      }
    },
    // 关系
    ctrlRelete() {
      if (this.recordId == "") {
        this.$Message.error("请选择一条记录！");
      } else {
        //将跳转到关系页面  表名 记录id 已获取, 传递到下一个页面发送请求数据
        let data = {
          tableName: "Modify", //表名
          Id: this.recordId, //记录Id
          mode: this.mode //本表权限
        }; 
        this.$store.commit("getrelationMsg", data);//关系用的都是一个公共仓库
        this.$router.push({path: '/workflow/wfrelation'});
      }
    },
    // 下载
    ctrlDownload() {
      let search = this.searchCondition;
      let field = Object.keys(this.fieldDataobj).length;
      let url = "/cardController/downLoadExcel?table=";
      if (!search && !field) {
        // 全集搜索和字段搜索全部为空的时候
        window.open(url + "Modify", "_self");
      } else if (search) {
        // 有限下载搜索
        window.open(url + "Modify" + '&condition=' + this.searchCondition, "_self");
      } else if (field) {
        // 没有搜索的情况下再下载字段搜索
        window.open(url + "Modify" + '&condition=' + JSON.stringify(this.fieldDataobj), "_self");
      }
    },
    // 分页
    pageChange(page) {
      this.pageNum = page;
      this.pageDisabled();
      if (Object.keys(this.fieldDataobj).length != 0) {
        this.fieldSearch();
      } else {
        this.getDataList();
      }
    },
    // 首页尾页禁用于否
    pageDisabled() {
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
    //禁用跳到首页
    pageFirst() {
      this.pageNum = 1;
      this.pageDisabled();
      if (Object.keys(this.fieldDataobj).length != 0) {
        this.fieldSearch();
      } else {
        this.getDataList();
      }
    },
    //禁用跳到尾页
    pageLast() {
      this.pageNum = this.totalPage;
      this.pageDisabled();
      if (Object.keys(this.fieldDataobj).length != 0) {
        this.fieldSearch();
      } else {
        this.getDataList();
      }
    },
    // 高度自适应
    heightAdaptive() {
      let clientH = document.documentElement.clientHeight;
      this.clientW = document.documentElement.clientWidth;
      this.contentbodyH = clientH - 140 + "px";
      this.tableHeight = clientH - 215; //64:导航高；140：包括搜索, margin-top, 分页所在区域高
    },
    // 表格权限
    Authority(){
      let mode = JSON.parse(sessionStorage.getItem("Mode"));
      mode.forEach((v, i) => {
        if (v.table_name == 'Modify') {
          this.mode = v.Mode;
        }
      })
    },
  }
};
// 可能出现的问题: 
// 1. 字段搜索和全局搜索同时出现的时候, 因为接口不一样, 所以显示的内容不一样, 建议只能进行一种搜索, 进行一种搜索时, 禁用另一种搜索
</script>

<style lang="scss">
.wfList{
  .fieldSearch{
    line-height: 0;
    .ivu-select-dropdown{
      .ivu-dropdown-menu{
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
    }
  }
}
</style>

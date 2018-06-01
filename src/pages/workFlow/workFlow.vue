<template>
  <Layout>
    <Layout class="miniWindow">
      <Header ref="conBhead" :style="{padding: 0}" class="layout-header-bar">
        <Row>
          <Col span="8" offset="1">
            <h1 style="text-align: left;font-family: 'Microsoft JhengHei';">任务列表</h1>
          </Col>
        </Row>
      </Header>
      <Content :style="{height:contentBodyH}">
        <div class="contentBody" >
          <Table border
                 stripe
                 size="small"
                 :height="tableHeight"
                 :highlight-row="highlight"
                 :loading="tLoading"
                 :columns="wfColumns"
                 :data="wfData">
          </Table>
          <div style="line-height: 64px; height: 64px;" id="pagerCont">
            <Row>
              <Col :xs="{span:20,offset:4}" :sm="{span:13,offset:11}" :md="{span:10,offset:14}" :lg="{span:8,offset:16}" style="text-align: right">
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
            <Radio label="jbd">金斑蝶</Radio>
            <Radio label="zwxn">爪哇犀牛</Radio>
            <Radio label="ydhl">印度黑羚</Radio>
          </RadioGroup>
        </div>
      </Modal>
    </Layout>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      //表格数据
      wfColumns: [],
      wfData: [],
      //表格配置
      pageNum: 1,   //当前页
      pageSize: 20, //每页条数
      totalPage: 0, //总页数
      totalRecord: 0, //总条数
      tableHeight: '', //表格高度
      contentBodyH: '',// .contentBody高度
      highlight: true,
      tLoading: false,
      firstCl: true,  //首页是否禁用
      lastCl: false,  //尾页是否禁用
      //搜索  （若有搜索功能后）
      searchCondition: '', //搜索条件
      //模态框
      modalScene: false,
      sceneGroup: ''  //单选按钮组v-model值
    }
  },
  created() {
    this.getAttributeList();
    this.getDataList();
  },
  mounted () {
    let _this = this;
    _this.heightAdaptive();
    window.onresize = () => {
      _this.heightAdaptive();
    }
  },
  methods: {
    //获取变更表数据
    getDataList(){
      this.tLoading = true;
      if(this.searchCondition == ''){
        this.$http
          .get('/cardController/getCardList?table=Modify&pageNum='+
                  this.pageNum+'&pageSize='+this.pageSize)
          .then(info =>{
            this.totalPage = info.data.totalPage;
            this.totalRecord = info.data.totalRecord;
            let thead = JSON.parse(sessionStorage.getItem("Modify_thead"));
            if(!thead){
              this.getTHeadData(info.data);
            }else {
              let end = {
                title: "操作",
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
                          // console.log(params.row);
                          this.modalScene = true;
                        }
                      }
                    },"场景")
                  ]);
                }
              };
              thead.push(end);
              this.wfColumns = thead;
              this.initTableColumn(this.wfColumns);
            }
            this.getTableData(info.data);
          });
      }else {
        //获取到搜索条件this.searchCondition
      }
    },
    //获取表头字段详细信息
    getAttributeList(){
      let _this = this;
      let thead = sessionStorage.getItem(
              "config_Modify_attribute"
      );
      if (!thead) {
        _this.$http
                .post("/cardController/getAttributeList", { table: "Modify" })
                .then(function(info) {
                  sessionStorage.setItem(
                          "config_Modify_attribute",
                          JSON.stringify(info.data)
                  );
                });
      }
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
        }
      }
    },
    // 字段宽度设置
    fieldWidth(dom, len){
      let theadWidth = document.querySelector(dom).offsetWidth + 240 - 97;
      let width = theadWidth / len > 150 ? theadWidth / len : 150;
      return width;
    },
    //获取表头数据
    getTHeadData(info){
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
                            // console.log(params.row);
                            this.modalScene = true;
                          }
                        }
                      },"详情")
                    ]);
                  }
                };
      if(info.list.length != 0){
        let arrA = Object.keys(info.list[0]);
        let arrObj = [];
        arrA.forEach((v, i) => {
          let oTemp = {};
          let markName = this.attributeCName(v);
          let cname;
          if (markName != null) {
            cname = markName.cname;
            oTemp.title = cname;
            oTemp.key = v;
            oTemp.ellipsis = true;
            oTemp.position = markName.position;
            arrObj.push(oTemp);
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
        sessionStorage.setItem("Modify_thead",JSON.stringify(arrObj));
        newArr.push(end);
        this.wfColumns = newArr;
        this.initTableColumn(this.wfColumns);
      }
    },
    //获取表格数据
    getTableData(info){
      if(info.list.length != 0){
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
    //模态框-选择场景确认
    chooseSceneOK(){
      //单选框组的值   this.sceneGroup
      //当前行的标识
      //传值并跳转页面
      this.$router.push({path: 'workflow/operate/byself'});
    },
    chooseSceneCancel(){
      //清空单选框组的值
      this.sceneGroup = '';
      //清空当前行的标识信息
    },

    // 分页
    pageChange(page) {
      this.pageNum = page;
      this.pageDisabled();
      this.getDataList();
    },
    // 首页尾页禁用于否
    pageDisabled(){
      if(this.pageNum == 1){
        this.firstCl = true;
        if(this.totalPage == 1){
          this.lastCl = true;
        }else {
          this.lastCl = false;
        }
      }else {
        this.firstCl = false;
        if(this.totalPage == this.pageNum){
          this.lastCl = true;
        }else {
          this.lastCl = false;
        }
      }
    },
    //禁用跳到首页
    pageFirst() {
      this.pageNum = 1;
      this.pageDisabled();
      this.getDataList();
    },
    //禁用跳到尾页
    pageLast() {
      this.pageNum = this.totalPage;
      this.pageDisabled();
      this.getDataList();
    },
    // 高度自适应
    heightAdaptive() {
      let clientH = document.documentElement.clientHeight;
      this.contentbodyH = clientH - 140 + 'px';
      this.tableHeight = clientH - 215; //64:导航高；140：包括搜索, margin-top, 分页所在区域高
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
  }
}
</script>

<style>

</style>

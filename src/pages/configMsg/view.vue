<template>
  <!-- 内容区域 -->
  <Layout class="miniWindow" :style="{height:contentH}" style="overflow: hidden">
    <Header class="layout-header-bar">
      <Row>
        <Col span="1">
          <div>
            <Icon @click.native="collapsedSider" :class="rotateIcon" class="menuCtrl" type="navicon-round" size="24"></Icon>
          </div>
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
                        <DropdownMenu slot="list">
                          <Input size="small" v-model.trim="item.value" @on-enter="fsInput(item.flag)"></Input>
                        </DropdownMenu>
                    </Dropdown>
                  </div>
              </DropdownMenu>
          </Dropdown>
        </Col>

        <Col span="12" offset="3">
          <Input v-model="searchMsg" placeholder="Enter something...">
            <Button slot="append" type="info" icon="ios-search" @click="search">搜索</Button>
          </Input>
        </Col> 
      </Row>
    </Header>
    <Content :style="{height:contentbodyH}">
      <div class="contentBody">
        <Table
          stripe
          border
          size="small"
          @on-sort-change="sorting"
          :height="tableHeight"
          :loading='loading'
          :columns="columns"
          :data="data"
          ref="table">
        </Table>
        <div style="line-height: 64px;height: 64px; overflow: hidden">
          <Row>
            <Col :xs="{span:4,offset:1}" :sm="{span:4,offset:1}" :md="{span:13,offset:1}" :lg="{span:14,offset:1}" style="text-align: left">
              <ButtonGroup>
                <Button type="ghost" title="下载" icon="ios-download-outline" @click="exportData"></Button>
              </ButtonGroup>
            </Col>
            <Col :xs="{span:18}" :sm="{span:18}" :md="{span:10}" :lg="{span:9}" style="text-align: right">
              <Row>
                <Col span="6">
                  共 {{ totalBar }} 条
                </Col>
                <Col span="2">
                  <!--<Button type="text" icon="chevron-left" @click="pageFirst" :disabled="firstCl" title="首页"></Button>-->
                  <button title="首页" type="button" class="pageBtn" :class="{'disableBtn':firstCl}" :disabled="firstCl" @click="pageFirst">
                    <i class="zIcon firstPage"></i>
                  </button>
                </Col>
                <Col span="14" style="width: 190px;text-align: center">
                  <Page simple
                        show-total
                        :page-size="20"
                        :current="pageNum"
                        :total="totalBar"
                        @on-change="pageChange"></Page>
                </Col>
                <Col span="2">
                  <!--<Button type="text" icon="chevron-right" @click="pageLast" :disabled="lastCl" title="尾页"></Button>-->
                  <button title="尾页" type="button" class="pageBtn" :class="{'disableBtn':lastCl}" :disabled="lastCl" @click="pageLast">
                    <i class="zIcon lastPage"></i>
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Content>
  </Layout>
</template>
<script>
export default {
  data() {
    return {
      //数据
      searchMsg: "",
      //表格配置
      data: [],
      columns: [],
      loading: true,
      total:'',       //表格数据总条数
      pageNum: 1,     //当前页
      totalBar: 0,    //条数
      totalPage: null,  //总页数
      //配置高度
      contentH: "",
      contentbodyH: "", //内容区域高度
      tableHeight: "", //表格高度
      //设置
      searched: false,
      firstCl: true,//首页是否禁用
      lastCl: false,//尾页是否禁用
      // 字段排序
      sortAttribute: '', //排序的字段
      sort: '', //排序的方式
      // 字段搜索相关
      fieldData: [],//待渲染字段数据(表头所有字段)
      fielddataObj: {},//存储字段搜索的条件, 判断是否为空
    };
  },
  props: {
    // 接收变化的表名
    funcionName: {
      type: String,
      required: true
    },
    // 下面是侧边栏合起来与旋转
    collapsedSider: {
      type: Function,
      default: null
    },
    rotateIcon: {
      type: Array,
      default: null
    },
  },
  created() {
    this.gettableMsg();
    this.heightAdaptive();
  },
  mounted () {
    let _this = this;
    window.onresize = () => {
      _this.heightAdaptive();
    }
    // this.initTableColumn(this.columns);
  },
  watch: {
    searchMsg: function (val) {//对input中的数据进行监听, 有变化会触发
      this.searched = false;
    },
    'funcionName': function () {
      this.gettableMsg();
    }
  },
  methods: {
    // 获取表格数据
    gettableMsg() {
      this.loading = true;
      let data = { funcionName: this.funcionName, pageNum: this.pageNum, sortAttribute: this.sortAttribute, sort: this.sort};
      this.$http
        .post("/viewController/getViewCardList", this.$qs.stringify(data))
        .then(
          info => {
            // 成功的回调
            if (info.status == 200) {
              // console.log(info.data);
              this.dataProcess(info);
            }
          },
          info => {
            // 失败的回调
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    //表格数据的处理
    dataProcess(info) {
      this.totalBar = info.data.totalRecord;
      this.totalPage = info.data.totalPage;
      let dataArr = info.data.list;
      // console.log(dataArr);
      let end = {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 80,
        align: 'center',
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
                    this.show(params.index);
                  }
                }
              },
              "详情"
            )
          ]);
        }
      };
      let newtitleArr = [];
      let i = 0;
      // 设置每个td的宽度
      let len = 0;
      let width = 150;
      for (var k in dataArr[0]) {
        len ++;
      }
      // 设置表头每个td的宽度--77是action的宽度
      let theadWidth = document.querySelector('.contentBody .ivu-table-header').offsetWidth - 97 + 240;
      width = theadWidth / len > 150 ? theadWidth / len : 150;
      //获取表头
      let fieldArr = [];//表头字段搜索
      for (var k in dataArr[0]) {
        let newObj = {};
        let field = {};//存储字段
        field.flag = false;
        field.cName = k;
        field.value = '';
        newObj.title = k;
        newObj.key = ++i;
        newObj.width = width;
        newObj.ellipsis = true;
        newObj.sortable = true;
        newtitleArr.push(newObj);
        fieldArr.push(field);
      }
      // 如果this.fieldData.length > 0 && this.field中对象的属性与dataArr[0]的属性相同, 说明不需要更新fieldData
      let flag = true;//用来判断是否需要更新this.field的值
      if (this.fieldData.length > 0) {
        Object.keys(dataArr[0]).forEach((v, i) => {
          this.fieldData.forEach((val, j) => {
            if (i == j && val.cName != v) {
              flag = false;
            }
          })
        })
        if (!flag) {
          // 如果不一样, 说明表头有更新, 需要更新表头
          this.fieldData = fieldArr;
        }
      } else {
        this.fieldData = fieldArr;//将获取到的数据给字段搜索渲染
      }
      // this.fieldData = fieldArr;//将获取到的数据给字段搜索渲染
      newtitleArr.push(end);
      this.columns = newtitleArr;
      this.initTableColumn(this.columns);
      // 渲染表格数据
      let newcontentArr = [];
      dataArr.forEach(function(v, i) {
        let newObj = {};
        let j = 0;
        for (var key in v) {
          j++;
          newObj[j] = v[key];
        }
        newcontentArr.push(newObj);
      });
      this.data = newcontentArr;
      this.loading = false;
    },
    // 页面跳转
    pageChange(page) {
      this.pageNum = page;
      this.pageDisabled();
      if (this.searchMsg != '') {
        this.search();
      }else if (JSON.stringify(this.fielddataObj) != "{}") {
        this.fieldSearch(page);
      } else {
        this.gettableMsg();
      }
    },
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
    pageFirst(){
      this.pageNum = 1;
      this.pageDisabled();
      // this.gettableMsg();

      if (this.searchMsg != '') {
        this.search();
      }else if (JSON.stringify(this.fielddataObj) != "{}") {
        this.fieldSearch(this.pageNum);
      } else {
        this.gettableMsg();
      }
    },
    pageLast(){
      this.pageNum = this.totalPage;
      this.pageDisabled();
      // this.gettableMsg();

      if (this.searchMsg != '') {
        this.search();
      }else if (JSON.stringify(this.fielddataObj) != "{}") {
        this.fieldSearch(this.pageNum);
      } else {
        this.gettableMsg();
      }
    },
    // 搜索
    search() {
      this.searched = true;
      this.loading = true;
      let data = { functionName: this.funcionName, pageNum: this.pageNum, condition: this.searchMsg };
      this.$http
        .post("/viewController/fuzzyQuery", this.$qs.stringify(data))
        .then(
          (info) => {
            // console.log(info);
            if (info.status == 200) {
              this.dataProcess(info);
            }
          },
          (info) => {
            console.log(info);
          }
        );
    },
    // 表详情展示
    show(index) {
      // console.log(this.columns);
      let content = "";
      for (let i = 0; i < this.columns.length - 1; i++) {
        content += this.columns[i].title + `: ${this.data[index][i + 1]}<br>`;
      }
      content = content.split('null').join('');//详情为null的显示为空
      // console.log(content);
      this.$Modal.info({
        title: "详细信息",
        content: content
      });
    },
    // 删除功能
    remove(index) {
      this.data.splice(index, 1);
    },
    // 下载功能
    exportData() {
      if (this.searchMsg && this.searched) {
        var data = '?functionName='+ this.funcionName + '&condition=' + this.searchMsg;
      } else {
        var data = '?functionName='+ this.funcionName;
      }

      this.$http.get('/viewController/downLoadViewExcel' + data).then(info => {
        if (info.status == 200) {
          window.open('/viewController/downLoadViewExcel' + data, '_self');
        }
      }, info => {
        console.log(info);
      })
      // 如果使用, 要传参type
      // this.$refs.table.exportCsv({
      //   filename: "Sorting and filtering data",
      //   original: false
      // });
    },
    // 高度自适应
    heightAdaptive(){
      let clientH = document.documentElement.clientHeight;
      this.contentH =  clientH - 65 +'px';
      this.contentbodyH = clientH - 139 + 'px';
      this.tableHeight = clientH - 223; //64:导航高；140：包括搜索, margin-top, 分页所在区域高
    },
    //字段排序
    sorting(s){
      // console.log(s);
      this.sortAttribute = s.column.title;
      this.sort = s.order;
      this.gettableMsg();
    },
    // 字段搜索
    fieldSearch(page){
      // 搜索后点击分页, 页数正常显示的原因是如果传入页数, 就不在设置 this.page = 1, 而是传入的页数
      if (!page) {
        this.pageNum = 1;
      }
      this.loading = true;
      let dataObj = {};
      // 选择出: 处于选中状态 && 搜索内容不为空 的内容发送给后台
      // console.log(this.fieldData);
      this.fieldData.forEach((v, i) => {
        if (v.flag && v.value !== "") {
          dataObj[v.cName] = v.value;
        }
      })
      this.fielddataObj = dataObj;
      if (JSON.stringify(dataObj) != "{}") {
        let data = 'functionName=' + this.funcionName + '&condition=' + JSON.stringify(dataObj) + '&pageNum=' + this.pageNum + '&pageSize=20';
        // console.log(data);
        this.$http.post('/viewController/attribubtesFuzzyQuery', data).then(info => {
          // console.log(info);
          if (info.data.list.length > 0) {
            // 对得到的数据进行处理
            this.dataProcess(info);
          } else {
            this.data = [];
            this.loading = false;
          }

        })
      } else {
        this.gettableMsg();
      }
    },
    //字段搜索，当输入框点击回车时
    fsInput(flag){
      if(flag){
        this.fieldSearch();
      }
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
};
</script>
<style lang="scss">
.miniWindow {
  height: 100%;
  width: 100%;
  margin-left: -1px;
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
  .layout {
    height: 100%;
    .ivu-layout-content {
      .ivu-table-header thead th,
      .ivu-table-body tbody td {
        text-align: center;
      }
    }
    .ivu-table-fixed-right {
      .ivu-btn-primary {
        width: 45px;
        // margin-right: 10px;
      }
      .ivu-btn-error {
        width: 45px;
      }
    }
    .btnContainer {
      overflow: hidden;
      padding-top: 20px;
      padding-right: 145px;
      .ivu-input-wrapper {
        float: right;
      }
      button {
        float: right;
        margin-left: 5px;
        .ivu-icon {
          margin-top: 3px;
        }
      }
    }
    .ivu-layout {
      height: 100%;
      .btn {
        float: left;
        overflow: hidden;
        margin-left: 15px;
        .ivu-btn-primary {
          float: left;
          margin-right: 10px;
        }
      }
    }
  }
  .ivu-table-wrapper {
    width: 100%;
  }
}

// 模态框样式
.ivu-modal-confirm-body {
  padding-left: 66px;
  padding-top: 4px;
  font-size: 16px;
  line-height: 28px;
}

// 以下是原生样式
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  /*width: 69px;*/
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>

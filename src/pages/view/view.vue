<template>
  <div id="viewContainer">
    <Layout>
      <!-- 侧边栏 -->
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed">
        <Menu theme="dark"
              width="auto"
              :open-names="['1']"
              :class="menuitemClasses" accordion>
          <Submenu name="1" ref="submenu1">
            <template slot="title">
              查询配置信息列表
            </template>
            <MenuItem :name="['1-']+[index+1]"
                      style="padding-left: 25px"
                      v-for="(item, index) in sideMenuData"
                      :key="index"
                      @click.native="menuSelected(item)">
              {{item.Description}}
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <!-- 内容区域 -->
      <Layout class="miniWindow" :style="{height:contentbodyH}">
        <Header class="layout-header-bar">
          <Row>
            <Col span="1">
            <div>
              <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
            </div>
            </Col>
            <Col span="12" offset="5">
              <Input v-model="searchMsg" placeholder="Enter something...">
                <Button slot="append" type="info" icon="ios-search" @click="search">搜索</Button>
              </Input>
            </Col>
          </Row>
        </Header>
        <Content>
          <Table
            stripe
            border
            size="small"
            :height="tableHeight"
            :loading='loading'
            :columns="columns"
            :data="data"
            ref="table"></Table>
          <div style="line-height: 64px;height:auto;">
            <Row>
              <Col span="14" offset="1" style="text-align: left">
                <ButtonGroup>
                  <Button type="ghost" title="下载" icon="ios-download-outline" @click="exportData"></Button>
                </ButtonGroup>
              </Col>
              <Col :xs="{span:23,offset:1}" :sm="{span:23,offset:1}" :md="{span:8}" :lg="{span:8}" style="text-align: right">
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
                          :page-size="20"
                          :current="pageNum"
                          :total="totalBar"
                          @on-change="pageChange"></Page>
                  </Col>
                  <Col span="2">
                    <Button type="text" icon="chevron-right" @click="pageLast" :disabled="lastCl" title="尾页"></Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      asideMsg: [
        {
          title: "查询配置信息列表",
          expand: true,
          children: []
        }
      ],
      //数据
      tableName: "",  //表名
      searchMsg: "",
      sideMenuData: [],//侧栏菜单全部数据
      //表格配置
      data: [],
      columns: [],
      loading: true,
      total:'',       //表格数据总条数
      pageNum: 1,     //当前页
      totalBar: 0,    //条数
      totalPage: null,  //总页数
      //样式
      contentbodyH: '',//内容区域高度
      tableHeight: '', //表格高度区域
      //设置
      isCollapsed: false,
      searched: false,
      firstCl: true,//首页是否禁用
      lastCl: false,//尾页是否禁用
    };
  },
  created() {
    this.getasideMsg();
    this.heightAdaptive();
  },
  mounted () {
    let _this = this;
    window.onresize = () => {
      _this.heightAdaptive();
    }
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
  },
  watch: {
    searchMsg: function (val) {//对input中的数据进行监听, 有变化会触发
      this.searched = false;
    }
  },
  methods: {
    // 获取侧边栏数据
    getasideMsg() {
      let groupName = JSON.parse(sessionStorage.getItem('groupInfo')).Description;
      // console.log(JSON.parse(sessionStorage.getItem('groupInfo')));
      let data = '?groupName=' + groupName;
      this.$http.get("/viewController/getViewList" + data).then(
        info => {
          if (info.status == 200) {
            this.sideMenuData = info.data;//侧栏全部数据并赋值

            //给this.tableName赋值
            if (this.tableName == "") {
              this.tableName = this.sideMenuData[0].SourceFunction;
            }
            // console.log(this.$refs.submenu1);
            this.gettableMsg();
          }
        },
        function(info) {
          alert(info);
        }
      );
    },
    //点击侧栏获取表信息
    menuSelected(msg){
      //console.log(msg.Description);//获取中文表名
      //console.log(msg.SourceFunction);//获取英文表名
      this.searchMsg = '';
      this.tableName = msg.SourceFunction;
      this.gettableMsg();
    },
    //表格数据的处理
    dataProcess(info) {
      this.totalBar = info.data.totalRecord;
      this.totalPage = info.data.totalPage;
      let dataArr = info.data.list;
      let end = {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 60,
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
      let width = 200;
      for (var k in dataArr[0]) {
        len ++;
      }
      // 设置表头每个td的宽度--77是action的宽度
      let theadWidth = document.querySelector('.ivu-layout-content .ivu-table-header').offsetWidth - 77;
      width = theadWidth / len > 200?theadWidth / len : 200;
      //获取表头
      for (var k in dataArr[0]) {
        let newObj = {};
        newObj.title = k;
        newObj.key = ++i;
        newObj.width = width;
        newObj.ellipsis = true;
        newtitleArr.push(newObj);
      }
      newtitleArr.push(end);
      this.columns = newtitleArr;
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
    // 获取表格数据
    gettableMsg() {
      this.loading = true;
      let data = { funcionName: this.tableName, pageNum: this.pageNum };
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
    // 页面跳转
    pageChange(page) {
      this.pageNum = page;
      this.pageDisabled();
      if (this.searchMsg != '') {
        this.search();
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
      this.gettableMsg();
    },
    pageLast(){
      this.pageNum = this.totalPage;
      this.pageDisabled();
      this.gettableMsg();
    },
    // 搜索
    search() {
      // if (this.searchMsg == '') {
      //   return false;
      // }
      this.searched = true;
      this.loading = true;
      let data = { functionName: this.tableName, pageNum: this.pageNum, condition: this.searchMsg };
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
    // 侧边栏收起功能
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    // 表详情展示
    show(index) {
      console.log(this.columns);
      let content = "";
      for (let i = 0; i < this.columns.length - 1; i++) {
        content += this.columns[i].title + `: ${this.data[index][i + 1]}<br>`;
      }
      content = content.split('null').join('');//详情为null的显示为空
      console.log(content);
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
        var data = '?functionName='+ this.tableName + '&condition=' + this.searchMsg;
      } else {
        var data = '?functionName='+ this.tableName;
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
      this.contentbodyH = (clientH - 64) + 'px';
      this.tableHeight = clientH - 64 - 160;//133包括按钮区域, margin-top, 分页所在区域
    },
  }
};
</script>
<style lang="scss">
#viewContainer {
  height: 100%;
  margin-left: -1px;
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

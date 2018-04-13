<template>
    <div id="viewContainer">
      <div class="layout">
        <Layout>
            <!-- 侧边栏 -->
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed">
                <Tree :data="asideMsg" @on-select-change='getSelectedNodes' ref='tree'></Tree>
            </Sider>
            <!-- 内容区域 -->
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
                    <div class="btnContainer">
                        <Button type="primary" size="large" icon="ios-search" @click="search">Search</Button>
                        <Input v-model="searchMsg" size="large" placeholder="Enter something..." clearable style="width: 280px"></Input>
                    </div>
                </Header>
                <Content :style="{margin: '15px'}">
                    <Table stripe height="410" :loading='loading' border :columns="columns" :data="data" ref="table"></Table>
                    <div style="margin-top: 10px;margin-right: 30px;float:right;">
                        <Page :total="totalBar" @on-change="pageChange" :page-size=20 show-elevator show-total></Page>
                    </div>
                    <br>
                    <div class="btn">
                      <Button type="primary" size="small" @click="exportData"><Icon type="ios-download-outline"></Icon> 下载</Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      asideMsg: [
        {
          title: "视图信息列表",
          expand: true,
          children: []
        }
      ],
      tableName: "",
      searchMsg: "",
      isCollapsed: false,
      // 表格列
      columns: [],
      // 表格详细数据
      data: [],
      loading: true,
      total:'',//表格数据总条数
      pageNum: 1,
      totalBar: 0,
      searched: false,
    };
  },
  created() {
    this.getasideMsg();
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  watch: {
    searchMsg: function (val) {//对input中的数据进行监听, 有变化会触发
      this.searched = false;
    }
  },
  methods: {
    // 获取侧边栏数据
    getasideMsg() {
      this.$http.get("/viewController/getViewList").then(
        info => {
          if (info.status == 200) {
            // 遍历数组, 将description替换为title
            info.data.forEach(function(v, i) {
              v.title = v.Description;
              // 设置节点为选中状态
              if (i == 0) {
                v.selected = true;
              }
            });
            // console.log(info.data);
            // 给侧边栏赋值
            this.asideMsg[0].children = info.data;
            //给this.tableName赋值
            if (this.tableName == "") {
              this.tableName = this.asideMsg[0].children[0].SourceFunction;
            }
            this.gettableMsg();
          }
        },
        function(info) {
          alert(info);
        }
      );
    },
    //表格数据的处理
    dataProcess(info) {
      this.totalBar = info.data.totalRecord;
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
              // console.log(info);
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
    // 点击侧边栏每个表触发的事件
    getSelectedNodes() {
      // console.log(this.$refs.tree.getSelectedNodes());
      // 清空搜索框内容
      this.searchMsg = '';
      if (this.$refs.tree.getSelectedNodes().length != 0) {
        this.tableName = this.$refs.tree.getSelectedNodes()[0].SourceFunction;
        this.gettableMsg();
      }
    },
    // 页面跳转
    pageChange(page) {
      this.pageNum = page;
      if (this.searchMsg != '') {
        this.search();
      } else {
        this.gettableMsg();
      }
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
      let content = "";
      for (let i = 0; i < this.columns.length - 1; i++) {
        content += this.columns[i].title + `: ${this.data[index][i + 1]}<br>`;
      }
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
    }
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
    .ivu-layout-sider {
      background-color: #f5f7f9;
      overflow: scroll;
      text-align: left
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

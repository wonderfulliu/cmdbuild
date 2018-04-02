<template>
    <div id="viewContainer">
      <div class="layout">
        <Layout>
            <!-- 侧边栏 -->
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed">
                <Tree :data="asideMsg"></Tree>
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
                    <Table stripe height="410" border :columns="columns" :data="data" ref="table"></Table>
                    <div style="margin-top: 10px;margin-right: 30px;float:right;">
                        <Page :current="2" :total="50" simple></Page>
                    </div>
                    <br>
                    <div class="btn">
                      <Button type="primary" size="small" @click="exportData()"><Icon type="ios-download-outline"></Icon> 下载</Button>
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
          expand: true
          // children: [
          //   {
          //     title: "leaf 1-1-1",
          //   },
          //   {
          //     title: "leaf 1-1-2",
          //   }
          // ]
        }
      ],
      searchMsg: "",
      isCollapsed: false,
      // 表格列
      columns: [],
      // 表格详细数据
      data: []
    };
  },
  mounted() {
    this.getasideMsg();
    this.gettableMsg();
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
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
            });
            // console.log(info.data);
            this.asideMsg[0].children = info.data;
          }
          // this.asideMsg = info;
        },
        function(info) {
          console.log(info);
        }
      );
    },
    // 获取表格数据
    gettableMsg() {
      let data = { funcionName: "view_qrcode_download", pageNum: 1 };
      this.$http
        .post("/viewController/getViewCardList", this.$qs.stringify(data))
        .then(
          info => {
            // 成功的回调
            if (info.status == 200) {
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
              // 获取表头
              for (var k in dataArr[0]) {
                let newObj = {};
                newObj.title = k;
                newObj.key = ++i;
                newObj.width = 200;
                newtitleArr.push(newObj);
              }
              newtitleArr.push(end);
              this.columns = newtitleArr;
              // 渲染表格数据
              let newcontentArr = [];
              dataArr.forEach(function (v, i) {
                let newObj = {};
                let j = 0;
                for(var key in v){
                  j++;
                  newObj[j] = v[key];
                }
                newcontentArr.push(newObj);
              })
              this.data = newcontentArr;
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
    // 搜索
    search() {
      let data = this.searchMsg;
      
    },
    // 侧边栏收起功能
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    // 表详情展示
    show(index) {
      console.log(this.columns);
      let content = '';
      for(let i = 0; i < this.columns.length - 1; i ++){
        content += this.columns[i].title + `: ${this.data[index][i + 1]}<br>`
      }
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
    exportData(type) {
      this.$refs.table.exportCsv({
        filename: "Sorting and filtering data",
        original: false
      });
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
    .ivu-layout-content{
      .ivu-table-header thead th,
      .ivu-table-body tbody td {
        text-align: center;
      }
    }
    .ivu-layout-sider {
      background-color: #f5f7f9;
      overflow: scroll;
      // margin-bottom: 15px;
      // .ivu-tree{
      //   .ivu-tree ul li{
      //     text-align: left;
      //     margin-left: 10px;
      //   }
      // }
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
.ivu-modal-confirm-body{
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
  width: 69px;
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
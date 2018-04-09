<template>
    <div id="searchforContainer">
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
                    <!-- <div class="btnContainer">
                        <Button type="primary" size="large" icon="ios-search" @click="search">Search</Button>
                        <Input v-model="searchMsg" size="large" placeholder="Enter something..." clearable style="width: 280px"></Input>
                    </div> -->
                </Header>
                <Content :style="{margin: '15px'}">
                    <Table stripe height="410" :loading='loading' border :columns="columns" :data="data" ref="table"></Table>
                    <div style="margin-top: 10px;margin-right: 30px;float:right;">
                        <Page :total="totalBar" :current="pageNum" @on-change="pageChange" :page-size=20 show-elevator show-total></Page>
                    </div>
                    <br>
                    <div class="btn">
                      <Button type="primary" size="small" @click="exportData"><Icon type="ios-download-outline"></Icon> 下载</Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
      </div>
      <Modal v-model="modal" width="360">
          <p slot="header" style="color:#f60;text-align:center">
              <Icon type="information-circled"></Icon>
              <span>删除提示</span>
          </p>
          <div style="text-align:center">
              <p>该记录删除后无法恢复</p>
              <p>是否确认删除?</p>
          </div>
          <div slot="footer">
              <Button type="error" size="large" long @click="del()">删除</Button>
          </div>
      </Modal>
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
      ids: "",
      pageNum: 1,
      pageSize: 20, //每页显示的数量
      searchMsg: "",
      isCollapsed: false,
      // 表格列
      columns: [],
      // 表格详细数据
      data: [],
      loading: true,
      total: "", //表格数据总条数
      totalBar: 0,
      cnameTitle: "", // 存储表头中英文对照信息
      modal: false,
      delData: {
        delData: "",
        index: ""
      } //删除的数据
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
  methods: {
    //表格数据的处理
    dataProcess(info) {
      this.totalBar = info.data.totalRecord;
      let dataArr = info.data.list; //要处理和渲染的表格数据
      let end = {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 180,
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
            ),
            h(
              "Button",
              {
                props: {
                  type: "success",
                  size: "small"
                },
                on: {
                  click: () => {
                    // this.modal = true;
                    // this.remove(params.index);
                  }
                }
              },
              "编辑"
            ),
            h(
              "Button",
              {
                props: {
                  type: "error",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.modal = true;
                    this.remove(params.index);
                  }
                }
              },
              "删除"
            )
          ]);
        }
      };

      // 设置每个td的宽度
      let len = 0;
      let width = 200;
      for (var k in dataArr[0]) {
        len++;
      }
      // 设置表头每个td的宽度--77是action的宽度
      let theadWidth =
        document.querySelector(".ivu-layout-content .ivu-table-header")
          .offsetWidth - 77;
      width = theadWidth / len > 200 ? theadWidth / len : 200;

      // console.log(this.cnameTitle);//根据这个将英文名转换为中文名进行数据处理
      //判断返回的表格数据是否有Id
      let flag = this.hasId(dataArr[0]);
      //获取表头
      let newtitleArr = []; //存储最终要给columns的表头数据
      let j = 0;
      this.cnameTitle.forEach(function(v, i) {
        v.title = v.cname;
        v.key = ++j;
        v.width = width;
        newtitleArr.push(v);
      });
      if (flag) {
        var Id = {
          title: "Id",
          key: "Id",
          width: 200
        };
        newtitleArr.push(Id);
      }
      newtitleArr.push(end);
      this.columns = newtitleArr; //将获取到的表头字段赋值给table的columns

      // 渲染表格数据
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
    // 获取侧边栏数据
    getasideMsg() {
      //给侧边栏赋search页面传来的侧边栏数据
      // console.log(this.$store.state.searchMsg);
      this.asideMsg[0].children = this.$store.state.searchMsg;

      //如果表名为空, 即第一次进入该表, 那么将表名赋值为第一个名字, ids也是一样的
      if (this.tableName == "") {
        for (var k in this.asideMsg[0].children[0]) {
          this.tableName = k.replace(/\"/g, "");
          this.ids = this.asideMsg[0].children[0][k];
          break; //只获取第一个键与值
        }
      }
      this.getcnameTitle();
      this.gettableMsg();
    },
    // 获取表格数据
    gettableMsg() {
      this.loading = true;
      let data =
        `?table=` +
        this.tableName +
        `&ids=` +
        this.ids +
        `&pageNum=` +
        this.pageNum +
        `&pageSize=` +
        this.pageSize;
      this.$http
        .get("/luceneController/pageSearch" + data)
        .then(
          info => {
            // console.log(info);
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
    // 点击侧边栏每个表触发的事件
    getSelectedNodes() {
      // 单击侧边栏时, 分页改为1
      this.pageNum = 1;
      // console.log(this.$refs.tree.getSelectedNodes());
      for (var k in this.$refs.tree.getSelectedNodes()[0]) {
        this.tableName = k.replace(/\"/g, "");
        this.ids = this.$refs.tree.getSelectedNodes()[0][k];
        break; //只获取第一个键与值
      }
      this.getcnameTitle();
      this.gettableMsg();
    },
    // 获取不同表格的表头字段所对应的中文名结合(需要筛选)
    getcnameTitle() {
      let data = { table: this.tableName };
      this.$http.post("/cardController/getAttributeList", data).then(info => {
        if (info.status == 200) {
          this.cnameTitle = info.data;
        }
      });
    },
    // 判断返回的数据中是否包含Id
    hasId(info) {
      let flag = false;
      for (var k in info) {
        if (k == "Id") {
          flag = true;
        }
      }
      return flag;
    },
    // 页面跳转
    pageChange(page) {
      this.pageNum = page;
      this.gettableMsg();
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
    // 删除提示
    remove(index) {
      //先发送请求, 根据返回的结果判断是否删除成功
      let data = "?table=" + this.tableName + "&Id=" + this.data[index].Id;
      this.delData.delData = data;
      this.delData.index = index;
    },
    //实现删除
    del() {
      this.modal = false;
      this.$http
        .delete("/cardController/card" + this.delData.delData)
        .then(info => {
          // console.log(info);//删除的info
          if (info.status == 200) {
            if (info.data == "ok") {
              this.$Message.success({
                //提示用户删除成功
                content: "删除成功"
              });
              this.data.splice(this.delData.index, 1); //删除该元素
              // 重新获取数据
              this.gettableMsg();
            } else {
              this.$Message.error({
                content: "删除失败"
              });
            }
          }
        });
    },
    // 下载功能
    exportData() {
      let data = "?functionName=" + this.tableName;
      // window.open('/viewController/downLoadViewExcel' + data, '_self');
      this.$http.get("/viewController/downLoadViewExcel" + data).then(
        info => {
          if (info.status == 200) {
            window.open("/viewController/downLoadViewExcel" + data, "_self");
          }
        },
        info => {
          console.log(info);
        }
      );
    }
  }
};
</script>
<style lang="scss">
#searchforContainer {
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
    }
    .ivu-table-fixed-right {
      .ivu-btn-primary {
        width: 45px;
      }
      .ivu-btn-error {
        width: 45px;
      }
      .ivu-btn-success{
        width: 45px;
        margin: 0 12px;
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
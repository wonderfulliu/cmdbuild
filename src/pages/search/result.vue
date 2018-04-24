<template>
    <div id="searchforContainer">
        <Layout>
            <!-- 侧边栏 -->
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed">
              <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" :class="menuitemClasses" accordion>
                <Submenu name="1">
                  <template slot="title" style="text-align: left">
                    查询配置信息列表
                  </template>
                  <div class="treeContent">
                    <!--树状菜单-->
                    <Tree :data="asideMsg" @on-select-change='getSelectedNodes' ref='tree'></Tree>
                  </div>
                </Submenu>
              </Menu>
            </Sider>
            <!-- 内容区域 -->
            <Layout :style="{height:contentbodyH}">
                <Header class="layout-header-bar">
                  <Row>
                    <Col span="2">
                      <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
                    </Col>
                    <Col span="4" offset="18">
                      <ButtonGroup>
                        <Button type="ghost" title="新增" icon="ios-plus-empty" @click="add" :disabled='isdisable'></Button>
                        <Button type="ghost" title="下载" icon="ios-download-outline" @click="exportData"></Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </Header>
                <Content>
                    <Table border
                           stripe
                           ref="table"
                           size="small"
                           :height="tableHeight"
                           :loading='loading'
                           :columns="columns"
                           :data="data">
                    </Table>
                    <div style="margin-top: 10px;margin-right: 30px;float:right;">
                        <Page :total="totalBar" :current="pageNum" @on-change="pageChange" :page-size=20 show-elevator show-total></Page>
                    </div>
                </Content>
            </Layout>
        </Layout>
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
      lookupMsg: "",
      loading: true,
      total: "", //表格数据总条数
      totalBar: 0,
      cnameTitle: "", // 存储表头中英文对照信息
      modal: false,
      delData: {
        delData: "",
        index: ""
      }, //删除的数据
      relationTable: '',
      Mode: '',//权限
      Authority: '',//权限表
      isdisable: '',//是否禁用
      contentbodyH: '',//内容区域高度
      tableHeight: '',//表格高度
    };
  },
  created() {
    this.getAuthority();
    this.getasideMsg();
    this.heightAdaptive();
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
      let end = {//表格最后要添加的操作
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
                style: {
                  marginRight: "10px"
                },
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
                  size: "small",
                  disabled: this.isdisable
                },
                style: {
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.edit(params);
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
                  size: "small",
                  disabled: this.isdisable
                },
                style: {
                  marginRight: "10px"
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
      
      let len = this.cnameTitle.length;
      let theadWidth = document.querySelector(".ivu-table-wrapper .ivu-table-header").offsetWidth - 197;
      let width = theadWidth / len > 200 ? theadWidth / len : 200;
      this.cnameTitle.forEach((v, i) => {
        v.width = width;
      })
      //判断返回的表格数据是否有Id
      // let flag = this.hasId(dataArr[0]);
      //获取表头
      let newtitleArr = []; //存储最终要给columns的表头数据
      let j = 0;
      // console.log(this.cnameTitle);
      this.cnameTitle.forEach(function(v, i) {
        v.title = v.cname;
        v.key = ++j;
        v.width = width;
        v.ellipsis = true;
        newtitleArr.push(v);
      });
      // if (flag) {
      //   var Id = {
      //     title: "Id",
      //     key: "Id",
      //     width: 200
      //   };
      //   newtitleArr.push(Id);
      // }
      newtitleArr.sort(function (a, b) {
        return Number(a.position) - Number(b.position);
      })
      newtitleArr.push(end);
      // console.log(newtitleArr);
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
      this.asideMsg[0].children = this.$store.state.searchMsg?this.$store.state.searchMsg:JSON.parse(sessionStorage.getItem('searchMsg'));
      // 应该是进入该表后遍历所有侧边栏数据, 显示selected的那一项
      this.asideMsg[0].children.forEach((v, i) => {
        if (v.selected == true) {
          for(let k in v) {
            if (k != 'nodeKey' && k != 'selected' && k != 'title') {
              this.tableName = k.replace(/\"/g, "");
              this.ids = v[k];
            }
          }
          // 刚进来的时候也要获取一下权限, 因为没有点击侧边栏
          this.Authority.forEach((v, i) => {
            if (v.table_name == this.tableName) {
              this.Mode = v.Mode;
            }
          })
          this.isdisable = this.Mode == 'r' ? true : false;
        }
      })

      this.getcnameTitle();
      this.gettableMsg();
      this.getSelect(); //防止刚进来的时候没有lookup数据
      this.getrelationTable();
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
    getSelectedNodes(value) {
      // 单击侧边栏时, 分页改为1
      this.pageNum = 1;
      // 更新完表民后再获取权限
      for (var k in this.$refs.tree.getSelectedNodes()[0]) {
        this.tableName = k.replace(/\"/g, "");
        this.ids = this.$refs.tree.getSelectedNodes()[0][k];
        break; //只获取第一个键与值
      }

      // 获取表格权限
      this.Authority.forEach((v, i) => {
        if (v.table_name == this.tableName) {
          this.Mode = v.Mode;
        }
      })
      // console.log(this.Mode);
      // 判断是否禁用
      this.isdisable = this.Mode == 'r' ? true : false;

      this.getcnameTitle();
      this.gettableMsg();
      this.getSelect();
      this.getrelationTable();
    },
    // 获取不同表格的表头字段所对应的中文名结合(需要筛选)
    getcnameTitle() {
      let data = { table: this.tableName };
      this.$http.post("/cardController/getAttributeList", data).then(info => {
        if (info.status == 200) {
          // console.log(info.data);
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
      content = content.split('null').join('');//null为空
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
    // 获取lookup数据
    getSelect() {
      let data = "?table=" + this.tableName;
      this.$http
        .post("/relationController/getLookuplistByTable" + data)
        .then(info => {
          if (info.status == 200) {
            this.lookupMsg = info.data;
          }
        });
    },

    // 下载功能
    exportData() {
      let data = "?ids=" + this.ids + "&table=" + this.tableName;
      console.log(data);
      this.$http.get("/cardController/downLoadExcelByIds" + data).then(
        info => {
          if (info.status == 200) {
            window.open("/cardController/downLoadExcelByIds" + data, "_self");
          }
        },
        info => {
          console.log(info);
        }
      );
    },

    // 编辑功能
    edit(params) {
      // 获取到表头的数据(主要获取改数据的格式), 并处理action
      let titleMsg = this.columns.slice(0, this.columns.length - 1);
      let editcontentMsg = this.data[params.index];
      let thisjiluId;
      // 将editcontentMsg的内容整合到titleMsg中
      for (var k in editcontentMsg) {
        if (k != 'Id') {
          titleMsg[k - 1].content = editcontentMsg[k];
        } else if (k == "Id") {
          titleMsg[titleMsg.length - 1].content = editcontentMsg[k];
          thisjiluId = editcontentMsg[k];
        }
      }
      // 添加lookup数据
      titleMsg.forEach((v, i) => {
        if (v.type == "lookup") {
          for (let k in this.lookupMsg) {
            if (k == v.attribute) {
              v.lookupMsg = this.lookupMsg[k];
              v.lookupMsg.forEach((val, index) => {
                if (val.Description && val.Description == v.content) {
                  v.content = val.Id;
                }
              });
            }
          }
        }
        if (v.type == "reference") {
          this.relationTable.forEach((val, index) => {
            if (v.lr == val.domainname) {
              v.relationTable = v.table == val.domainclass2 ? val.domainclass1 : val.domainclass2;
            }
          })
        }
      });

      let data = {
        tableName: this.tableName,
        titleMsg: titleMsg,
        thisjiluId: thisjiluId
      }
      this.$store.commit('getaddMsg', data);//将整合好的数据推至公共仓库
      this.$router.push({ path: "/edit" });//跳转至新增页面
    },

    // 点击添加的时候调用的函数
    add() {
      // 添加时表头数据处理:
        // 1. 处理掉表头最后的action
        // 2. 关系表名放置到对应的reference中
      // 处理掉表头最后的action
      let titleMsg = this.columns.slice(0, this.columns.length - 1);
      // 这一步是将关系表名放置到对应的reference数据中, lookup数据放置到对应的lookup数据中
      titleMsg.forEach((v, i) => {
        v.content = '';
        if (v.type == "reference") {
          this.relationTable.forEach(function (val, index) {
            if (v.lr == val.domainname) {
              v.relationTable = v.table == val.domainclass2 ? val.domainclass1 : val.domainclass2;
            }
          })
        }
        if (v.type == "lookup") {
          for(let k in this.lookupMsg){
            if (k == v.attribute) {
              v.lookupMsg = this.lookupMsg[k];
              v.lookupMsg.forEach((val, index) => {
                if (val.Description && val.Description == v.content) {
                  v.content = val.Id;
                }
              });
            }
          }
        }
      })
      let data = {
        tableName: this.tableName,
        titleMsg: titleMsg,
      }
      console.log(data);
      this.$store.commit('getaddMsg', data);//将整合好的数据推至公共仓库
      this.$router.push({path: '/add'});//跳转至新增页面
    },

    // 一进入该页面, 就获取关系表的表名
    getrelationTable() {
      let data = "?table=" + this.tableName;
      this.$http.get("/relationController/getDomainList" + data).then(info => {
        if (info.status == 200) {
          this.relationTable = info.data;
        }
      });
    },
    // 获取权限
    getAuthority() {
      this.Authority = this.$store.state.Mode?this.$store.state.Mode:JSON.parse(sessionStorage.getItem('Mode'));
    },
    // 高度自适应
    heightAdaptive(){
      let clientH = document.documentElement.clientHeight;
      this.contentbodyH = (clientH - 64) + 'px';
      this.tableHeight = clientH - 64 - 145;//133包括按钮区域, margin-top, 分页所在区域
    },
  }
};

</script>


<style lang="scss">
#searchforContainer {
  height: 100%;
  margin-left: -1px;
  .layout {
    height: 100%;
    .ivu-layout-sider {
      background-color: #f5f7f9;
      overflow: scroll;
    }

    .btnContainer {
      overflow: hidden;
      padding-top: 20px;
      padding-right: 145px;
      .ivu-input-wrapper {
        float: right;
      }
    }
  }
  .ivu-table-wrapper {
    width: 100%;
  }
}

/* 模态框样式*/
.ivu-modal-confirm-body {
  padding-left: 66px;
  padding-top: 4px;
  font-size: 16px;
  line-height: 28px;
}

</style>

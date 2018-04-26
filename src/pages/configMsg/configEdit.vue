<template>
  <Layout>
    <Layout>
      <div id="editTableContainer">
        <Header class="layout-header-bar">
          <Row>
            <Col span="5" offset="1">
              <h3 style="text-align: left">请选择关系: </h3>
            </Col>
            <Col span="11">
                <Input v-model="searchMsg" @on-click="search" @on-enter="search" clearable icon="search" placeholder="Enter something..."></Input>
            </Col>
            <Col span="7">
              <div class="floatRight">
                <Button type="primary" style="margin-right: 8px" @click="cancel">取消</Button>
                <Button type="success" @click="confirm">确认</Button>
              </div>
            </Col>
          </Row>
        </Header>
        <Content class="contentTable">
          <div class="contentBody">
            <Table stripe
                   border
                   highlight-row
                   height="450"
                   :data="data"
                   :loading='loading'
                   :columns="columns"
                   @on-row-click="selectRow">
            </Table>
            <div class="pageContainer clearfix floatRight">
              <Button type="ghost" class="floatLeft" @click="pageFirst">首页</Button>
              <Page class="floatLeft"
                    show-elevator
                    show-total
                    :page-size='20'
                    :current="pageNum"
                    :total="totalRecord"
                    @on-change="pageChange"></Page>
              <Button type="ghost" class="floatLeft" @click="pageLast">尾页</Button>
            </div>
          </div>
        </Content>
  </div>
    </Layout>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      columns: [],//表格数据渲染
      data: [],
      totalRecord: 0,//分页
      pageNum: 1,
      totalPage: null,
      relationTable: "",//上一页传来的信息
      reftitleMsg: '',
      reftableMsg: '',
      loading: false,//表格loading
      searchMsg: "",// 搜索
      rowMsg: '',//存储该行的信息
    };
  },
  created() {
    this.getrefMsg();
  },
  mounted () {
    this.dataProcess(this.reftitleMsg, this.reftableMsg);
  },
  methods: {
    // 获取中文表头和表格详细数据
    getrefMsg() {
      let refMsg = this.$store.state.refMsg;
      this.relationTable = refMsg.relationTable;
      this.reftitleMsg = refMsg.reftitleMsg;
      this.reftableMsg = refMsg.reftableMsg;
    },
    //刚进入该页面时表格数据的处理
    dataProcess(titleMsg, tableMsg) {
      this.totalRecord = tableMsg.totalRecord;
      this.totalPage = tableMsg.totalPage;
      // 表头字段排序
      titleMsg.sort(function(a, b) {
        return Number(a.position) - Number(b.position);
      });
      
      let dataArr = tableMsg.list; //要处理和渲染的表格数据
      // 设置开头多选
      let start = {
        type: "index",
        width: 60,
        align: "center"
      };
      // 设置表格宽度
      let len = titleMsg.length;
      let theadWidth = document.querySelector(".ivu-table-wrapper .ivu-table-header").offsetWidth - 17 - 60;
      let width = theadWidth / len > 200 ? theadWidth / len : 200;
      //判断返回的表格数据是否有Id
      let flag = this.hasId(dataArr[0]);
      //获取表头
      let newtitleArr = []; //存储最终要给columns的表头数据
      newtitleArr.push(start);
      let j = 0;
      titleMsg.forEach(function(v, i) {
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
    // --------------------------------------
    // 点击分页切换分页
    pageChange(page) {
      this.pageNum = page;
      this.loading = true;
      this.getreferenceData();
    },
    pageFirst() {
      this.pageNum = 1;
      this.loading = true;
      this.getreferenceData();
    },
    pageLast() {
      this.pageNum = this.totalPage;
      this.loading = true;
      this.getreferenceData();
    },
    // 获取模态框中的reference数据
    getreferenceData() {
      let data = "?table=" + this.relationTable + "&pageNum=" + this.pageNum;
      this.$http.get("/cardController/getCardList" + data).then(info => {
        if (info.status == 200) {
          this.contentdataProcess(info);
        }
      });
    },
    // 搜索功能
    search() {
      // console.log(this.relationTable);
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
    // 选择行: 把该行的信息获取到
    selectRow(selection, index){
      // 两个参数分别代表已选择的项和选择项的index
      this.rowMsg = selection;
    },
    // 确认按钮
    confirm(){
      //获取到该行的信息, 取出description与id
      let rowData = this.rowMsg;
      let title = this.columns;
      let chooseMsg = {
        description: '',
        Id: '',
        relationTable: this.relationTable
      }
      // 取出description
      title.forEach(function (v, i) {
        if (v.attribute == "Description") {
          for(let k in rowData) {
            chooseMsg.description = rowData[v.key];
            if (k = 'Id') {//取出Id
              chooseMsg.Id = rowData[k];
            }
          }
        }
      })
      this.$store.commit('getchooseMsg', chooseMsg);//将获取到的数据返回出去
      this.$router.go(-1);
    },
    // 取消按钮
    cancel(){
      // this.$store.commit('getchooseMsg', '');
      this.$router.go(-1);
    },

  }
};
</script>

<style lang="scss">
#editTableContainer {
  header {
    height: 30px;
    font-size: 20px;
    text-align: left;
    margin: 10px 30px;
    h3{
      float: left;
    }
    .btnContainer{
      float: right;
    }
  }
  .content {
    .ivu-table-header{
      .ivu-table-column-center{
        .ivu-checkbox-wrapper{
          margin-right: 0px;
        }
      }
    }
    .ivu-table-tbody {
      .ivu-table-column-center {
        .ivu-table-cell {
          .ivu-checkbox-wrapper {
            margin-right: 0px;
          }
        }
      }
    }
    .ivu-table {
      th,
      td {
        text-align: center;
      }
    }
  }
  .footer {
    overflow: hidden;
    .search {
      float: left;
      margin-left: 50px;
      margin-top: 15px;
    }
    .page {
      float: right;
      margin-right: 30px;
      margin-top: 15px;
    }
  }
}
</style>

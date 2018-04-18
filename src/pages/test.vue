<template>
  <div id="editTableContainer">
    <header>
      <h3>请选择关系: </h3>
      <div class="btnContainer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="confirm">确认</Button>
      </div>
    </header>
    <div class="content">
      <Table highlight-row :loading='loading' @on-row-click="selectRow" stripe height="450" border  :columns="columns" :data="data"></Table>
    </div>
    <div class="footer">
      <div class="search">
        <Input v-model="searchMsg" @on-click="search" @on-enter="search" clearable icon="search" placeholder="Enter something..." style="width: 300px"></Input>
      </div>
      <div class="page">
        <Page @on-change="pageChange" :page-size='20' :total="totalRecord" show-elevator show-total></Page>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [],
      data: [],
      totalRecord: 0,
      pageNum: 1,
      relationTable: "",
      loading: false,
      searchMsg: "", // 搜索
      rowMsg: "", //存储该行的信息
      chooseMsg: "",
      a: {
        domainname: "AppServiceTime_to_app",
        records: [
          {
            domainname: "AppServiceTime_to_app",
            domainclass2: '"Application"',
            idobj2: 31815733,
            domainclass1: '"Applicationservicetime"',
            idobj1: 28441950
          }
        ]
      },
      b: {
        domainname: "AppServiceTime_to_app",
        records: [
          {
            domainname: "AppServiceTime_to_app",
            domainclass2: '"Application"',
            idobj2: 31815634,
            domainclass1: '"Applicationservicetime"',
            idobj1: 28441950
          }
        ]
      }
    };
  },
  created() {
    this.getTabledata();
  },
  methods: {
    // 点击分页切换分页
    pageChange(page) {
      this.pageNum = page;
      this.loading = true;
      this.getreferenceData();
    },
    // 直接获取处理好的表格数据: 表头, 第一页内容, 总条数, 关系表名
    getTabledata() {
      let tableData = this.$store.state.editTable;
      this.data = tableData.data;
      this.columns = tableData.columns;
      this.totalRecord = tableData.totalRecord;
      this.relationTable = tableData.relationTable;
    },
    // 获取模态框中的reference数据
    getreferenceData() {
      let data = "?table=" + this.relationTable + "&pageNum=" + this.pageNum;
      this.$http.get("/cardController/getCardList" + data).then(info => {
        if (info.status == 200) {
          this.dataProcess(info);
        }
      });
    },
    //表格数据的处理
    dataProcess(info) {
      this.totalBar = info.data.totalRecord;
      let dataArr = info.data.list; //要处理和渲染的表格数据
      // 设置开头多选
      let start = {
        type: "selection",
        width: 50,
        align: "center"
      };

      // 设置每个td的宽度(写在此处)
      let width = 200;
      //判断返回的表格数据是否有Id
      // let flag = this.hasId(dataArr[0]);

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
    // 搜索功能
    search() {
      this.loading = true;
      let data = {
        functionName: this.relationTable,
        pageNum: this.pageNum,
        condition: this.searchMsg
      };
      this.$http
        .post("/viewController/fuzzyQuery", this.$qs.stringify(data))
        .then(
          info => {
            if (info.status == 200) {
              this.dataProcess(info);
            }
          },
          info => {
            console.log(info);
          }
        );
    },
    // 选择行: 把该行的信息获取到
    selectRow(selection, index) {
      // 两个参数分别代表已选择的项和选择项的index
      this.rowMsg = selection;
    },
    // 确认按钮
    confirm() {
      //获取到该行的信息, 取出description与id
      let rowData = this.rowMsg;
      let title = this.columns;
      let chooseMsg = {
        description: "",
        Id: ""
      };
      this.chooseMsg = chooseMsg;
      // 取出description
      title.forEach(function(v, i) {
        if (v.attribute == "Description") {
          for (let k in rowData) {
            chooseMsg.description = rowData[v.key];
            if ((k = "Id")) {
              //取出Id
              chooseMsg.Id = rowData[k];
            }
          }
        }
      });
      this.$store.commit("getchooseMsg", chooseMsg); //将获取到的数据返回出去
      this.$router.push({ path: "/edit" });
    },
    // 取消按钮
    cancel() {
      this.$store.commit("getchooseMsg", "");
      this.$router.push({ path: "/edit" });
    }
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
    h3 {
      float: left;
    }
    .btnContainer {
      float: right;
    }
  }
  .content {
    .ivu-table-header {
      .ivu-table-column-center {
        .ivu-checkbox-wrapper {
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
// =================================bu   neng   xiu   gai=================================
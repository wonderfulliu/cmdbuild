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
      columns: [],//表格数据渲染
      data: [],
      totalRecord: 0,//分页
      pageNum: 1,
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
  methods: {
    // 获取中文表头和表格详细数据
    getrefMsg() {
      let refMsg = this.$store.state.refMsg;
      this.relationTable = refMsg.relationTable;
      this.reftitleMsg = refMsg.reftitleMsg;
      this.reftableMsg = refMsg.reftableMsg;
      this.dataProcess(this.reftitleMsg, this.reftableMsg);
    },
    //刚进入该页面时表格数据的处理
    dataProcess(titleMsg, tableMsg) {
      this.totalRecord = tableMsg.totalRecord;
      let dataArr = tableMsg.list; //要处理和渲染的表格数据
      // 设置开头多选
      let start = {
        type: "index",
        width: 60,
        align: "center"
      };

      // 设置每个td的宽度(写在此处)
      // let len = 0;
      let width = 200;
      // for (var k in dataArr[0]) {
      //   len ++;
      // }
      // 设置表头每个td的宽度--77是action的宽度
      // console.log(document.querySelector('#editTableContainer'));
      // let theadWidth = document.querySelector('#editTableContainer .content .ivu-table-header').offsetWidth - 60;
      // console.log(theadWidth);
      // width = theadWidth / len > 200?theadWidth / len : 200;

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

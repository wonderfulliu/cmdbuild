<template>
  <div id="relationContainer">
    <div class="head">
      <h1>查看: </h1>
      <div class="now">
        <Select @on-change="selectN" v-model="selectNow" style="width:250px" size="large" clearable filterable>
            <Option v-for="(item, index) in now" :value="item.value" :key="index">{{ item.label }} </Option>
        </Select>
      </div>
      <h1>新增: </h1>
      <div class="future">
        <Select @on-change="selectF" label-in-value v-model="selectFuture" style="width:250px" size="large" clearable filterable>
            <Option v-for="(item, index) in future" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="back" @click="back">
        <Icon type="reply"></Icon>
      </div>
    </div>
    <div class="body">
      <Table height="400" :columns="columns" :data="data" no-data-text="请选择要查看的数据"></Table>
    </div>
    <div class="foot">
      <div class="search">

      </div>
      <div class="page">
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CEtableMsg: "", //中英文对照表
      relationMsg: "", //待渲染的关系数据
      domainListMsg: "", //待渲染的中间表数据
      tableId: "",//表的Id
      // 下拉框数据
      selectNow: "",
      selectFuture: "",
      domainname: '',//selectF的某个中间表名
      domainnamen: '', //selectN的某个中间表
      now: [],
      future: [],
      // 表格数据
      columns: [
        {
          title: "Description",
          key: "Description"
        },
        {
          title: "BeginDate",
          key: "BeginDate"
        },
        {
          title: "操作",
          key: "operating",
          render: (h, params) => {
            return h("div", [
              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "text",
              //       size: "small"
              //     },
              //     style: {

              //     },
              //     on: {
              //       click: () => {
              //           this.show(params.index)
              //       }
              //     }
              //   },
              //   "详情"
              // ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {},
                  on: {
                    click: () => {
                        this.del(params, params.index)
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: []
    };
  },
  created() {
    this.getMsg();
    this.getDomainList();
  },
  methods: {
    // 获取到公共仓库的数据并且处理
    getMsg() {
      this.CEtableMsg = this.$store.state.tableMsg; //获取中英文对照表名
      this.relationMsg = this.$store.state.relationMsg; //获取到待渲染的关系数据
      // console.log(this.relationMsg);
      this.tableId = this.relationMsg.Id;
      // 获取到数据后就是渲染数据等操作
      this.getTabledata();
    },
    // 一进入页面, 就请求关系中间表的表数据
    getDomainList() {
      let data = "?table=" + this.relationMsg.tableName;
      this.$http.get("/relationController/getDomainList" + data).then(info => {
        if (info.status == 200 && Object.keys(info.data).length != 0) {
          // 找到关系表名, 找到n:1关系, 找到中文名, 并且拼在英文表名后面
          let relationArr = [];
          // console.log(info.data);
          info.data.forEach((v, i) => {
            let obj = {};
            let NandOne = v.domaincardinality.split(":");
            if (this.relationMsg.tableName == v.domainclass2) {
              obj.relationTable = v.domainclass1;
              obj.crelationTable = this.EtoC(this.CEtableMsg, v.domainclass1, v.domainname);
              obj.domainname = v.domainname;
              obj.NorOne = NandOne[0];
            } else {
              obj.relationTable = v.domainclass2;
              obj.crelationTable = this.EtoC(this.CEtableMsg, v.domainclass2, v.domainname);
              obj.domainname = v.domainname;
              obj.NorOne = NandOne[1];
            }
            relationArr.push(obj);
          });
          // console.log(relationArr);
          this.domainListMsg = relationArr;
          this.$store.commit('getdomainlistMsg', info.data);
          this.getfutureSelectdata();//没有放在getMsg里面时因为获取不到this.domainListMsg的数据
          this.getnowSelectdata();
        } else if (info.status == 200 && Object.keys(info.data).length == 0) {
          this.$Message.error({
            content: "没有对应的关系表"
          });
        }
      });
    },
    // 获取now select框数据
    getnowSelectdata(){
      let data = this.relationMsg
      // console.log(data);
      // console.log(this.domainListMsg);
      let now = [];
      for (let k in data.relationMsg) {
        let obj = {};
        this.domainListMsg.forEach((v, i) => {
          if (v.domainname == k.split('Map_')[1]) {
            obj.value = k.split('Map_')[1];
            obj.label = v.crelationTable;
          }
        })
        now.push(obj);
      }
      this.now = now;
    },
    // 获取future select数据
    getfutureSelectdata(){
      let data = this.domainListMsg;
      // console.log(data);
      let future = [];
      data.forEach((v, i) => {
        let obj = {};
        obj.value = v.relationTable + '_' + v.NorOne;
        obj.label = v.crelationTable;
        future.push(obj);
      })
      this.future = future;
    },
    // 获取查看表格数据
    getTabledata(tableName) {
      let data = this.relationMsg; //有关系的表
      // console.log(data);
      let arr = [];
      for (let k in data.relationMsg) {
        if (k.split('Map_')[1] == tableName) {
          this.domainnamen = k.split('Map_')[1];//删除关系时会用到
          data.relationMsg[k].forEach(function(v, i) {
            let obj = {};
            obj.Description = v.Description;
            obj.BeginDate = v.BeginDate;
            arr.push(obj);
          });
        }
      }
      this.data = arr;
    },
    // 查看下拉框变化时触发
    selectN(value){
      console.log(value);
      this.getTabledata(value); 
    },
    // 添加数据下拉框变化的时候
    selectF(value){
      let relationTable = value.value.split('_')[0];
      let NorOne = value.value.split('_')[1];
      // console.log(this.domainListMsg);
      this.domainListMsg.forEach((v, i) => {
        if (relationTable == v.relationTable) {
          this.domainname = v.domainname;
        }
      })
      this.getrefctMsg(relationTable, NorOne);
      this.getrefMsg(relationTable, NorOne);
    },

    //点击选中的关系表, 请求数据, 并且根据N:1关系判断表格是单选还是多选
    // 获取reference表头中文名数据
    getrefctMsg(relationTable, num) {
      let data = { table: relationTable };
      this.$http.post("/cardController/getAttributeList", data).then(info => {
        if (info.status == 200) {
          this.reftitleMsg = info.data;
          if (this.reftableMsg) {
            let refMsg = {
              reftitleMsg: this.reftitleMsg,
              reftableMsg: this.reftableMsg,
              relationTable: relationTable,
              NorOne: num,
              tableId: this.tableId
            };
            this.$store.commit("getrefMsg", refMsg); //不论哪个函数先执行, 都会只执行一次
            this.$router.push({ path: "/config/relationTable" }); //两个数据都拿到之后再推送
          }
        }
      });
    },
    // 获取reference表格数据
    getrefMsg(relationTable, num) {
      let data = "?table=" + relationTable + '&domain=' + this.domainname;
      this.$http.get("/cardController/getRelationCardList" + data).then(info => {
        if (info.status == 200) {
          this.reftableMsg = info.data;
          if (this.reftitleMsg) {
            let refMsg = {
              reftitleMsg: this.reftitleMsg,
              reftableMsg: this.reftableMsg,
              relationTable: relationTable,
              NorOne: num,
              tableId: this.tableId
            };
            this.$store.commit("getrefMsg", refMsg); //不论哪个函数先执行, 都只会执行一次
            this.$router.push({ path: "/config/relationTable" }); //两个数据都拿到之后再推送
          }
        }
      });
    },

    // 删除
    del(value, index){
      // console.log(value);
      let thisId;
      let Description = value.row.Description;
      let data = this.relationMsg;
      // console.log(data);
      for(var k in data.relationMsg){
        if (this.domainnamen == k.split('Map_')[1]) {
          data.relationMsg[k].forEach((v, i) => {
            if (v.Description == Description) {
              thisId = v.Id;
            }
          })
        }
      }
      let delData = {domainname: this.domainnamen, idobj1: this.tableId, idobj2: thisId};
      console.log(JSON.stringify(delData));
      this.$http.delete('/relationController/relation', {data: delData}).then(info => {
        if (info.status == 200) {
          if (info.data == 'ok') {
            this.$Message.success({
              content: '删除成功'
            })
          } else if (info.data == "failed") {
            this.$Message.error({
              content: '删除失败'
            })
          }
        }
      })
    },
    // 拼接中英文名字
    EtoC(CEtable, ename, domainname) {
      for (let k in CEtable) {
        if (ename == k) {
          ename = domainname + `(` + CEtable[k] + `)`;
        }
      }
      return ename;
    },
    // 返回按钮
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
#relationContainer {
  width: 100%;
  .head {
    overflow: hidden;
    margin-bottom: 15px;
    h1 {
      float: left;
      margin-top: 20px;
      margin-left: 30px;
    }
    .now,
    .future {
      float: left;
      margin-top: 20px;
      margin-left: 30px;
    }
    .back {
      float: right;
      height: 100%;
      line-height: 100%;
      margin-top: 20px;
      margin-right: 24px;
      font-size: 34px;
      cursor: pointer;
    }
  }
  .body {
  }
  .foot {
  }
}
</style>

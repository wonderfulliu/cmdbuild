<template>
  <div id="relationContainer">
    <div class="head">
      <h1>查看与选择: </h1>
      <div class="select">
        <Select v-model="selectMsg" style="width:350px" size="large" clearable filterable>
            <OptionGroup label="请选择要查看的信息">
                <Option v-for="item in view" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </OptionGroup>
            <OptionGroup label="请选择要新增的数据">
                <Option v-for="item in add" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </OptionGroup>
        </Select>
      </div>
      <div class="back" @click="back">
        <Icon type="reply"></Icon>
      </div>
    </div>
    <div class="body">
      <Table height="400" :columns="columns" :data="data"></Table>
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
      // 下拉框数据
      selectMsg: "",
      view: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        }
      ],
      add: [
        {
          value: "New York2",
          label: "New York2"
        },
        {
          value: "London2",
          label: "London2"
        }
      ],
      // 表格数据
      columns: [],
      data: [],
    };
  },
  created() {
    this.getMsg();
    this.getDomainList();
  },
  methods: {
    // 获取到上公共仓库的数据
    getMsg() {
      this.CEtableMsg = this.$store.state.tableMsg; //获取中英文对照表名
      this.relationMsg = this.$store.state.relationMsg; //获取到待渲染的关系数据
      console.log(this.relationMsg);
      // 获取到数据后就是渲染数据等操作
      // ...
    },
    // 一进入页面, 就请求关系中间表的表数据
    getDomainList() {
      let data = "?table=" + this.relationMsg.tableName;
      this.$http.get("/relationController/getDomainList" + data).then(info => {
        if (info.status == 200 && Object.keys(info.data).length != 0) {
          // 找到关系表名, 找到n:1关系, 找到中文名, 并且拼在英文表名后面
          let relationArr = [];
          info.data.forEach((v, i) => {
            let obj = {};
            let NandOne = v.domaincardinality.split(":");
            if (this.relationMsg.tableName == v.domainclass2) {
              obj.relationTable = v.domainclass1;
              obj.crelationTable = this.EtoC(this.CEtableMsg, v.domainclass1);
              obj.NorOne = NandOne[0];
            } else {
              obj.relationTable = v.domainclass2;
              obj.crelationTable = this.EtoC(this.CEtableMsg, v.domainclass2);
              obj.NorOne = NandOne[1];
            }
            relationArr.push(obj);
          });
          console.log(relationArr);
          this.domainListMsg = relationArr;
        } else if (info.status == 200 && Object.keys(info.data).length == 0) {
          this.$Message.error({
            content: "没有对应的关系表"
          });
        }
      });
    },
    // 拼接中英文名字
    EtoC(CEtable, ename) {
      for (let k in CEtable) {
        if (ename == k) {
          ename = ename + `(` + CEtable[k] + `)`;
        }
      }
      return ename;
    },
    //点击选中的关系表, 请求数据, 并且根据N:1关系判断表格是单选还是多选
    // 获取reference表头中文名数据
    getrefctMsg(relationTable) {
      let data = { table: relationTable };
      this.$http.post("/cardController/getAttributeList", data).then(info => {
        if (info.status == 200) {
          this.reftitleMsg = info.data;
          if (this.reftableMsg) {
            let refMsg = {
              reftitleMsg: this.reftitleMsg,
              reftableMsg: this.reftableMsg,
              relationTable: relationTable
            };
            this.$store.commit("getrefMsg", refMsg); //不论哪个函数先执行, 都会只执行一次
            this.$router.push({ path: "/config/relationTable" }); //两个数据都拿到之后再推送
          }
        }
      });
    },
    // 获取reference表格数据
    getrefMsg(relationTable) {
      let data = "?table=" + relationTable + "&pageNum=" + 1;
      this.$http.get("/cardController/getCardList" + data).then(info => {
        if (info.status == 200) {
          this.reftableMsg = info.data;
          if (this.reftitleMsg) {
            let refMsg = {
              reftitleMsg: this.reftitleMsg,
              reftableMsg: this.reftableMsg,
              relationTable: relationTable
            };
            this.$store.commit("getrefMsg", refMsg); //不论哪个函数先执行, 都只会执行一次
            this.$router.push({ path: "/config/relationTable" }); //两个数据都拿到之后再推送
          }
        }
      });
    },
    // 返回按钮
    back(){
      this.$router.go(-1);
    },
  }
};
</script>

<style lang="scss" scoped>
  #relationContainer{
    width: 100%;
    .head{
      overflow: hidden;
      margin-bottom: 15px;
      h1{
        float: left;
        margin-top: 20px;
        margin-left: 30px;
      }
      .select{
        float: left;
        margin-top: 20px;
        margin-left: 30px;
      }
      .back{
        float: right;
        height: 100%;
        line-height: 100%;
        margin-top: 20px;
        margin-right: 24px;
        font-size: 34px;
        cursor: pointer;
      }
    }
    .body{

    }
    .foot{

    }
  }
</style>

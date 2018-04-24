<template>
  <Layout>
  <div id="relationContainer">
    <Header style="padding: 0" class="layout-header-bar">
      <Form :label-width="80">
        <Row>
          <Col span="10">
            <FormItem label="查看:">
              <Select @on-change="selectN" v-model="selectNow" clearable filterable>
                <Option v-for="(item, index) in now" :value="item.value" :key="index">{{ item.label }} </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="10" offset="1">
            <FormItem label="新增:">
              <Select @on-change="selectF" label-in-value v-model="selectFuture" clearable filterable>
                <Option v-for="(item, index) in future" :value="item.value" :key="index">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="2" offset="1">
            <Button type="ghost" title="返回" icon="reply" @click="back"></Button>
          </Col>
        </Row>
      </Form>
    </Header>
    <Content class="contentTable">
      <div class="contentBody">
        <Table height="400" :columns="columns" :data="data" no-data-text="请选择要查看的数据"></Table>
      </div>
    </Content>
  </div>
  </Layout>
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
      zhongjianbiao: '',//纯中间表
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
          this.zhongjianbiao = info.data;
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
      // console.log(value);
      this.getTabledata(value);
    },
    // 添加数据下拉框变化的时候
    selectF(value){
      let relationTable = value.value.substring(0, value.value.length - 2);
      let NorOne = value.value.substring(value.value.length - 1, value.value.length);
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
      let thisId;//要删除的关系的Id
      let Description = value.row.Description;
      let data = this.relationMsg;
      let tableName = data.tableName;//表名
      // 找出要删除的关系的Id
      for(var k in data.relationMsg){
        if (this.domainnamen == k.split('Map_')[1]) {
          data.relationMsg[k].forEach((v, i) => {
            if (v.Description == Description) {
              thisId = v.Id;
            }
          })
        }
      }
      let delData = {};
      this.zhongjianbiao.forEach((v, i) => {
        if (v.domainname == this.domainnamen) {
          if (v.domainclass1 == tableName) {
            delData = {domainname: this.domainnamen, idobj1: this.tableId, idobj2: thisId};
          }
          if (v.domainclass2 == tableName) {
            delData = {domainname: this.domainnamen, idobj1: thisId, idobj2: this.tableId};
          }
        }
      })
      this.$http.delete('/relationController/relation', {data: delData}).then(info => {
        if (info.status == 200) {
          if (info.data == 'ok') {
            // 如果删除成功, 还要修改双向绑定的数据
            for (let k in this.relationMsg.relationMsg) {
              if (k.split('Map_')[1] == delData.domainname) {
                this.relationMsg.relationMsg[k].forEach((v, i) => {
                  if (v.Id == thisId) {
                    this.relationMsg.relationMsg[k].splice(i, 1);
                    this.getTabledata(tableName);
                    this.clearSingleSelect();
                  }
                });
              }
            }
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
    // 清空选中的内容
    clearSingleSelect(a){
      console.log(a);
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
  .ivu-layout-header{
    .ivu-form{
      .ivu-col{
        .ivu-form-item{
          margin-bottom: 0px;
          padding-top: 15px;
        }
      }
    }
  }
}
</style>

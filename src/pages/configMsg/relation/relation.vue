<template>
  <Layout>
    <div id="relationContainer">
      <Header style="padding: 0" class="layout-header-bar">
        <Form :label-width="80">
          <Row>
            <Col class="bread" span="7">
              <Breadcrumb>
                <BreadcrumbItem to="/config/tableList">配置信息</BreadcrumbItem>
                <!-- 原表名 -->
                <BreadcrumbItem to="">{{tableCname}}</BreadcrumbItem>
                <!-- 关系表名 -->
                <BreadcrumbItem v-if="relationTable && relationTableCname">{{relationTableCname}}</BreadcrumbItem>
                <BreadcrumbItem v-else-if="relationTable && !relationTableCname">{{relationTable}}</BreadcrumbItem>
              </Breadcrumb>
            </Col>
            <Col span="8">
              <FormItem label="查看:">
                <Select @on-change="selectN" v-model="selectNow" clearable filterable>
                  <Option v-for="(item, index) in now" :value="item.value" :key="index">{{ item.label }} </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="新增:">
                <Select @on-change="selectF" label-in-value v-model="selectFuture" clearable filterable>
                  <Option v-for="(item, index) in future" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
              </FormItem> 
            </Col>
            <Col span="1">
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
      tableId: "",//表的Id, 注意这个不是关系表的Id, 而是原表的Id
      tableName: '',// 原表表名
      tableCname: '', //原表中文名
      // now的关系表名
      relationTable: '',
      relationTableCname: '',//关系表中文名
      // 下拉框数据
      selectNow: "",
      selectFuture: "",
      domainname: '',//selectF的某个中间表名
      domainnamen: '', //selectN的某个中间表
      zhongjianbiao: '',//纯中间表
      now: [],
      future: [],
      isdisable: '', //权限
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
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    disabled: this.isdisable
                  },
                  style: {},
                  on: {
                    click: () => {
                        this.del(params, params.index)
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      this.relationJump(params, params.index);
                    }
                  }
                },
                "位置"
              ),
            ]);
          }
        }
      ],
      data: [],
      isExist: false,//判断该关系表是否存在
    };
  },
  props: [
    'ConfigTreeData'
  ],
  created() {
    this.getMsg();
    this.getDomainList();
  },
  methods: {
    // 获取到公共仓库的数据: 表Id 表名 关系表表名与内容
    getMsg() {
      this.CEtableMsg = JSON.parse(sessionStorage.getItem("gettableMsg")); //获取中英文对照表名
      this.relationMsg = this.$store.state.relationMsg; //获取到待渲染的关系数据
      this.tableName = this.relationMsg.tableName;//原表表名
      this.tableCname = this.EtoC(this.CEtableMsg, this.tableName);
      this.tableId = this.relationMsg.Id;//原表的纪录的Id
      this.isdisable = this.relationMsg.disabled;//关系的权限状态
    },
    // 一进入页面, 就请求表的关系表的数据, 获取到的是中间表, 需要处理数据获取到关系表
    getDomainList() {
      let data = "?table=" + this.tableName;
      this.$http.get("/relationController/getDomainList" + data).then(info => {
        if (info.status == 200 && Object.keys(info.data).length != 0) {
          // 找到关系表名, 找到n:1关系, 找到中文名, 并且拼在英文表名后面
          this.zhongjianbiao = info.data;//中间表集合, 里面的 v.domainname 是中间表名字, 与该条记录有关的表的集合
          let relationArr = [];//用来存储与该表的该条纪录有关系的表(多)
          info.data.forEach((v, i) => {
            let obj = {};//用来存储与该表的该条纪录有关系的表(单)
            let NandOne = v.domaincardinality.split(":"); //这是个数组, 存储的是表与关系表的 N:N 关系
            if (this.tableName == v.domainclass2) {
              obj.relationTable = v.domainclass1;//关系表名
              obj.crelationTable = this.EtoC(this.CEtableMsg, v.domainclass1, v.domainname);//关系表中文名, 用于渲染
              obj.domainname = v.domainname;//中间表名
              obj.NorOne = NandOne[0];//关系表与该表对应的关系
            } else {
              obj.relationTable = v.domainclass2;
              obj.crelationTable = this.EtoC(this.CEtableMsg, v.domainclass2, v.domainname);
              obj.domainname = v.domainname;
              obj.NorOne = NandOne[1];
            }
            relationArr.push(obj);
          });
          this.domainListMsg = relationArr;//表的关系表详情的集合
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
    // 获取future select数据
    getfutureSelectdata(){
      let data = this.domainListMsg;
      let future = [];
      data.forEach((v, i) => {
        let obj = {};
        obj.value = v.relationTable + '_' + v.NorOne;
        obj.label = v.crelationTable;
        future.push(obj);
      })
      this.future = future;
    },
    // 获取now select框数据
    getnowSelectdata(){
      let data = this.relationMsg;
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
    // 获取查看表格数据
    getTabledata(tableName) {
      // 根据传入的关系表的表名, 查找对应的信息
      let data = this.relationMsg; //有关系的表
      let arr = [];
      for (let k in data.relationMsg) {
        if (k.split('Map_')[1] == tableName) {
          this.domainnamen = k.split('Map_')[1];//删除关系时会用到
          data.relationMsg[k].forEach(function(v, i) {
            let obj = {};
            obj.Description = v.Description;
            obj.BeginDate = v.BeginDate;
            obj.Id = v.Id;
            arr.push(obj);
          });
        }
      }
      this.data = arr;
    },
    // 查看下拉框变化时触发
    selectN(value){
      this.domainListMsg.forEach((v, i) => {
        if (v.domainname == value) {
          this.relationTable = v.relationTable;
        }
      })
      // 获取关系表的中文名
      for(let k in this.CEtableMsg) {
        if (k == this.relationTable) {
          this.relationCtable = this.CEtableMsg[k];
        }
      }
      this.getTabledata(value);
      this.relationTableCname = this.EtoC(this.CEtableMsg, this.relationTable);
    },
    // 添加数据下拉框变化的时候
    selectF(value){
      let relationTable = value.value.substring(0, value.value.length - 2);
      let NorOne = value.value.substring(value.value.length - 1, value.value.length);
      this.domainListMsg.forEach((v, i) => {
        if (relationTable == v.relationTable) {
          this.domainname = v.domainname;//关系表名, 下面请求表格详细数据的时候要用
        }
      })
      this.getrefctMsg(relationTable, NorOne);
      this.getrefMsg(relationTable, NorOne);
    },

    //点击选中的关系表, 请求数据, 并且根据 N:1 关系判断表格是单选还是多选
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
                    this.selectNow = ''; //删除后, 清空已选中的关系表的名字
                    this.getTabledata(tableName);
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
    // 拼接中英文名字, 返回的是中间表英文名与关系表的中文名
    EtoC(CEtable, ename, domainname) {
      let cEname;
      for (let k in CEtable) {
        if (ename == k) {
          if (domainname) {
            cEname = domainname + `(` + CEtable[k] + `)`;
          } else {
            cEname = CEtable[k];
          }
        }
      }
      return cEname;
    },
    // 返回按钮
    back() {
      this.$router.go(-1);
    },
    // 关系记录跳转到对应表的所在的位置
    relationJump(value){
      this.gettableEname(this.ConfigTreeData, this.relationCtable);
      if (!this.isExist) {
        this.$Message.warning('您暂无权限查看该表');
        return false;//如果表不存在, 那么不进行跳转
      }
      let relationCtable = '';
      let pageNum = 1;
      let jiluId = value.row.Id;
      //1.根据英文表名, 获取中文表名, 方便跳转后侧边栏的搜索
      for(let k in this.CEtableMsg){
        if (k == this.relationTable) {
          relationCtable = this.CEtableMsg[k];
        }
      } 
      
      let data = '?table=' + this.relationTable + '&pageSize=20&id=' + value.row.Id;
      this.$http.get('/cardController/getPageCardByIndex' + data).then(info => {
        // console.log(info);
        if (info.status == 200) {
          pageNum = info.data;
          let msg = {
            relationCtable: relationCtable,//侧边栏搜索使用
            pageNum: pageNum,// 分页跳转使用
            jiluId: jiluId//最终定位使用
          }
          this.$emit('sTof', msg);
          this.$router.push({ path: "/config/tableList" });
        }
      })
    },
    // 获取对应表的英文名
    gettableEname(tableMenu, tableCname){
      tableMenu.forEach((v, i) => {
        if (v.children && v.children.length > 0) {
          this.gettableEname(v.children, tableCname);
        } else {
          if (v.title == tableCname) {
            // 找到了
            this.isExist = true;
          }
        }
      })
    },
  }
};
</script>

<style lang="scss">
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
  .ivu-breadcrumb{
    text-align: left;
    margin-left: 20px;
  }
  .ivu-form-item-label{
    padding: 10px 0 10px 10px;
    margin-left: 5px;
    width: 50px !important;
    text-align: left;
  }
  .ivu-form-item-content{
    margin-left: 55px !important;
  }
}
</style>
